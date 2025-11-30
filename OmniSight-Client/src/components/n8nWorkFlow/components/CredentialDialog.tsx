import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Key,
  Shield,
  Settings,
  Play,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  Zap,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CredentialTypeInfo } from "@/services/credentialService";

interface WorkflowInput {
  type: "credential" | "parameter";
  nodeName: string;
  field: string;
  value?: string;
  required: boolean;
  inputType: "text" | "email" | "password" | "url" | "number" | "textarea";
  description?: string;
  credentialType?: string;
}

interface CredentialData {
  [key: string]: string;
}

interface CredentialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  templateId: string;
  integrations?: string[];
  requiredCredentials: string[];
  workflowInputs?: WorkflowInput[];
  credentialTypes?: CredentialTypeInfo[];
  templateJson?: string;
  onCredentialsSubmit: (
    credentials: Record<string, CredentialData>,
    parameters: Record<string, string>,
    templateId: string,
    workflowName?: string,
    executionMode?: string,
    scheduledTime?: Date
  ) => Promise<boolean>;
  loading?: boolean;
}

// Helper to detect credential type from field name
const detectCredentialType = (field: string): string => {
  const fieldLower = field.toLowerCase();
  if (fieldLower.includes("smtp") || fieldLower.includes("email"))
    return "smtp";
  if (fieldLower.includes("oauth")) return "oauth2";
  if (fieldLower.includes("api") && fieldLower.includes("key")) return "api";
  if (fieldLower.includes("http") && fieldLower.includes("auth"))
    return "httpAuth";
  return "generic";
};

// Helper function to format date in local timezone for display
const formatLocalDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper function to create Date object preserving local timezone
const createLocalDate = (dateTimeString: string): Date => {
  const [datePart, timePart] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
};

// Helper function to detect if a workflow is polling/continuous
const isPollingWorkflow = (templateJson?: string): boolean => {
  if (!templateJson) return false;

  try {
    const workflow = JSON.parse(templateJson);
    const nodes = workflow.nodes || [];

    // Check for polling/continuous trigger nodes
    const pollingNodeTypes = [
      "n8n-nodes-base.scheduleTrigger",
      "n8n-nodes-base.cronTrigger",
      "n8n-nodes-base.interval",
      "n8n-nodes-base.polling",
    ];

    // Check if any node is a polling trigger
    for (const node of nodes) {
      const nodeType = node.type || "";

      // Check for schedule/cron triggers (these are polling)
      if (
        pollingNodeTypes.some(
          (type) => nodeType.includes(type) || nodeType === type
        )
      ) {
        return true;
      }

      // Check for nodes with polling parameters
      if (node.parameters) {
        const params = node.parameters;
        // Check for interval, polling, or continuous execution settings
        if (
          params.interval ||
          params.polling ||
          params.continuous ||
          params.schedule
        ) {
          return true;
        }
      }

      // Check for trigger nodes that indicate continuous execution
      if (
        nodeType.includes("trigger") &&
        (nodeType.includes("schedule") ||
          nodeType.includes("cron") ||
          nodeType.includes("interval"))
      ) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error detecting polling workflow:", error);
    return false;
  }
};

export const CredentialDialog = ({
  open,
  onOpenChange,
  templateName,
  templateId,
  requiredCredentials,
  workflowInputs = [],
  credentialTypes = [],
  templateJson,
  onCredentialsSubmit,
  loading = false,
}: CredentialDialogProps) => {
  const [customName, setCustomName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [credentialData, setCredentialData] = useState<
    Record<string, Record<string, string>>
  >({});
  const [parameters, setParameters] = useState<Record<string, string>>({});

  // Detect if this is a polling workflow
  const isPolling = isPollingWorkflow(templateJson);

  // Auto-set execution mode to "process" for polling workflows, otherwise default to "immediate"
  // For polling workflows, only "process" mode is available
  const [executionMode, setExecutionMode] = useState<
    "immediate" | "scheduled" | "process"
  >(isPolling ? "process" : "immediate");
  const [scheduledDateTime, setScheduledDateTime] = useState<string>("");

  // Update execution mode when template changes
  useEffect(() => {
    if (open && templateJson) {
      const polling = isPollingWorkflow(templateJson);
      if (polling) {
        // Lock to process mode for polling workflows
        setExecutionMode("process");
      } else {
        // Default to immediate for non-polling workflows
        setExecutionMode("immediate");
      }
      // Clear scheduled time when switching modes
      setScheduledDateTime("");
    }
  }, [open, templateJson]);

  useEffect(() => {
    if (open) {
      const initialCredentials: Record<string, Record<string, string>> = {};

      // Use dynamic credential types if available, otherwise fall back to detection
      if (credentialTypes.length > 0) {
        credentialTypes.forEach((credTypeInfo) => {
          const credFields: Record<string, string> = {};
          credTypeInfo.properties.forEach((prop) => {
            credFields[prop.name] = prop.defaultValue || "";
          });
          // Use the credential type name as key
          initialCredentials[credTypeInfo.name] = credFields;
        });
      } else {
        // Fallback to old detection method
        requiredCredentials.forEach((credType) => {
          const type = detectCredentialType(credType);
          if (type === "smtp") {
            initialCredentials[credType] = {
              user: "",
              password: "",
              host: "smtp.gmail.com",
              port: "465",
              secure: "true",
            };
          } else if (type === "api") {
            initialCredentials[credType] = { apiKey: "" };
          } else if (type === "oauth2") {
            initialCredentials[credType] = {
              clientId: "",
              clientSecret: "",
              accessToken: "",
            };
          } else {
            initialCredentials[credType] = { value: "" };
          }
        });
      }
      setCredentialData(initialCredentials);

      const initialParameters: Record<string, string> = {};
      workflowInputs.forEach((input) => {
        if (input.field.toLowerCase().includes("format")) {
          initialParameters[input.field] = input.value || "html";
        } else if (
          input.value &&
          !input.value.startsWith("=") &&
          !input.value.includes("{{")
        ) {
          initialParameters[input.field] = input.value;
        }
      });
      setParameters(initialParameters);

      setError(null);
      setExecutionMode("immediate");
      setScheduledDateTime("");
    }
  }, [open, requiredCredentials, workflowInputs, credentialTypes]);

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    Object.entries(credentialData).forEach(([credType, credFields]) => {
      // Find credential type info if available
      const credTypeInfo = credentialTypes.find((ct) => ct.name === credType);
      const fields = credFields as Record<string, string>;

      if (credTypeInfo && credTypeInfo.properties.length > 0) {
        // Validate based on dynamic properties
        credTypeInfo.properties.forEach((prop) => {
          if (prop.required && !fields[prop.name]) {
            errors.push(
              `${credTypeInfo.displayName || credType}: ${
                prop.displayName || prop.name
              } is required`
            );
          }
        });
      } else {
        // Fallback to old validation
        const type = detectCredentialType(credType);
        if (type === "smtp") {
          if (!fields.user || !fields.password)
            errors.push(
              `${formatFieldName(credType)}: Email and password are required`
            );
          if (!fields.host)
            errors.push(`${formatFieldName(credType)}: SMTP host is required`);
        } else if (type === "api") {
          if (!fields.apiKey)
            errors.push(`${formatFieldName(credType)}: API key is required`);
        } else if (type === "oauth2") {
          if (!fields.clientId || !fields.clientSecret)
            errors.push(
              `${formatFieldName(credType)}: Client ID and Secret are required`
            );
        } else {
          if (!fields.value)
            errors.push(`${formatFieldName(credType)}: Value is required`);
        }
      }
    });

    workflowInputs.forEach((input) => {
      if (input.required && !parameters[input.field])
        errors.push(formatFieldName(input.field));
    });

    // For polling workflows, execution mode is locked to "process", no validation needed
    if (!isPolling) {
      if (executionMode === "scheduled" && !scheduledDateTime)
        errors.push("Please select a scheduled date and time");
      if (executionMode === "scheduled" && scheduledDateTime) {
        const schedTime = createLocalDate(scheduledDateTime);
        if (schedTime <= new Date())
          errors.push("Scheduled time must be in the future");
      }
    }

    const emailFormatParam = Object.keys(parameters).find((key) =>
      key.toLowerCase().includes("format")
    );
    if (emailFormatParam && parameters[emailFormatParam]) {
      const formatValue = parameters[emailFormatParam].toLowerCase();
      if (formatValue !== "html" && formatValue !== "text")
        errors.push(`Email format must be either "html" or "text"`);
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const validation = validateForm();
    if (!validation.isValid) {
      setError(validation.errors.join(". "));
      setSubmitting(false);
      return;
    }

    try {
      const transformedCredentials: Record<string, CredentialData> = {};
      Object.entries(credentialData).forEach(([credType, credFields]) => {
        // Find credential type info if available
        const credTypeInfo = credentialTypes.find((ct) => ct.name === credType);
        const fields = credFields as Record<string, string>;

        if (credTypeInfo && credTypeInfo.properties.length > 0) {
          // Use dynamic properties
          const transformed: CredentialData = {};
          credTypeInfo.properties.forEach((prop) => {
            if (fields[prop.name] !== undefined) {
              transformed[prop.name] = fields[prop.name];
            }
          });
          transformedCredentials[credType] = transformed;
        } else {
          // Fallback to old transformation
          const type = detectCredentialType(credType);
          if (type === "smtp") {
            transformedCredentials[credType] = {
              user: fields.user || "",
              password: fields.password || "",
              host: fields.host || "smtp.gmail.com",
              port: fields.port || "465",
              secure: fields.secure || "true",
            };
          } else if (type === "api") {
            transformedCredentials[credType] = { apiKey: fields.apiKey || "" };
          } else if (type === "oauth2") {
            transformedCredentials[credType] = {
              clientId: fields.clientId || "",
              clientSecret: fields.clientSecret || "",
              accessToken: fields.accessToken || "",
            };
          } else {
            transformedCredentials[credType] = { value: fields.value || "" };
          }
        }
      });

      const cleanedParameters: Record<string, string> = { ...parameters };
      if (!cleanedParameters.emailFormat)
        cleanedParameters.emailFormat = "html";

      let scheduledTime: Date | undefined;
      // For polling workflows, execution mode is "process", no scheduled time
      if (!isPolling && executionMode === "scheduled" && scheduledDateTime)
        scheduledTime = createLocalDate(scheduledDateTime);

      // Ensure execution mode is set correctly for polling workflows
      const finalExecutionMode = isPolling ? "process" : executionMode;

      const success = await onCredentialsSubmit(
        transformedCredentials,
        cleanedParameters,
        templateId,
        customName || undefined,
        finalExecutionMode,
        scheduledTime
      );

      if (success) onOpenChange(false);
    } catch (error) {
      console.error("❌ Network error:", error);
      setError(`Network Error: ${(error as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace("Api", "API")
      .replace("Url", "URL")
      .replace("Smtp", "SMTP")
      .replace("_", " ")
      .replace(".", " - ");
  };

  const handleCredentialFieldChange = (
    credType: string,
    field: string,
    value: string
  ) => {
    setCredentialData((prev) => ({
      ...prev,
      [credType]: { ...prev[credType], [field]: value },
    }));
    if (error) setError(null);
  };

  const handleParameterChange = (key: string, value: string) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const isFormValid = (): boolean => validateForm().isValid;

  const getPlaceholder = (input: WorkflowInput) => {
    if (
      input.value &&
      !input.value.startsWith("=") &&
      !input.value.includes("{{")
    )
      return input.value;
    const field = input.field.toLowerCase();
    if (field.includes("email") && !field.includes("format"))
      return `recipient@example.com`;
    if (field.includes("url")) return `https://api.example.com/endpoint`;
    if (field.includes("subject")) return `Email subject`;
    if (field.includes("message") || field.includes("body"))
      return `Enter your message content`;
    if (field.includes("format")) return `html`;
    return `Enter ${formatFieldName(input.field)}`;
  };

  const getInputType = (
    input: WorkflowInput
  ): "text" | "email" | "password" | "url" | "number" | "textarea" => {
    const field = input.field.toLowerCase();
    if (field.includes("format")) return "text";
    if (field.includes("email") && !field.includes("format")) return "email";
    if (field.includes("url")) return "url";
    if (
      field.includes("phone") ||
      field.includes("number") ||
      field.includes("limit")
    )
      return "number";
    if (
      field.includes("message") ||
      field.includes("body") ||
      field.includes("content") ||
      field.includes("description")
    )
      return "textarea";
    return "text";
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return formatLocalDateTime(now);
  };

  const getButtonText = () => {
    if (submitting || loading) return { text: "Creating...", icon: Loader2 };

    if (isPolling) {
      return { text: "Create & Activate (Polling)", icon: Zap };
    }

    switch (executionMode) {
      case "immediate":
        return { text: "Create & Execute Now", icon: Play };
      case "scheduled":
        return { text: "Create & Schedule", icon: Calendar };
      default:
        return { text: "Create Workflow", icon: Settings };
    }
  };

  const getInfoMessage = () => {
    if (isPolling) {
      return "⚡ This is a polling/continuous workflow. It will automatically check for updates and execute accordingly.";
    }

    switch (executionMode) {
      case "immediate":
        return "✅ Workflow executes automatically right away";
      case "scheduled":
        return "📅 Workflow will execute at your scheduled time";
      default:
        return "Workflow is created and activated in n8n";
    }
  };

  const ButtonContent = getButtonText();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Configure {templateName}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Provide credentials, parameters, and execution settings
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Workflow Name */}
          <div className="space-y-2">
            <Label htmlFor="workflowName" className="text-sm font-medium">
              Workflow Name (Optional)
            </Label>
            <Input
              id="workflowName"
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={`${templateName} - Custom`}
              className="transition-colors focus:border-primary"
              disabled={submitting || loading}
            />
          </div>

          {/* Credentials Section */}
          {(requiredCredentials.length > 0 || credentialTypes.length > 0) && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-semibold">
                    Required Credentials (
                    {credentialTypes.length > 0
                      ? credentialTypes.length
                      : requiredCredentials.length}
                    )
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  These credentials will be securely stored and used by the
                  workflow
                </p>

                {credentialTypes.length > 0
                  ? credentialTypes.map((credTypeInfo) => (
                      <div
                        key={credTypeInfo.name}
                        className="space-y-3 p-4 border rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          <h4 className="text-sm font-medium">
                            {credTypeInfo.displayName || credTypeInfo.name}
                          </h4>
                          {credTypeInfo.nodes.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              (used in: {credTypeInfo.nodes.join(", ")})
                            </span>
                          )}
                        </div>
                        {credTypeInfo.properties.map((prop) => (
                          <div key={prop.name} className="space-y-1">
                            <Label
                              htmlFor={`${credTypeInfo.name}-${prop.name}`}
                              className="text-sm font-medium"
                            >
                              {prop.displayName || prop.name}
                              {prop.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </Label>
                            {prop.description && (
                              <p className="text-xs text-muted-foreground">
                                {prop.description}
                              </p>
                            )}
                            {prop.type === "password" ||
                            prop.name.toLowerCase().includes("password") ||
                            prop.name.toLowerCase().includes("secret") ? (
                              <Input
                                id={`${credTypeInfo.name}-${prop.name}`}
                                type="password"
                                value={
                                  credentialData[credTypeInfo.name]?.[
                                    prop.name
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleCredentialFieldChange(
                                    credTypeInfo.name,
                                    prop.name,
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  prop.placeholder ||
                                  `Enter ${prop.displayName || prop.name}`
                                }
                                required={prop.required}
                                disabled={submitting || loading}
                                className="transition-colors focus:border-primary"
                              />
                            ) : prop.type === "textarea" ||
                              prop.name.toLowerCase().includes("description") ||
                              prop.name.toLowerCase().includes("note") ? (
                              <Textarea
                                id={`${credTypeInfo.name}-${prop.name}`}
                                value={
                                  credentialData[credTypeInfo.name]?.[
                                    prop.name
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleCredentialFieldChange(
                                    credTypeInfo.name,
                                    prop.name,
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  prop.placeholder ||
                                  `Enter ${prop.displayName || prop.name}`
                                }
                                required={prop.required}
                                disabled={submitting || loading}
                                className="transition-colors focus:border-primary min-h-[80px]"
                              />
                            ) : (
                              <Input
                                id={`${credTypeInfo.name}-${prop.name}`}
                                type={
                                  prop.type === "number"
                                    ? "number"
                                    : prop.type === "email"
                                    ? "email"
                                    : "text"
                                }
                                value={
                                  credentialData[credTypeInfo.name]?.[
                                    prop.name
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleCredentialFieldChange(
                                    credTypeInfo.name,
                                    prop.name,
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  prop.placeholder ||
                                  `Enter ${prop.displayName || prop.name}`
                                }
                                required={prop.required}
                                disabled={submitting || loading}
                                className="transition-colors focus:border-primary"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ))
                  : requiredCredentials.map((credType) => (
                      <div key={credType}>
                        {renderCredentialFields(credType)}
                      </div>
                    ))}
              </div>
            </>
          )}

          {/* Parameters Section */}
          {workflowInputs.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-semibold">
                    Workflow Parameters ({workflowInputs.length})
                  </h3>
                </div>

                {workflowInputs.some(
                  (i) => i.nodeName === "Webhook Payload"
                ) && (
                  <div className="p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">Webhook Workflow Detected</p>
                        <p className="mt-1 text-xs">
                          These parameters will be sent as JSON payload when
                          triggering the workflow via webhook. Choose "Process"
                          mode for real-time webhook processing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {workflowInputs.map((input) => (
                  <div key={input.field} className="space-y-2">
                    {input.description && (
                      <span className="text-xs text-muted-foreground">
                        {input.description}
                      </span>
                    )}
                    {input.inputType === "textarea" ||
                    getInputType(input) === "textarea" ? (
                      <Textarea
                        id={`param-${input.field}`}
                        value={parameters[input.field] || ""}
                        onChange={(e) =>
                          handleParameterChange(input.field, e.target.value)
                        }
                        placeholder={getPlaceholder(input)}
                        className="transition-colors focus:border-primary min-h-[80px]"
                        required={input.required}
                        disabled={submitting || loading}
                      />
                    ) : (
                      <Input
                        id={`param-${input.field}`}
                        type={getInputType(input)}
                        value={parameters[input.field] || ""}
                        onChange={(e) =>
                          handleParameterChange(input.field, e.target.value)
                        }
                        placeholder={getPlaceholder(input)}
                        className="transition-colors focus:border-primary"
                        required={input.required}
                        disabled={submitting || loading}
                      />
                    )}
                    {input.field.toLowerCase().includes("format") && (
                      <p className="text-xs text-muted-foreground">
                        Must be "html" or "text" - default is "html"
                      </p>
                    )}
                    {input.nodeName === "Webhook Payload" && (
                      <p className="text-xs text-muted-foreground">
                        This value will be included in the webhook request
                        payload
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Execution Timing */}
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold">Execution Mode</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose how this workflow should be triggered
            </p>

            {isPolling ? (
              // For polling workflows, only show process mode (auto-detected)
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-4 border-2 border-purple-200 bg-purple-50 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-purple-900">
                        Continuous/Polling Mode
                      </span>
                      <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                        Auto-detected
                      </span>
                    </div>
                    <p className="text-sm text-purple-700 mt-1">
                      This workflow has been automatically detected as a
                      polling/continuous workflow. It will continuously check
                      for updates and execute accordingly.
                    </p>
                  </div>
                </div>
                <input type="hidden" value="process" name="executionMode" />
              </div>
            ) : (
              // For non-polling workflows, show immediate and scheduled options
              <RadioGroup
                value={executionMode}
                onValueChange={(value: "immediate" | "scheduled") =>
                  setExecutionMode(value)
                }
                disabled={submitting || loading}
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Label htmlFor="immediate" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-green-600" /> Execute
                      Immediately
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Runs the workflow right away after creation
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" /> Schedule
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Runs at a specific date and time
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            )}

            {executionMode === "scheduled" && (
              <Input
                type="datetime-local"
                value={scheduledDateTime}
                min={getMinDateTime()}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                className="mt-2 transition-colors focus:border-primary"
                disabled={submitting || loading}
              />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mt-2 text-red-600 bg-red-50 border border-red-200 rounded-md text-sm">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Info Message */}
          <div className="flex items-center gap-2 p-3 mt-2 text-sm text-muted-foreground bg-muted/10 border border-muted rounded-md">
            <Settings className="w-4 h-4 flex-shrink-0" />
            {getInfoMessage()}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={submitting || loading || !isFormValid()}
            >
              {ButtonContent.icon && (
                <ButtonContent.icon className="w-4 h-4 mr-2 animate-spin" />
              )}
              {ButtonContent.text}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  // Render Credential Fields
  function renderCredentialFields(credType: string) {
    const credFields = credentialData[credType];

    if (!credFields) return null;

    return Object.keys(credFields).map((field) => (
      <div key={field} className="space-y-1">
        <Label htmlFor={`${credType}-${field}`} className="text-sm font-medium">
          {formatFieldName(field)}
        </Label>
        <Input
          id={`${credType}-${field}`}
          type={field.toLowerCase().includes("password") ? "password" : "text"}
          value={credFields[field]}
          onChange={(e) =>
            handleCredentialFieldChange(credType, field, e.target.value)
          }
          placeholder={`Enter ${formatFieldName(field)}`}
          required
          disabled={submitting || loading}
          className="transition-colors focus:border-primary"
        />
      </div>
    ));
  }
};
