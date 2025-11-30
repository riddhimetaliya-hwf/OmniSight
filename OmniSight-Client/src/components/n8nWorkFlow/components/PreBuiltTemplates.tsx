import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TemplateCard } from "./TemplateCard";
import { CredentialDialog } from "./CredentialDialog";
import { CreateWorkflowButton } from "./CreateWorkflowButton";
import { CreateWorkflowDialog } from "./CreateWorkflowDialog";
import { Input } from "@/components/ui/input";
import { useToast } from "../hooks/use-toast";
import {
  credentialService,
  CredentialTypeInfo,
} from "@/services/credentialService";
import apiClient, { API_ENDPOINTS } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import {
  Rocket,
  ShoppingCart,
  Users,
  FileText,
  Briefcase,
  Calendar,
  MessageSquare,
  Target,
  Zap,
  LucideIcon,
  Mail,
  Database,
  Cloud,
  Bell,
  BarChart3,
  Globe,
  CreditCard,
  Smartphone,
  Camera,
  Music,
  BookOpen,
  Palette,
  Truck,
  Heart,
  Coffee,
} from "lucide-react";

// ===== INTERFACES =====

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  templateJson: string;
  requiredCredentials: string;
  integrations: string;
  icon: string;
  isPublished: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Workflow {
  id: number;
  name: string;
  description: string;
  active: boolean;
  triggerType: string;
  complexity: string;
  integrations: string;
  category: string;
  createdDate: string;
  _originalTemplate?: WorkflowTemplate;
}

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

interface ExecutionStatus {
  id: string;
  status: string;
  finished: boolean;
  startedAt: string;
  stoppedAt?: string;
}

interface NodeParameters {
  [key: string]: unknown;
}

interface WorkflowNode {
  type: string;
  name?: string;
  credentials?: Record<string, unknown>;
  parameters?: NodeParameters;
  [key: string]: unknown;
}

interface WorkflowJson {
  nodes?: WorkflowNode[];
  [key: string]: unknown;
}

interface CreateWorkflowResponse {
  workflowName: string;
  n8nWorkflowId: string;
  status: string;
  executionId?: string;
  createdAt: string;
}

// ===== CONSTANTS =====

const categoryIcons: Record<string, LucideIcon> = {
  crypto: Rocket,
  finance: CreditCard,
  health: Heart,
  analytics: BarChart3,
  ai: Zap,
  marketing: Target,
  research: BookOpen,
  communication: MessageSquare,
  monitoring: Bell,
  automation: Zap,
  "Business Process Automation": Rocket,
  "Web Scraping & Data Extraction": Database,
  "Marketing & Analytics": BarChart3,
  "E-Commerce": ShoppingCart,
  Productivity: Users,
  "Content Creation": FileText,
  "Personal Automation": Briefcase,
  "Events & Calendar": Calendar,
  "Social Media": MessageSquare,
  "Developer Tools": Zap,
  "Data Processing": Database,
  "Customer Support": Users,
  Finance: CreditCard,
  HR: Users,
  IoT: Zap,
  Security: Target,
  General: Rocket,
  Email: Mail,
  Cloud: Cloud,
  Notifications: Bell,
  Web: Globe,
  Payments: CreditCard,
  Mobile: Smartphone,
  Media: Camera,
  Music: Music,
  Education: BookOpen,
  Design: Palette,
  Logistics: Truck,
  Food: Coffee,
};

const USER_CONFIGURABLE_NODE_TYPES = [
  "n8n-nodes-base.emailSend",
  "n8n-nodes-base.httpRequest",
  "n8n-nodes-base.webhook",
  "n8n-nodes-base.slack",
  "n8n-nodes-base.telegram",
  "n8n-nodes-base.discord",
  "n8n-nodes-base.twilio",
  "n8n-nodes-base.sendGrid",
  "n8n-nodes-base.sms",
];

/**
 * List of node types to EXCLUDE from processing (non-executable nodes)
 */
const EXCLUDED_NODE_TYPES = [
  "n8n-nodes-base.stickyNote",
  "n8n-nodes-base.comment",
  "n8n-nodes-base.noOp",
  // Add other non-executable node types as needed
];

/**
 * List of INTERNAL workflow parameters that should NEVER be shown to users
 * These are common across ALL workflows
 */
const UNIVERSAL_INTERNAL_PARAMETERS = [
  // HTTP/API configuration
  "url",
  "endpoint",
  "path",
  "httpmethod",
  "method",
  "apikey",
  "baseurl",
  // Email content (usually pre-defined in workflows)
  "subject",
  "message",
  "body",
  "content",
  "html",
  "text",
  // Format and technical settings
  "emailformat",
  "format",
  "responsebody",
  "responsemode",
  "responsedata",
  "options",
  "operation",
  "resource",
  "authentication",
  "headers",
  // Webhook/Trigger settings
  "webhookid",
  "responsemode",
  "triggertimes",
  "cron",
  "interval",
  "timezone",
  "executeonce",
  "mode",
  // System/technical fields
  "id",
  "type",
  "position",
  "typeversion",
  "color",
  "width",
  "height",
  "functioncode",
  "jscode",
  "code",
  "js",
  "query",
  "filters",
  // Fixed/common values in workflows
  "bitcoin",
  "usd",
  "price",
  "timestamp",
  "status",
  "limit",
  "returnall",
  "calendar",
  "documentid",
  "sheetname",
  "spreadsheetid",
  "driveid",
  "channelid",
  "workspaceid",
  "folderid",
  "fileid",
];

/**
 * List of USER-CONFIGURABLE parameters that should ALWAYS be shown
 * These take priority over internal parameter detection
 */
const USER_CONFIGURABLE_PARAMETERS = [
  "email",
  "fromemail",
  "toemail",
  "sendto",
  "recipient",
  "sender",
  "phonenumber",
  "phone",
  "number",
  "name",
  "username",
  "userid",
  "customerid",
  "orderid",
  "productid",
  "address",
  "city",
  "country",
  "zipcode",
  "postalcode",
  "amount",
  "price",
  "quantity",
  "value",
  "search",
  "searchterm",
  "keyword",
  "query",
  "filter",
  "criteria",
  "prompt",
  "question",
  "title",
  "description",
];

/**
 * Patterns that indicate INTERNAL workflow logic (not user input)
 */
const INTERNAL_LOGIC_PATTERNS = [
  // API endpoints and URLs
  /https?:\/\/[^\s]+/,
  /api\./,
  /\.com/,
  /\.org/,
  /\.io/,
  // Pre-defined content patterns
  /alert/i,
  /notification/i,
  /update/i,
  /report/i,
  /webhook/i,
  /trigger/i,
  /^\{\{.*\}\}$/, // n8n expressions
  /^=.*$/, // n8n expressions
  /^\/.*$/, // URL paths
  /^[A-Z_]+$/, // CONSTANT_CASE
];

const SYSTEM_FIELDS_BLACKLIST = [
  "options",
  "operation",
  "resource",
  "returnAll",
  "limit",
  "filters",
  "additionalFields",
  "updateFields",
  "conditions",
  "rules",
  "calendar",
  "documentId",
  "sheetName",
  "spreadsheetId",
  "driveId",
  "folderId",
  "fileId",
  "channelId",
  "workspaceId",
  "webhookId",
  "executeOnce",
  "alwaysOutputData",
  "noticeNoData",
  "continueOnFail",
  "retryOnFail",
  "waitBetweenTries",
  "triggerTimes",
  "timeZone",
  "interval",
  "cronExpression",
  "executeAt",
  "executeOnce",
  "mode",
  "id",
  "type",
  "position",
  "typeVersion",
  "name",
  "color",
  "width",
  "height",
  "timeMin",
  "timeMax",
  "timeAfter",
  "timeBefore",
  "respondWith",
  "responseBody",
  "responseMode",
  "responseData",
  "functionCode",
  "jsCode",
  "code",
];

const USER_INPUT_FIELD_WHITELIST = [
  "email",
  "fromemail",
  "toemail",
  "sendto",
  "recipient",
  "sender",
  "subject",
  "message",
  "body",
  "text",
  "content",
  "html",
  "chatid",
  "channel",
  "username",
  "phonenumber",
  "phone",
  "url",
  "endpoint",
  "path",
  "query",
  "payload",
  "data",
  "method",
  "headers",
  "authentication",
  "title",
  "description",
  "name",
  "value",
  "prompt",
  "question",
  "search",
  "searchterm",
  "keyword",
  "filter",
  "criteria",
  "apikey",
  "token",
  "secret",
  "password",
  "username",
  "key",
  "clientid",
  "clientsecret",
  "accesstoken",
  "refreshtoken",
];

// ===== HELPER FUNCTIONS =====

const shouldExcludeNode = (nodeType: string): boolean => {
  return EXCLUDED_NODE_TYPES.some(
    (excludedType) =>
      nodeType.includes(excludedType.replace("n8n-nodes-base.", "")) ||
      nodeType === excludedType
  );
};

const shouldExcludeParameter = (
  fieldName: string,
  nodeType: string,
  value?: string
): boolean => {
  const lowerField = fieldName.toLowerCase();
  const lowerNodeType = nodeType.toLowerCase();

  if (
    USER_CONFIGURABLE_PARAMETERS.some(
      (userParam) =>
        lowerField === userParam.toLowerCase() ||
        lowerField.includes(userParam.toLowerCase())
    )
  ) {
    return false;
  }

  if (
    UNIVERSAL_INTERNAL_PARAMETERS.some(
      (internalParam) =>
        lowerField === internalParam.toLowerCase() ||
        lowerField.includes(internalParam.toLowerCase())
    )
  ) {
    return true;
  }

  if (value && typeof value === "string") {
    const hasInternalLogic = INTERNAL_LOGIC_PATTERNS.some((pattern) =>
      pattern.test(value)
    );

    if (hasInternalLogic) {
      return true;
    }
  }

  if (lowerNodeType.includes("webhook")) {
    const webhookInternalFields = [
      "path",
      "httpmethod",
      "responsemode",
      "options",
    ];
    if (webhookInternalFields.some((field) => lowerField.includes(field))) {
      return true;
    }
  }

  if (lowerNodeType.includes("http") || lowerNodeType.includes("api")) {
    const httpInternalFields = [
      "url",
      "method",
      "authentication",
      "headers",
      "qs",
    ];
    if (httpInternalFields.some((field) => lowerField.includes(field))) {
      return true;
    }
  }

  if (lowerNodeType.includes("email") || lowerNodeType.includes("smtp")) {
    const emailInternalFields = ["subject", "message", "body", "html", "text"];
    if (emailInternalFields.some((field) => lowerField.includes(field))) {
      if (
        value &&
        (value.includes("{{") ||
          value.includes("Alert") ||
          value.includes("Notification") ||
          value.length > 100)
      ) {
        return true;
      }
    }
  }

  const isLikelyUserField = USER_INPUT_FIELD_WHITELIST.some((field) =>
    lowerField.includes(field.toLowerCase())
  );

  if (!isLikelyUserField) {
    return true;
  }
  return false;
};

const isLikelyUserInputField = (fieldName: string): boolean => {
  const lowerField = fieldName.toLowerCase();

  const userFieldPatterns = [
    "email",
    "from",
    "to",
    "subject",
    "message",
    "body",
    "content",
    "name",
    "phone",
    "address",
    "city",
    "country",
    "url",
    "title",
    "description",
    "text",
    "value",
    "amount",
    "price",
    "quantity",
    "username",
    "userid",
    "customerid",
    "orderid",
    "productid",
  ];

  return userFieldPatterns.some((pattern) => lowerField.includes(pattern));
};

const scanForExpressionReferences = (
  obj: any,
  references: Set<string>,
  depth: number = 0
): void => {
  if (depth > 5) return;

  if (typeof obj === "string") {
    const patterns = [
      /\{\{\s*\$json\.(\w+)\s*\}\}/g,
      /=\{\{\s*\$json\.(\w+)\s*\}\}/g,
      /\{\{\s*\$json\["(\w+)"\]\s*\}\}/g,
      /=\{\{\s*\$json\["(\w+)"\]\s*\}\}/g,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(obj)) !== null) {
        const fieldName = match[1];
        if (isLikelyUserInputField(fieldName)) {
          references.add(fieldName);
        }
      }
    });
  } else if (typeof obj === "object" && obj !== null) {
    Object.values(obj).forEach((value) => {
      scanForExpressionReferences(value, references, depth + 1);
    });
  }
};

const determineInputTypeFromFieldName = (
  fieldName: string
): "text" | "email" | "password" | "url" | "number" | "textarea" => {
  const lower = fieldName.toLowerCase();

  if (lower.includes("email")) return "email";
  if (lower.includes("password") || lower.includes("secret")) return "password";
  if (lower.includes("url") || lower.includes("link")) return "url";
  if (
    lower.includes("phone") ||
    lower.includes("amount") ||
    lower.includes("price") ||
    lower.includes("quantity")
  )
    return "number";
  if (
    lower.includes("message") ||
    lower.includes("body") ||
    lower.includes("content") ||
    lower.includes("description")
  )
    return "textarea";

  return "text";
};

const determineInputType = (
  key: string,
  value: unknown
): "text" | "email" | "password" | "url" | "number" | "textarea" => {
  const keyLower = key.toLowerCase();

  if (keyLower.includes("format")) return "text";
  if (keyLower.includes("email") && !keyLower.includes("format"))
    return "email";
  if (
    keyLower.includes("password") ||
    keyLower.includes("secret") ||
    keyLower.includes("key") ||
    keyLower.includes("token")
  )
    return "password";
  if (keyLower.includes("url") || keyLower.includes("endpoint")) return "url";
  if (
    keyLower.includes("phone") ||
    keyLower.includes("number") ||
    keyLower.includes("limit") ||
    keyLower.includes("temperature")
  )
    return "number";
  if (
    keyLower.includes("message") ||
    keyLower.includes("body") ||
    keyLower.includes("content") ||
    keyLower.includes("description") ||
    keyLower.includes("prompt")
  )
    return "textarea";

  return "text";
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

const getPlaceholder = (input: WorkflowInput) => {
  if (
    input.value &&
    !input.value.startsWith("=") &&
    !input.value.includes("{{")
  ) {
    return input.value;
  }

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

const generateParameterDescription = (
  key: string,
  value: unknown,
  nodeName: string
): string => {
  const keyFormatted = key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  if (
    typeof value === "string" &&
    value.length > 0 &&
    !value.startsWith("=") &&
    !value.includes("{{")
  ) {
    return `Current value: ${value}`;
  }

  return `${keyFormatted} for ${nodeName}`;
};

const extractUserParametersFromObject = (
  obj: NodeParameters,
  nodeName: string,
  inputs: WorkflowInput[],
  nodeType: string,
  path: string = "",
  expressionReferences?: Set<string>
): void => {
  Object.keys(obj).forEach((key) => {
    const fullPath = path ? `${path}.${key}` : key;
    const value = obj[key];
    const keyLower = key.toLowerCase();

    if (
      shouldExcludeParameter(
        fullPath,
        nodeType,
        typeof value === "string" ? value : undefined
      )
    ) {
      return;
    }

    if (
      SYSTEM_FIELDS_BLACKLIST.some((field) => keyLower === field.toLowerCase())
    ) {
      return;
    }

    if (expressionReferences && expressionReferences.has(key)) {
      return;
    }

    if (typeof value === "object" && value !== null && "__rl" in value) {
      return;
    }

    if (typeof value === "string") {
      const isExpression = value.startsWith("=") || value.includes("{{");

      if (isExpression) {
        return;
      }

      const inputType = determineInputType(key, value);

      inputs.push({
        type: "parameter",
        nodeName,
        field: fullPath,
        value: value,
        required: false,
        inputType,
        description: generateParameterDescription(key, value, nodeName),
      });
    }

    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !("__rl" in value)
    ) {
      extractUserParametersFromObject(
        value as NodeParameters,
        nodeName,
        inputs,
        nodeType,
        fullPath,
        expressionReferences
      );
    }
  });
};

const extractCredentialDetails = (
  templateJson: string
): {
  credentials: string[];
  credentialNodes: Record<string, string[]>;
} => {
  try {
    const workflow: WorkflowJson = JSON.parse(templateJson);
    const credentials: Set<string> = new Set();
    const credentialNodes: Record<string, string[]> = {};

    if (!workflow.nodes) return { credentials: [], credentialNodes: {} };

    workflow.nodes.forEach((node: WorkflowNode) => {
      if (node.credentials && typeof node.credentials === "object") {
        Object.entries(node.credentials).forEach(
          ([credentialType, credentialData]) => {
            const credentialName =
              (credentialData as any)?.name || credentialType;

            credentials.add(credentialName);
            if (!credentialNodes[credentialName]) {
              credentialNodes[credentialName] = [];
            }
            credentialNodes[credentialName].push(
              node.name || node.type.replace("n8n-nodes-base.", "")
            );
          }
        );
      }
    });

    return {
      credentials: Array.from(credentials),
      credentialNodes,
    };
  } catch (error) {
    console.error("Error extracting credential details:", error);
    return { credentials: [], credentialNodes: {} };
  }
};

const extractUniqueCredentialsFromWorkflow = (
  templateJson: string
): string[] => {
  const { credentials } = extractCredentialDetails(templateJson);
  return credentials;
};

const extractUserInputsFromWorkflow = (
  templateJson: string
): WorkflowInput[] => {
  try {
    const workflow: WorkflowJson = JSON.parse(templateJson);
    const inputs: WorkflowInput[] = [];
    const expressionReferences: Set<string> = new Set();
    const processedCredentials = new Set<string>();

    if (!workflow.nodes) return inputs;

    const executableNodes = workflow.nodes.filter((node: WorkflowNode) => {
      return !shouldExcludeNode(node.type);
    });

    const hasWebhook = executableNodes.some(
      (node) => node.type === "n8n-nodes-base.webhook"
    );

    if (hasWebhook) {
      executableNodes.forEach((node) => {
        if (node.parameters && typeof node.parameters === "object") {
          scanForExpressionReferences(node.parameters, expressionReferences);
        }
      });

      expressionReferences.forEach((fieldName) => {
        if (!shouldExcludeParameter(fieldName, "webhook")) {
          const inputType = determineInputTypeFromFieldName(fieldName);
          inputs.push({
            type: "parameter",
            nodeName: "Webhook Payload",
            field: fieldName,
            required: true,
            inputType,
            description: `Value for ${formatFieldName(
              fieldName
            )} (sent to webhook)`,
          });
        }
      });
    }

    executableNodes.forEach((node: WorkflowNode) => {
      const nodeName = node.name || node.type.replace("n8n-nodes-base.", "");

      if (node.credentials && typeof node.credentials === "object") {
        Object.entries(node.credentials).forEach(
          ([credType, credentialData]) => {
            const credentialName = (credentialData as any)?.name || credType;
            const credentialKey = `${credType}-${credentialName}`;

            if (!processedCredentials.has(credentialKey)) {
              processedCredentials.add(credentialKey);
              inputs.push({
                type: "credential",
                nodeName,
                field: credentialName,
                required: true,
                inputType: "password",
                description: `Credentials for ${credentialName}`,
                credentialType: credType,
              });
            }
          }
        );
      }
    });

    // Process parameters
    executableNodes.forEach((node: WorkflowNode) => {
      const nodeName = node.name || node.type.replace("n8n-nodes-base.", "");
      const nodeType = node.type;

      if (node.parameters && typeof node.parameters === "object") {
        const isUserConfigurable = USER_CONFIGURABLE_NODE_TYPES.some((type) =>
          nodeType.includes(type.replace("n8n-nodes-base.", ""))
        );

        if (isUserConfigurable) {
          extractUserParametersFromObject(
            node.parameters,
            nodeName,
            inputs,
            nodeType,
            "",
            expressionReferences
          );
        }
      }
    });

    return inputs;
  } catch (error) {
    console.error("Error extracting user inputs:", error);
    return [];
  }
};

const extractCredentialsFromWorkflow = (templateJson: string): string[] => {
  const { credentials } = extractCredentialDetails(templateJson);
  return credentials;
};

const extractParametersFromWorkflow = (
  templateJson: string
): WorkflowInput[] => {
  const inputs = extractUserInputsFromWorkflow(templateJson);
  return inputs.filter((input) => input.type === "parameter");
};

const extractIntegrationsFromWorkflow = (templateJson: string): string[] => {
  try {
    const workflow: WorkflowJson = JSON.parse(templateJson);
    const integrations: Set<string> = new Set();

    if (workflow.nodes) {
      const executableNodes = workflow.nodes.filter(
        (node: WorkflowNode) => !shouldExcludeNode(node.type)
      );

      executableNodes.forEach((node: WorkflowNode) => {
        if (
          node.type &&
          node.type !== "n8n-nodes-base.manualTrigger" &&
          node.type !== "n8n-nodes-base.scheduleTrigger"
        ) {
          const integrationName = node.type
            .replace("n8n-nodes-base.", "")
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .replace("Http", "HTTP")
            .replace("Api", "API")
            .replace("Smtp", "SMTP")
            .trim();

          if (integrationName && integrationName.length > 0) {
            integrations.add(integrationName);
          }
        }
      });
    }

    return Array.from(integrations);
  } catch (error) {
    return [];
  }
};

const checkExecutionStatus = async (
  executionId: number
): Promise<ExecutionStatus | null> => {
  try {
    const response = await apiClient.get<ExecutionStatus>(
      API_ENDPOINTS.EXECUTIONS.STATUS(executionId)
    );

    if (response.success && response.data) {
      return {
        id: response.data.id,
        status: response.data.status,
        finished: response.data.finished,
        startedAt: response.data.startedAt,
        stoppedAt: response.data.stoppedAt,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error checking execution status for ${executionId}:`, error);
    return null;
  }
};

// ===== MAIN COMPONENT =====

export const PreBuiltTemplates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null
  );
  const [credentialDialogOpen, setCredentialDialogOpen] = useState(false);
  const [createWorkflowDialogOpen, setCreateWorkflowDialogOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [triggerFilter, setTriggerFilter] = useState("all");
  const [createLoading, setCreateLoading] = useState(false);
  const [activeExecutions, setActiveExecutions] = useState<Set<number>>(
    new Set()
  );
  const [credentialNodes, setCredentialNodes] = useState<
    Record<string, string[]>
  >({});
  const [credentialTypes, setCredentialTypes] = useState<CredentialTypeInfo[]>(
    []
  );
  const [loadingCredentialTypes, setLoadingCredentialTypes] = useState(false);

  const parseJsonArray = (jsonString: string): string[] => {
    try {
      if (!jsonString || jsonString === "[]") return [];
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const convertToWorkflow = useCallback(
    (template: WorkflowTemplate, index: number): Workflow => {
      const { credentials: extractedCredentials } = extractCredentialDetails(
        template.templateJson
      );
      const extractedIntegrations = extractIntegrationsFromWorkflow(
        template.templateJson
      );

      const integrationsArray =
        extractedIntegrations.length > 0
          ? extractedIntegrations
          : parseJsonArray(template.integrations);
      const credentialsArray =
        extractedCredentials.length > 0
          ? extractedCredentials
          : parseJsonArray(template.requiredCredentials);

      const allIntegrations = [
        ...new Set([...integrationsArray, ...credentialsArray]),
      ];

      return {
        id: index + 1,
        name: template.name,
        description: template.description || "No description available",
        active: template.isPublished,
        triggerType: "Manual",
        complexity: "Intermediate",
        integrations: allIntegrations.join(", "),
        category: template.category || "automation",
        createdDate: template.createdAt || new Date().toISOString(),
        _originalTemplate: template,
      };
    },
    []
  );

  useEffect(() => {
    const fetchWorkflowTemplates = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get<WorkflowTemplate[]>(
          API_ENDPOINTS.WORKFLOW_TEMPLATES
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.error || `HTTP error! status: ${response.status}`
          );
        }

        const templatesData: WorkflowTemplate[] = response.data;

        const convertedWorkflows = templatesData.map(convertToWorkflow);
        setWorkflows(convertedWorkflows);

        const uniqueCategories = Array.from(
          new Set(
            convertedWorkflows
              .map((w: Workflow) => w.category?.trim())
              .filter(
                (category: string | undefined): category is string =>
                  !!category && category.length > 0
              )
          )
        );
        setCategories(uniqueCategories);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowTemplates();
  }, [convertToWorkflow]);

  useEffect(() => {
    if (activeExecutions.size === 0) return;

    const interval = setInterval(async () => {
      const newActiveExecutions = new Set<number>();
      let hasChanges = false;

      for (const executionId of activeExecutions) {
        try {
          const status = await checkExecutionStatus(executionId);
          if (status && !status.finished) {
            newActiveExecutions.add(executionId);
          } else {
            hasChanges = true;
          }
        } catch (error) {
          console.error(`Error checking execution ${executionId}:`, error);
          newActiveExecutions.add(executionId);
        }
      }

      if (hasChanges) {
        setActiveExecutions(newActiveExecutions);

        if (newActiveExecutions.size === 0) {
          console.log("All executions completed!");
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeExecutions]);

  const handleWorkflowClick = async (workflow: Workflow) => {
    setSelectedWorkflow(workflow);

    if (workflow._originalTemplate) {
      const { credentialNodes } = extractCredentialDetails(
        workflow._originalTemplate.templateJson
      );
      setCredentialNodes(credentialNodes);

      // Fetch credential types from n8n API
      setLoadingCredentialTypes(true);
      try {
        const credTypes =
          await credentialService.getCredentialTypesFromWorkflow(
            workflow._originalTemplate.templateJson
          );
        setCredentialTypes(credTypes);
        console.log("✅ Fetched credential types:", credTypes);
      } catch (error) {
        console.error("❌ Error fetching credential types:", error);
        setCredentialTypes([]); // Fallback to empty array
      } finally {
        setLoadingCredentialTypes(false);
      }
    } else {
      console.log("Required credentials:", workflow.integrations);
      setCredentialTypes([]);
    }

    setCredentialDialogOpen(true);
  };

  const handleCreateWorkflow = () => {
    setCreateWorkflowDialogOpen(true);
  };

  const handleSaveNewWorkflow = async (name: string, description: string) => {
    setCreateWorkflowDialogOpen(false);
    navigate("/workflow-builder", {
      state: {
        workflowId: "new",
        workflowName: name,
        workflowDescription: description,
      },
    });
  };

  const handleCredentialsSubmit = async (
    credentials: Record<string, any>,
    parameters: Record<string, string>,
    templateId: string,
    customName?: string,
    executionMode?: string,
    scheduledTime?: Date
  ): Promise<boolean> => {
    // Store execution mode for use in response messages
    const currentExecutionMode = executionMode || "immediate";
    try {
      setCreateLoading(true);

      const originalTemplate = workflows.find(
        (w) => w.id === parseInt(templateId)
      );

      if (!originalTemplate || !originalTemplate._originalTemplate) {
        alert("❌ Template not found. Please try again.");
        return false;
      }

      const backendTemplateId = originalTemplate._originalTemplate.id;
      const templateName = originalTemplate._originalTemplate.name;
      const workflowDisplayName = customName || templateName;

      console.log("🚀 Creating and executing workflow with:", {
        backendTemplateId,
        templateName,
        credentials: Object.keys(credentials),
        parameters: Object.keys(parameters),
        executionMode,
        scheduledTime: scheduledTime?.toString(),
      });

      const cleanedParameters: Record<string, string> = { ...parameters };

      if (
        cleanedParameters.emailFormat &&
        !["html", "text"].includes(cleanedParameters.emailFormat.toLowerCase())
      ) {
        cleanedParameters.emailFormat = "html";
      } else if (!cleanedParameters.emailFormat) {
        cleanedParameters.emailFormat = "html";
      }

      const serializedCredentials: Record<string, any> = {};
      Object.entries(credentials).forEach(([key, value]) => {
        serializedCredentials[key] = value;
      });

      const payload: any = {
        templateId: backendTemplateId,
        credentials: serializedCredentials,
        parameters: cleanedParameters,
        customName: customName || null,
        executionMode: executionMode || "immediate",
        scheduleType: executionMode === "scheduled" ? "scheduled" : "immediate",
      };

      if (
        executionMode === "scheduled" &&
        scheduledTime instanceof Date &&
        !isNaN(scheduledTime.getTime())
      ) {
        const year = scheduledTime.getFullYear();
        const month = String(scheduledTime.getMonth() + 1).padStart(2, "0");
        const day = String(scheduledTime.getDate()).padStart(2, "0");
        const hours = String(scheduledTime.getHours()).padStart(2, "0");
        const minutes = String(scheduledTime.getMinutes()).padStart(2, "0");
        const seconds = String(scheduledTime.getSeconds()).padStart(2, "0");

        const localTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        payload.scheduledTime = localTimeString;

        console.log("📅 Time conversion:", {
          original: scheduledTime.toString(),
          localTimeString: localTimeString,
          toISOString: scheduledTime.toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }

      const response = await apiClient.post(
        API_ENDPOINTS.WORKFLOWS.CREATE_AND_EXECUTE,
        payload
      );

      const displayNameForErrors =
        workflowDisplayName || templateName || "the workflow";

      if (!response.success) {
        // Handle API errors
        const errorMessage = response.error || "Failed to create workflow";

        toast({
          variant: "destructive",
          title: "❌ Unable to Create Workflow",
          description: `We encountered an issue while creating ${displayNameForErrors}. ${errorMessage}`,
          duration: 10000,
        });
        return false;
      }

      if (response.success && response.data) {
        const data = response.data;

        // Get workflow name for personalized messages (define early for use in errors/warnings)
        const workflowName =
          data.workflowName ||
          workflowDisplayName ||
          templateName ||
          "your workflow";

        // Display errors from n8n if any - Show prominently in right corner
        if (
          data.errors &&
          Array.isArray(data.errors) &&
          data.errors.length > 0
        ) {
          // Show first error immediately, others after a short delay
          data.errors.forEach((error: string, index: number) => {
            setTimeout(() => {
              toast({
                variant: "destructive",
                title: `⚠️ Issue with ${workflowName}`,
                description: error,
                duration: 12000, // Show for 12 seconds for errors
              });
            }, index * 300); // Stagger multiple errors slightly
          });
        }

        // Display warnings from n8n if any
        if (
          data.warnings &&
          Array.isArray(data.warnings) &&
          data.warnings.length > 0
        ) {
          data.warnings.forEach((warning: string, index: number) => {
            setTimeout(() => {
              toast({
                variant: "default",
                title: `ℹ️ Note about ${workflowName}`,
                description: warning,
                duration: 8000,
              });
            }, index * 200);
          });
        }

        // Handle different response statuses with user-friendly messages
        if (data.status === "executing" && data.executionId) {
          const executionId = parseInt(data.executionId);

          if (!isNaN(executionId)) {
            toast({
              variant: "default",
              title: "🚀 Workflow is Running!",
              description: `${workflowName} has been created and is now executing. You can track its progress in the executions view.`,
              duration: 6000,
            });
            setActiveExecutions((prev) => new Set(prev).add(executionId));
          } else {
            toast({
              variant: "default",
              title: "🚀 Workflow Started",
              description: `${workflowName} has been created and execution has begun.`,
              duration: 6000,
            });
          }
        } else if (data.status === "scheduled") {
          toast({
            variant: "default",
            title: "📅 Workflow Scheduled Successfully",
            description: `${workflowName} has been scheduled and will run automatically at the specified time.`,
            duration: 6000,
          });
        } else if (data.status === "activated") {
          toast({
            variant: "default",
            title: "✨ Workflow is Active",
            description: `${workflowName} has been activated and is ready to process triggers automatically.`,
            duration: 6000,
          });
        } else if (data.status === "saved_and_activated") {
          // Determine if it's a polling workflow based on execution mode
          const isPollingMode = currentExecutionMode === "process";
          const modeDescription = isPollingMode
            ? "It will continuously monitor for updates and execute automatically."
            : "It's now active and ready to run when triggered.";

          toast({
            variant: "default",
            title: "✅ Workflow Created Successfully",
            description: `${workflowName} has been created and activated in n8n. ${modeDescription}`,
            duration: 7000,
          });
        } else if (data.status === "created_without_n8n") {
          toast({
            variant: "default",
            title: "⚠️ Workflow Saved (Limited Mode)",
            description: `${workflowName} has been saved to the database, but n8n is currently unavailable. The workflow will be synced when n8n becomes available.`,
            duration: 8000,
          });
        } else {
          // Default success message
          toast({
            variant: "default",
            title: "✅ Workflow Created",
            description: `${workflowName} has been created successfully and is ready to use.`,
            duration: 6000,
          });
        }
        setCredentialDialogOpen(false);
        return true;
      }
    } catch (error) {
      console.error("❌ Network/Exception error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Network error occurred";
      const displayName = customName || templateName || "the workflow";
      toast({
        variant: "destructive",
        title: "❌ Connection Error",
        description: `Unable to connect to the server while creating ${displayName}. Please check your connection and try again.`,
        duration: 10000,
      });
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const triggers = useMemo(() => {
    const trigs = Array.from(
      new Set(
        workflows
          .map((w) => w.triggerType?.trim())
          .filter(
            (trigger: string | undefined): trigger is string =>
              !!trigger && trigger.length > 0
          )
      )
    );
    return ["all", ...trigs];
  }, [workflows]);

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((workflow) => {
      const matchesSearch =
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || workflow.category === categoryFilter;
      const matchesTrigger =
        triggerFilter === "all" || workflow.triggerType === triggerFilter;
      return matchesSearch && matchesCategory && matchesTrigger;
    });
  }, [workflows, searchQuery, categoryFilter, triggerFilter]);

  return (
    <>
      <div className="min-h-screen p-8 space-y-8 bg-canvas-bg">
        <div className="flex justify-between items-center animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Workflow Templates
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Choose from {workflows.length} pre-built templates or create your
              own workflow from scratch
            </p>
            {activeExecutions.size > 0 && (
              <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-md">
                🚀 {activeExecutions.size} workflow
                {activeExecutions.size > 1 ? "s" : ""} currently executing...
                <div className="text-xs text-blue-500 mt-1">
                  Automatically monitoring progress - you'll see results soon!
                </div>
              </div>
            )}
          </div>
          <CreateWorkflowButton onClick={handleCreateWorkflow} />
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search templates by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card border-border"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trigger:</span>
              <Select value={triggerFilter} onValueChange={setTriggerFilter}>
                <SelectTrigger className="w-[180px] bg-card border-border">
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {triggers
                    .filter((t) => t !== "all" && t.length > 0)
                    .map((trigger) => (
                      <SelectItem key={trigger} value={trigger}>
                        {trigger}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Category:</span>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] bg-card border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories
                    .filter((c) => c !== "all" && c.length > 0)
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground ml-auto">
              {filteredWorkflows.length}{" "}
              {filteredWorkflows.length === 1 ? "template" : "templates"}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-muted-foreground">
                Loading templates...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-2">Failed to load templates</div>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkflows.map((workflow) => (
                <TemplateCard
                  key={workflow.id}
                  title={workflow.name}
                  description={workflow.description}
                  icon={categoryIcons[workflow.category] || Rocket}
                  category={workflow.category || "General"}
                  trigger={workflow.triggerType || "Manual"}
                  requiredCredentials={
                    workflow._originalTemplate
                      ? extractCredentialsFromWorkflow(
                          workflow._originalTemplate.templateJson
                        )
                      : workflow.integrations
                      ? workflow.integrations.split(",").map((i) => i.trim())
                      : []
                  }
                  onClick={() => handleWorkflowClick(workflow)}
                />
              ))}
            </div>

            {filteredWorkflows.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No templates found matching your criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <CredentialDialog
        open={credentialDialogOpen}
        onOpenChange={setCredentialDialogOpen}
        templateName={selectedWorkflow?.name || ""}
        templateId={selectedWorkflow?.id.toString() || ""}
        integrations={
          selectedWorkflow?._originalTemplate
            ? extractIntegrationsFromWorkflow(
                selectedWorkflow._originalTemplate.templateJson
              )
            : selectedWorkflow?.integrations
            ? selectedWorkflow.integrations.split(",").map((i) => i.trim())
            : []
        }
        requiredCredentials={
          selectedWorkflow?._originalTemplate
            ? extractCredentialsFromWorkflow(
                selectedWorkflow._originalTemplate.templateJson
              )
            : selectedWorkflow?.integrations
            ? selectedWorkflow.integrations.split(",").map((i) => i.trim())
            : []
        }
        workflowInputs={
          selectedWorkflow?._originalTemplate
            ? extractParametersFromWorkflow(
                selectedWorkflow._originalTemplate.templateJson
              )
            : []
        }
        templateJson={
          selectedWorkflow?._originalTemplate?.templateJson || undefined
        }
        credentialTypes={credentialTypes}
        onCredentialsSubmit={handleCredentialsSubmit}
        loading={createLoading || loadingCredentialTypes}
      />

      <CreateWorkflowDialog
        open={createWorkflowDialogOpen}
        onOpenChange={setCreateWorkflowDialogOpen}
        onSave={handleSaveNewWorkflow}
      />
    </>
  );
};
