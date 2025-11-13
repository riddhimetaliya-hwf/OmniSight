
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Search, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface ConnectorOption {
  id: string;
  name: string;
  description: string;
  category: "ERP" | "CRM" | "Communication" | "File Storage";
  logoSrc: string;
}

interface ConnectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddConnector: (connector: ConnectorOption) => void;
}

// Connector options
const connectorOptions: ConnectorOption[] = [
  // ERP Systems
  {
    id: "sap",
    name: "SAP",
    description: "Connect to your SAP ERP system",
    category: "ERP",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
  },
  {
    id: "oracle",
    name: "Oracle",
    description: "Connect to your Oracle ERP system",
    category: "ERP",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  },
  // CRM Systems
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Connect to your Salesforce CRM",
    category: "CRM",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
  },
  {
    id: "dynamics",
    name: "Microsoft Dynamics",
    description: "Connect to your Microsoft Dynamics CRM",
    category: "CRM",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Microsoft_Dynamics_365_logo.svg",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Connect to your HubSpot CRM",
    category: "CRM",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Hubspot-logo.png/1200px-Hubspot-logo.png",
  },
  // Communication Systems
  {
    id: "outlook",
    name: "Outlook",
    description: "Connect to your Outlook email",
    category: "Communication",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/1024px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Connect to your Gmail account",
    category: "Communication",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Connect to your Microsoft Teams",
    category: "Communication",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/1024px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Connect to your Slack workspace",
    category: "Communication",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png",
  },
  // File Storage Systems
  {
    id: "gdrive",
    name: "Google Drive",
    description: "Connect to your Google Drive",
    category: "File Storage",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png",
  },
  {
    id: "onedrive",
    name: "OneDrive",
    description: "Connect to your Microsoft OneDrive",
    category: "File Storage",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg/1024px-Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg.png",
  },
];

export const ConnectorModal: React.FC<ConnectorModalProps> = ({
  open,
  onOpenChange,
  onAddConnector,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConnector, setSelectedConnector] = useState<ConnectorOption | null>(null);
  const [step, setStep] = useState<"select" | "configure" | "auth" | "mapping" | "complete">("select");
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  // Filter connectors based on search term
  const filteredConnectors = connectorOptions.filter(
    (connector) =>
      connector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connector.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connector.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group connectors by category
  const connectorsByCategory = filteredConnectors.reduce<Record<string, ConnectorOption[]>>(
    (acc, connector) => {
      if (!acc[connector.category]) {
        acc[connector.category] = [];
      }
      acc[connector.category].push(connector);
      return acc;
    },
    {}
  );

  const handleSelectConnector = (connector: ConnectorOption) => {
    setSelectedConnector(connector);
    setStep("configure");
  };

  const handleNext = () => {
    switch (step) {
      case "configure":
        if (!apiKey.trim()) {
          toast({
            title: "API Key Required",
            description: "Please enter an API key to continue.",
            variant: "destructive",
          });
          return;
        }
        setStep("auth");
        // Simulate OAuth flow
        setTimeout(() => {
          setStep("mapping");
        }, 1500);
        break;
      case "mapping":
        setStep("complete");
        break;
      case "complete":
        if (selectedConnector) {
          onAddConnector(selectedConnector);
          handleReset();
          onOpenChange(false);
        }
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case "configure":
        setSelectedConnector(null);
        setStep("select");
        break;
      case "auth":
        setStep("configure");
        break;
      case "mapping":
        setStep("auth");
        break;
      case "complete":
        setStep("mapping");
        break;
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedConnector(null);
    setStep("select");
    setApiKey("");
  };

  // Handle dialog close
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when the dialog is closed
      handleReset();
    }
    onOpenChange(newOpen);
  };

  const renderSelectStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Add a New Connector</DialogTitle>
        <DialogDescription className="text-apple-gray">
          Select a system to connect to your OmniSight Integration Hub
        </DialogDescription>
      </DialogHeader>

      <div className="relative my-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-apple-gray" size={18} />
        <Input
          className="pl-10 py-2.5 border-gray-200 rounded-apple-sm focus:ring-apple-blue focus:border-apple-blue"
          placeholder="Search for a connector..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-y-auto max-h-[400px] pr-2 -mr-2">
        {Object.entries(connectorsByCategory).length > 0 ? (
          Object.entries(connectorsByCategory).map(([category, connectors]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-apple-gray mb-3">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    className={cn(
                      "flex items-center p-3 rounded-apple text-left",
                      "border border-gray-200 hover:border-apple-blue",
                      "transition-all duration-200 transform hover:translate-y-[-1px]",
                      "bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-apple-blue/30"
                    )}
                    onClick={() => handleSelectConnector(connector)}
                  >
                    <div className="h-10 w-10 rounded-sm overflow-hidden flex items-center justify-center bg-gray-50 mr-3">
                      <img
                        src={connector.logoSrc}
                        alt={`${connector.name} logo`}
                        className="max-h-8 max-w-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{connector.name}</h4>
                      <p className="text-xs text-apple-gray">{connector.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-apple-gray mb-2">No connectors found</div>
            <p className="text-sm text-apple-gray">Try adjusting your search term</p>
          </div>
        )}
      </div>
    </>
  );

  const renderConfigureStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center">
          <button
            onClick={handleBack}
            className="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          Configure {selectedConnector?.name}
        </DialogTitle>
        <DialogDescription className="text-apple-gray">
          Enter your API key to connect to {selectedConnector?.name}
        </DialogDescription>
      </DialogHeader>

      <div className="my-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            className="border-gray-200 rounded-apple-sm focus:ring-apple-blue focus:border-apple-blue"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-apple-gray">
            You can find your API key in your {selectedConnector?.name} dashboard.
          </p>
        </div>

        <div className="bg-gray-50 rounded-apple-sm p-4">
          <h4 className="text-sm font-medium mb-2">Authentication Options</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="api-auth"
                name="auth-method"
                className="text-apple-blue focus:ring-apple-blue/30"
                defaultChecked
              />
              <label htmlFor="api-auth" className="ml-2 text-sm">
                API Key
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="oauth-auth"
                name="auth-method"
                className="text-apple-blue focus:ring-apple-blue/30"
              />
              <label htmlFor="oauth-auth" className="ml-2 text-sm">
                OAuth 2.0
              </label>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <button
          className="btn-apple-secondary"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          className="btn-apple"
          onClick={handleNext}
        >
          Connect
        </button>
      </DialogFooter>
    </>
  );

  const renderAuthStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center">
          <button
            onClick={handleBack}
            className="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          Authenticating
        </DialogTitle>
        <DialogDescription className="text-apple-gray">
          Connecting to {selectedConnector?.name}...
        </DialogDescription>
      </DialogHeader>

      <div className="my-12 flex flex-col items-center justify-center text-center">
        <div className="animate-pulse mb-4">
          <svg
            className="animate-spinner text-apple-blue"
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 6V2" />
            <path d="m4.93 10.93-.66-.66" />
            <path d="M2 18H6" />
            <path d="M18 18h4" />
            <path d="m19.07 7.07.66-.66" />
            <path d="M22 12h-4" />
            <path d="m12 22 4-4-4-4" />
            <path d="M12 14v8" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Authenticating your account</h3>
        <p className="text-apple-gray text-sm max-w-xs">
          We're connecting to your {selectedConnector?.name} account. This will only take a moment...
        </p>
      </div>
    </>
  );

  const renderMappingStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center">
          <button
            onClick={handleBack}
            className="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          Field Mapping
        </DialogTitle>
        <DialogDescription className="text-apple-gray">
          Configure how data fields map between systems
        </DialogDescription>
      </DialogHeader>

      <div className="my-6 space-y-6 max-h-[400px] overflow-y-auto pr-2 -mr-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">Data Fields</h4>
            <button className="text-xs text-apple-blue hover:underline">
              AI-assisted mapping
            </button>
          </div>

          <div className="space-y-3">
            {/* Sample field mappings */}
            {[
              { source: "User", target: "Contact" },
              { source: "Organization", target: "Account" },
              { source: "Task", target: "Activity" },
              { source: "Message", target: "Communication" },
              { source: "Document", target: "Attachment" },
            ].map((mapping, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-apple-sm p-3 flex items-center"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium">{mapping.source}</div>
                  <div className="text-xs text-apple-gray">Source field</div>
                </div>
                <ArrowRight size={16} className="text-apple-gray mx-3" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{mapping.target}</div>
                  <div className="text-xs text-apple-gray">Target field</div>
                </div>
                <button className="ml-2 p-1.5 text-apple-gray hover:text-apple-blue rounded-full hover:bg-gray-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <button
          className="btn-apple-secondary"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          className="btn-apple"
          onClick={handleNext}
        >
          Complete Setup
        </button>
      </DialogFooter>
    </>
  );

  const renderCompleteStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Setup Complete</DialogTitle>
        <DialogDescription className="text-apple-gray">
          {selectedConnector?.name} has been successfully connected
        </DialogDescription>
      </DialogHeader>

      <div className="my-8 flex flex-col items-center justify-center text-center">
        <div className="mb-4 bg-green-50 rounded-full p-4">
          <CheckCircle className="text-apple-success h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium mb-2">Integration Successful</h3>
        <p className="text-apple-gray text-sm max-w-sm mb-4">
          You've successfully connected {selectedConnector?.name} to your OmniSight Integration Hub.
          Data will begin syncing immediately.
        </p>
        <div className="bg-gray-50 rounded-apple p-4 w-full text-left">
          <h4 className="text-sm font-medium mb-2">Integration Details</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-apple-gray">Service:</span>
              <span>{selectedConnector?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-apple-gray">Status:</span>
              <span className="text-apple-success">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-apple-gray">Fields Mapped:</span>
              <span>5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-apple-gray">Sync Frequency:</span>
              <span>15 minutes</span>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <button
          className="btn-apple"
          onClick={handleNext}
        >
          Done
        </button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl bg-white shadow-apple-modal rounded-apple-lg border-none p-6 sm:p-8">
        {step === "select" && renderSelectStep()}
        {step === "configure" && renderConfigureStep()}
        {step === "auth" && renderAuthStep()}
        {step === "mapping" && renderMappingStep()}
        {step === "complete" && renderCompleteStep()}
      </DialogContent>
    </Dialog>
  );
};

export default ConnectorModal;
