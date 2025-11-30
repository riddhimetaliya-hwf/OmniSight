import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, X, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import apiClient, { API_ENDPOINTS } from "@/services/api";

interface N8NIframeBuilderProps {
  workflowId: string;
  onSaveSuccess: () => void;
}

export const N8NIframeBuilder: React.FC<N8NIframeBuilderProps> = ({
  workflowId,
  onSaveSuccess,
}) => {
  const [authToken, setAuthToken] = useState<string>("");
  const [workflowName, setWorkflowName] = useState<string>("");
  const [workflowDescription, setWorkflowDescription] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [n8nWorkflowId, setN8nWorkflowId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [n8nError, setN8nError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Get n8n authentication token with JWT
  const initializeN8N = async () => {
    try {
      setIsLoading(true);
      setN8nError(null);

      console.log("🔐 Fetching JWT token from .NET backend...");

      const response = await apiClient.get<{ token: string }>(
        API_ENDPOINTS.N8N_AUTH.AUTH_TOKEN,
        { credentials: "include" }
      );

      console.log("📡 Response status:", response.status);

      if (!response.success || !response.data) {
        console.error("❌ HTTP error response:", {
          status: response.status,
          error: response.error,
        });
        throw new Error(
          response.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = response.data;
      console.log("✅ Auth API response received:", data);

      if (data.token) {
        setAuthToken(data.token);
        console.log("✅ n8n initialized successfully with token");

        // Load existing workflow data if editing
        if (workflowId && workflowId !== "new") {
          await loadWorkflowData();
        }
      } else {
        console.error("❌ Missing token in response:", {
          availableKeys: Object.keys(data),
          tokenPresent: !!data.token,
        });
        throw new Error(
          `No token in response. Available keys: ${Object.keys(data).join(
            ", "
          )}`
        );
      }
    } catch (error) {
      console.error("❌ Failed to initialize n8n:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setN8nError(errorMessage);
      toast.error("Failed to load workflow editor", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load workflow data from backend
  const loadWorkflowData = async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.N8N_AUTH.WORKFLOW(workflowId),
        { credentials: "include" }
      );

      if (response.success && response.data) {
        const result = response.data;
        if (result.success && result.data) {
          const workflowData = result.data;
          setWorkflowName(
            workflowData.WorkflowName ||
              workflowData.workflowName ||
              "New Workflow"
          );
          setWorkflowDescription(
            workflowData.WorkflowDescription ||
              workflowData.workflowDescription ||
              ""
          );
          setIsActive(workflowData.Status === "active");
          setN8nWorkflowId(
            workflowData.N8nWorkflowId || workflowData.n8nWorkflowId || ""
          );
        }
      } else {
        console.warn("Workflow not found or error loading workflow data");
      }
    } catch (error) {
      console.error("Failed to load workflow data:", error);
    }
  };

  useEffect(() => {
    initializeN8N();
  }, [workflowId]);

  // Construct URL for EMBEDDED n8n editor
  const getN8nEditorUrl = () => {
    if (!authToken) return "";

    const baseUrl = import.meta.env?.VITE_N8N_URL || "http://localhost:5678";

    let workflowIdToLoad = "new";
    if (n8nWorkflowId) {
      workflowIdToLoad = n8nWorkflowId;
    }

    // Use embedded/headless mode parameters
    const editorUrl = `${baseUrl}/workflow/${workflowIdToLoad}?token=${encodeURIComponent(
      authToken
    )}&embed=true&headless=true&hideUi=true`;
    console.log("🔗 Generated embedded editor URL:", editorUrl);
    return editorUrl;
  };

  // Force hide ALL n8n UI elements
  const forceHideN8nUI = () => {
    if (!iframeRef.current?.contentDocument) return;

    // Method 1: Inject CSS to hide everything except canvas
    const style = iframeRef.current.contentDocument.createElement("style");
    style.textContent = `
      /* HIDE EVERYTHING except the editor canvas and node creator */
      body > *:not(#app) {
        display: none !important;
      }
      
      #app {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
      }
      
      /* Hide specific n8n elements */
      header, .header, .main-header, .sidebar, .navigation, .nav-bar,
      [data-test-id="workflow-sidebar"], [data-test-id="main-sidebar"],
      .ndv-header, .page-heading, .main-sidebar, .layout-sidebar,
      nav, .nav, [role="navigation"],
      .user-menu, .settings-menu, .router-link,
      a[href*="/home"], a[href*="/workflows"] {
        display: none !important;
        visibility: hidden !important;
      }
      
      /* Show only the editor canvas area */
      .editor-wrapper {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999 !important;
      }
      
      .canvas-wrapper {
        width: 100vw !important;
        height: 100vh !important;
      }
      
      /* Ensure node creator is visible */
      .node-creator, [data-test-id="node-creator"] {
        display: block !important;
        z-index: 10000 !important;
      }
    `;

    iframeRef.current.contentDocument.head.appendChild(style);

    // Method 2: Remove elements directly from DOM
    setTimeout(() => {
      const elementsToRemove =
        iframeRef.current?.contentDocument?.querySelectorAll(
          "header, .header, .main-header, .sidebar, .navigation, nav, .main-sidebar"
        );
      elementsToRemove?.forEach((el) => {
        el.remove();
      });
    }, 500);
  };

  const handleSave = async () => {
    if (!workflowName.trim()) {
      toast.error("Workflow name is required");
      return;
    }

    setIsSaving(true);
    try {
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        status: isActive ? "active" : "inactive",
      };

      let response;
      if (workflowId === "new" || !workflowId) {
        // Create new workflow
        response = await apiClient.post(
          API_ENDPOINTS.N8N_AUTH.CREATE_WORKFLOW,
          workflowData,
          { credentials: "include" }
        );
      } else {
        // Update existing workflow
        response = await apiClient.put(
          API_ENDPOINTS.N8N_AUTH.WORKFLOW(workflowId),
          workflowData,
          { credentials: "include" }
        );
      }

      if (response.success && response.data) {
        const result = response.data as {
          success?: boolean;
          error?: string;
          data?: {
            n8nWorkflowId?: string;
          };
        };

        if (result.success !== false) {
          if (result.data?.n8nWorkflowId) {
            setN8nWorkflowId(result.data.n8nWorkflowId);
          }

          toast.success("Workflow saved successfully!", {
            description: "Your workflow has been saved to the database.",
          });

          onSaveSuccess();
        } else {
          throw new Error(result.error || "Failed to save workflow");
        }
      } else {
        throw new Error(response.error || "Failed to save workflow");
      }
    } catch (error: unknown) {
      console.error("Failed to save workflow:", error);
      toast.error("Failed to save workflow", {
        description: (error as Error).message || "Please try again later.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetryAuth = () => {
    setN8nError(null);
    setIsLoading(true);
    setTimeout(() => {
      initializeN8N();
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-muted-foreground">
            Loading workflow editor...
          </span>
        </div>
      </div>
    );
  }

  if (n8nError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load editor</h3>
          <p className="text-muted-foreground mb-4">{n8nError}</p>
          <div className="space-y-2">
            <Button onClick={handleRetryAuth} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {/* Your Custom Header - This is the ONLY UI users see */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card shadow-sm">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving || !workflowName.trim()}
                className="bg-primary hover:bg-primary/90"
                size="sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Workflow
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* n8n Editor - Should show ONLY the canvas */}
      <div className="flex-1 relative">
        {authToken ? (
          <iframe
            ref={iframeRef}
            src={getN8nEditorUrl()}
            className="w-full h-full border-0"
            title="Workflow Editor"
            allow="clipboard-read; clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-storage-access-by-user-activation"
            onLoad={() => {
              console.log("✅ n8n editor loaded - forcing UI to hide");
              toast.success("Editor Ready", {
                description: "Start building your workflow",
              });

              // Force hide n8n UI repeatedly
              const hideInterval = setInterval(() => {
                forceHideN8nUI();
              }, 1000);

              // Stop after 10 seconds
              setTimeout(() => clearInterval(hideInterval), 10000);
            }}
            onError={(e) => {
              console.error("❌ Failed to load n8n editor:", e);
              toast.error("Failed to load editor");
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Editor Not Ready</h3>
              <p className="text-muted-foreground">Authentication required</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
