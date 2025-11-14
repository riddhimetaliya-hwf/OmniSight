import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TemplateCard } from "./TemplateCard";
import { CredentialDialog } from "./CredentialDialog";
import { CreateWorkflowButton } from "./CreateWorkflowButton";
import { CreateWorkflowDialog } from "./CreateWorkflowDialog";
import { Input } from "@/components/ui/input";
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

// Updated interface for WorkflowTemplate data (from /api/workflow-templates)
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

// Frontend Workflow interface that matches your existing structure
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

// Interface for dynamic user inputs
interface WorkflowInput {
  type: 'credential' | 'parameter';
  nodeName: string;
  field: string;
  value?: string;
  required: boolean;
  inputType: 'text' | 'email' | 'password' | 'url' | 'number' | 'textarea';
  description?: string;
}

// FIXED: Interface for execution status - executionId is now a number (BIGINT)
interface ExecutionStatus {
  id: string;
  status: string;
  finished: boolean;
  startedAt: string;
  stoppedAt?: string;
}

// Interface for node parameters
interface NodeParameters {
  [key: string]: unknown;
}

// Interface for workflow node
interface WorkflowNode {
  type: string;
  name?: string;
  credentials?: Record<string, unknown>;
  parameters?: NodeParameters;
  [key: string]: unknown;
}

// Interface for workflow JSON
interface WorkflowJson {
  nodes?: WorkflowNode[];
  [key: string]: unknown;
}

// Interface for create workflow response
interface CreateWorkflowResponse {
  workflowName: string;
  n8nWorkflowId: string;
  status: string;
  executionId?: string; // This is now a BIGINT as string from backend
  createdAt: string;
}

const categoryIcons: Record<string, LucideIcon> = {
  "crypto": Rocket,
  "finance": CreditCard,
  "health": Heart,
  "analytics": BarChart3,
  "ai": Zap,
  "marketing": Target,
  "research": BookOpen,
  "communication": MessageSquare,
  "monitoring": Bell,
  "automation": Zap,
  "Business Process Automation": Rocket,
  "Web Scraping & Data Extraction": Database,
  "Marketing & Analytics": BarChart3,
  "E-Commerce": ShoppingCart,
  "Productivity": Users,
  "Content Creation": FileText,
  "Personal Automation": Briefcase,
  "Events & Calendar": Calendar,
  "Social Media": MessageSquare,
  "Developer Tools": Zap,
  "Data Processing": Database,
  "Customer Support": Users,
  "Finance": CreditCard,
  "HR": Users,
  "IoT": Zap,
  "Security": Target,
  "General": Rocket,
  "Email": Mail,
  "Cloud": Cloud,
  "Notifications": Bell,
  "Web": Globe,
  "Payments": CreditCard,
  "Mobile": Smartphone,
  "Media": Camera,
  "Music": Music,
  "Education": BookOpen,
  "Design": Palette,
  "Logistics": Truck,
  "Food": Coffee,
};

// FIXED: Enhanced function to extract ALL user inputs from workflow
const extractUserInputsFromWorkflow = (templateJson: string): WorkflowInput[] => {
  try {
    const workflow: WorkflowJson = JSON.parse(templateJson);
    const inputs: WorkflowInput[] = [];
    
    if (workflow.nodes) {
      workflow.nodes.forEach((node: WorkflowNode) => {
        const nodeName = node.name || node.type.replace('n8n-nodes-base.', '');
        
        // 1. Extract credentials
        if (node.credentials && typeof node.credentials === 'object') {
          Object.keys(node.credentials).forEach(credType => {
            inputs.push({
              type: 'credential',
              nodeName,
              field: credType,
              required: true,
              inputType: 'password',
              description: `Credentials for ${credType}`
            });
          });
        }
        
        // 2. Extract parameters that need user input
        if (node.parameters && typeof node.parameters === 'object') {
          extractParametersFromObject(node.parameters, nodeName, inputs);
        }

        // 3. Special handling for email nodes - extract email fields
        if (node.type === 'n8n-nodes-base.emailSend') {
          // Add fromEmail field
          inputs.push({
            type: 'parameter',
            nodeName: 'Send Email',
            field: 'fromEmail',
            value: (node.parameters as NodeParameters)?.fromEmail as string || '',
            required: true,
            inputType: 'email',
            description: 'Sender email address'
          });
          
          // Add toEmail field  
          inputs.push({
            type: 'parameter',
            nodeName: 'Send Email',
            field: 'toEmail',
            value: (node.parameters as NodeParameters)?.toEmail as string || '',
            required: true,
            inputType: 'email',
            description: 'Recipient email address'
          });

          // Add emailFormat field with proper default
          inputs.push({
            type: 'parameter',
            nodeName: 'Send Email',
            field: 'emailFormat',
            value: 'html', // Default to 'html' instead of empty
            required: false,
            inputType: 'text',
            description: 'Email format (html or text) - default: html'
          });
        }
      });
    }
    
    return inputs;
  } catch (error) {
    console.error('Error parsing workflow JSON for user inputs:', error);
    return [];
  }
};

// Helper function to recursively extract parameters
const extractParametersFromObject = (obj: NodeParameters, nodeName: string, inputs: WorkflowInput[], path: string = ''): void => {
  Object.keys(obj).forEach(key => {
    const fullPath = path ? `${path}.${key}` : key;
    const value = obj[key];
    
    // Check if this is a user input field
    if (shouldExtractAsUserInput(key, value)) {
      const inputType = determineInputType(key, value);
      
      inputs.push({
        type: 'parameter',
        nodeName,
        field: fullPath,
        value: typeof value === 'string' ? value : undefined,
        required: true,
        inputType,
        description: generateParameterDescription(key, value, nodeName)
      });
    }
    
    // Recursively check nested objects
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      extractParametersFromObject(value as NodeParameters, nodeName, inputs, fullPath);
    }
  });
};

// FIXED: Better field detection to avoid mixing email format with email addresses
const shouldExtractAsUserInput = (key: string, value: unknown): boolean => {
  const keyLower = key.toLowerCase();
  
  // Skip n8n expressions (they start with = or {{)
  if (typeof value === 'string' && (value.startsWith('=') || value.includes('{{'))) {
    return false;
  }
  
  // Skip empty objects/arrays
  if (value === null || value === undefined || value === '') {
    return false;
  }
  
  // Skip n8n-specific fields
  const skipFields = ['options', 'rule', 'interval', 'position', 'id', 'type', 'webhookId', 'executeOnce', 'alwaysOutputData'];
  if (skipFields.includes(keyLower)) {
    return false;
  }
  
  // Include common input fields
  const inputFields = [
    'email', 'fromemail', 'toemail', 'subject', 'message', 'body', 'content', 'text',
    'url', 'username', 'password', 'apikey', 'token', 'secret', 'key',
    'name', 'title', 'description', 'phone', 'address', 'city', 'country',
    'channel', 'query', 'limit', 'offset', 'filter', 'search', 'prompt',
    'temperature', 'maxtokens', 'model', 'endpoint', 'method', 'headers'
  ];
  
  return inputFields.some(field => keyLower.includes(field));
};

// FIXED: Better input type detection to prevent email format being treated as email
const determineInputType = (key: string, value: unknown): 'text' | 'email' | 'password' | 'url' | 'number' | 'textarea' => {
  const keyLower = key.toLowerCase();
  
  // CRITICAL FIX: emailFormat should be text, NOT email
  if (keyLower.includes('format')) return 'text';
  
  if (keyLower.includes('email') && !keyLower.includes('format')) return 'email';
  if (keyLower.includes('password') || keyLower.includes('secret') || keyLower.includes('key') || keyLower.includes('token')) return 'password';
  if (keyLower.includes('url')) return 'url';
  if (keyLower.includes('phone') || keyLower.includes('number') || keyLower.includes('limit') || keyLower.includes('temperature')) return 'number';
  if (keyLower.includes('message') || keyLower.includes('body') || keyLower.includes('content') || keyLower.includes('description') || keyLower.includes('prompt')) return 'textarea';
  
  return 'text';
};

// Add this near your other helper functions
const formatFieldName = (field: string) => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace('Api', 'API')
    .replace('Url', 'URL')
    .replace('Smtp', 'SMTP')
    .replace('_', ' ')
    .replace('.', ' - ');
};

// FIXED: Better placeholder generation
const getPlaceholder = (input: WorkflowInput) => {
  if (input.value && !input.value.startsWith('=') && !input.value.includes('{{')) {
    return input.value;
  }
  
  const field = input.field.toLowerCase();
  
  if (field.includes('email') && !field.includes('format')) return `recipient@example.com`;
  if (field.includes('url')) return `https://api.example.com/endpoint`;
  if (field.includes('subject')) return `Email subject`;
  if (field.includes('message') || field.includes('body')) return `Enter your message content`;
  if (field.includes('format')) return `html`; // Specific placeholder for format fields
  
  return `Enter ${formatFieldName(input.field)}`;
};

// Generate description for parameter fields
const generateParameterDescription = (key: string, value: unknown, nodeName: string): string => {
  const keyFormatted = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  
  if (typeof value === 'string' && value.length > 0 && !value.startsWith('=') && !value.includes('{{')) {
    return `Current value: ${value}`;
  }
  
  return `${keyFormatted} for ${nodeName}`;
};

// Separate functions for credentials and parameters (for backward compatibility)
const extractCredentialsFromWorkflow = (templateJson: string): string[] => {
  const inputs = extractUserInputsFromWorkflow(templateJson);
  return inputs
    .filter(input => input.type === 'credential')
    .map(input => input.field);
};

const extractParametersFromWorkflow = (templateJson: string): WorkflowInput[] => {
  const inputs = extractUserInputsFromWorkflow(templateJson);
  return inputs.filter(input => input.type === 'parameter');
};

// Function to extract integrations from workflow nodes
const extractIntegrationsFromWorkflow = (templateJson: string): string[] => {
  try {
    const workflow: WorkflowJson = JSON.parse(templateJson);
    const integrations: Set<string> = new Set();
    
    if (workflow.nodes) {
      workflow.nodes.forEach((node: WorkflowNode) => {
        if (node.type && node.type !== 'n8n-nodes-base.manualTrigger' && node.type !== 'n8n-nodes-base.scheduleTrigger') {
          // Extract integration name from node type
          const integrationName = node.type
            .replace('n8n-nodes-base.', '')
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace('Http', 'HTTP')
            .replace('Api', 'API')
            .replace('Smtp', 'SMTP')
            .trim();
          
          if (integrationName && integrationName.length > 0) {
            integrations.add(integrationName);
          }
        }
      });
    }
    
    return Array.from(integrations);
  } catch (error) {
    console.error('Error parsing workflow JSON for integrations:', error);
    return [];
  }
};

// FIXED: Check execution status using database BIGINT ID
const checkExecutionStatus = async (executionId: number): Promise<ExecutionStatus | null> => {
  try {
    console.log(`Checking execution status for database ID: ${executionId}`);
    
    const response = await fetch(`https://localhost:7104/api/executions/${executionId}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Execution status for ${executionId}:`, data.status);
      return {
        id: data.id,
        status: data.status,
        finished: data.finished,
        startedAt: data.startedAt,
        stoppedAt: data.stoppedAt
      };
    } else {
      console.log(`Failed to fetch execution status for ${executionId}: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error checking execution status for ${executionId}:`, error);
    return null;
  }
};

export const PreBuiltTemplates = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [credentialDialogOpen, setCredentialDialogOpen] = useState(false);
  const [createWorkflowDialogOpen, setCreateWorkflowDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [triggerFilter, setTriggerFilter] = useState("all");
  const [createLoading, setCreateLoading] = useState(false);
  // FIXED: Track executions using database BIGINT IDs (as numbers)
  const [activeExecutions, setActiveExecutions] = useState<Set<number>>(new Set());

  // Function to parse JSON arrays safely
  const parseJsonArray = (jsonString: string): string[] => {
    try {
      if (!jsonString || jsonString === "[]") return [];
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Function to convert WorkflowTemplate to Workflow for frontend
  const convertToWorkflow = useCallback((template: WorkflowTemplate, index: number): Workflow => {
    // Extract credentials and integrations from the actual workflow JSON
    const extractedCredentials = extractCredentialsFromWorkflow(template.templateJson);
    const extractedIntegrations = extractIntegrationsFromWorkflow(template.templateJson);
    
    // Use extracted data, fallback to parsed JSON from database columns
    const integrationsArray = extractedIntegrations.length > 0 ? extractedIntegrations : parseJsonArray(template.integrations);
    const credentialsArray = extractedCredentials.length > 0 ? extractedCredentials : parseJsonArray(template.requiredCredentials);
    
    // Combine for display
    const allIntegrations = [...new Set([...integrationsArray, ...credentialsArray])];
    
    return {
      id: index + 1,
      name: template.name,
      description: template.description || "No description available",
      active: template.isPublished,
      triggerType: "Manual",
      complexity: "Intermediate",
      integrations: allIntegrations.join(', '),
      category: template.category || "automation",
      createdDate: template.createdAt || new Date().toISOString(),
      // Store the original template for credential extraction
      _originalTemplate: template
    };
  }, []);

  useEffect(() => {
    const fetchWorkflowTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Starting to fetch workflow templates...");

        // Fetch workflow templates from your .NET API
        const response = await fetch('https://localhost:7104/api/workflow-templates');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const templatesData: WorkflowTemplate[] = await response.json();
        console.log("Workflow templates fetched successfully:", templatesData);
        
        // Convert templates to workflows for frontend
        const convertedWorkflows = templatesData.map(convertToWorkflow);
        setWorkflows(convertedWorkflows);

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(
          convertedWorkflows
            .map((w: Workflow) => w.category?.trim())
            .filter((category: string | undefined): category is string => 
              !!category && category.length > 0
            )
        ));
        console.log("Categories from templates:", uniqueCategories);
        setCategories(uniqueCategories);

      } catch (error) {
        console.error("Error fetching workflow templates:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowTemplates();
  }, [convertToWorkflow]);

  // FIXED: Poll active executions using database BIGINT IDs
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
            console.log(`Removing completed execution: ${executionId}`);
          }
        } catch (error) {
          console.error(`Error checking execution ${executionId}:`, error);
          // Keep the execution in the set if there's an error (might be temporary)
          newActiveExecutions.add(executionId);
        }
      }
      
      if (hasChanges) {
        setActiveExecutions(newActiveExecutions);
        
        // Refresh the workflows list to show updated status
        if (newActiveExecutions.size === 0) {
          console.log('All executions completed!');
        }
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [activeExecutions]);

  const handleWorkflowClick = (workflow: Workflow) => {
    console.log("Workflow clicked:", workflow.name);
    
    if (workflow._originalTemplate) {
      // Extract fresh credentials and parameters from the template JSON
      const credentials = extractCredentialsFromWorkflow(workflow._originalTemplate.templateJson);
      const parameters = extractParametersFromWorkflow(workflow._originalTemplate.templateJson);
      const integrations = extractIntegrationsFromWorkflow(workflow._originalTemplate.templateJson);
      
      console.log("Required credentials from workflow JSON:", credentials);
      console.log("Required parameters from workflow JSON:", parameters);
      console.log("Integrations from workflow JSON:", integrations);
    } else {
      console.log("Required credentials:", workflow.integrations);
    }
    
    setSelectedWorkflow(workflow);
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
    executeImmediately?: boolean,
    scheduleType?: string,
    scheduledTime?: Date
  ): Promise<boolean> => {
    try {
      setCreateLoading(true);
      
      const originalTemplate = workflows.find(w => w.id === parseInt(templateId));
      
      if (!originalTemplate || !originalTemplate._originalTemplate) {
        alert('❌ Template not found. Please try again.');
        return false;
      }

      const backendTemplateId = originalTemplate._originalTemplate.id;
      const templateName = originalTemplate._originalTemplate.name;

      console.log('🚀 Creating and executing workflow with:', {
        backendTemplateId,
        templateName,
        credentials: Object.keys(credentials),
        parameters: Object.keys(parameters),
        executeImmediately,
        scheduleType,
        scheduledTime
      });

      // FIXED: Validate and clean parameters before sending
      const cleanedParameters: Record<string, string> = { ...parameters };
      
      // Ensure emailFormat is valid
      if (cleanedParameters.emailFormat && !['html', 'text'].includes(cleanedParameters.emailFormat.toLowerCase())) {
        console.log('⚠️ Invalid emailFormat detected, setting to default "html"');
        cleanedParameters.emailFormat = 'html';
      } else if (!cleanedParameters.emailFormat) {
        // Set default if not provided
        cleanedParameters.emailFormat = 'html';
      }

      const serializedCredentials: Record<string, any> = {};
      Object.entries(credentials).forEach(([key, value]) => {
        serializedCredentials[key] = value;
      });

      const payload = {
        templateId: backendTemplateId,
        credentials: serializedCredentials,
        parameters: cleanedParameters, // Use cleaned parameters
        customName: customName || null,
        executeImmediately: executeImmediately ?? true,
        scheduleType: scheduleType || "immediate",
        scheduledTime: scheduledTime?.toISOString() || null
      };

      console.log('📤 Sending payload to backend:', JSON.stringify(payload, null, 2));

      const response = await fetch('https://localhost:7104/api/workflows/create-and-execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📡 Response status:', response.status);
      const responseText = await response.text();
      console.log('📄 Response body:', responseText);

      if (response.ok) {
        const result = JSON.parse(responseText);
        console.log('✅ Workflow created:', result);
        
      if (result.status === "executing" && result.executionId) {
  const executionId = parseInt(result.executionId);
  
  if (!isNaN(executionId)) {
    alert(
      `✅ SUCCESS! Workflow Executing Automatically!\n\n` +
      `📋 Workflow: ${result.workflowName}\n` +
      `🆔 n8n Workflow ID: ${result.n8nWorkflowId}\n` +
      `⚡ Execution ID: ${executionId}\n` +
      `🚀 Status: Running in n8n\n\n` +
      `🎉 The workflow has been triggered automatically!\n` +
      `✉️ Check your email inbox for the results.\n` +
      `📊 You can also monitor progress in the n8n dashboard at http://localhost:5678`
    );
    setActiveExecutions(prev => new Set(prev).add(executionId));
  } else {
    alert(
      `✅ Workflow Executing!\n\n` +
      `📋 Workflow: ${result.workflowName}\n` +
      `🆔 n8n ID: ${result.n8nWorkflowId}\n` +
      `🚀 The workflow is running automatically in n8n.\n\n` +
      `✉️ Check your email inbox for results.`
    );
  }
} else if (result.status === "saved_and_activated") {
  // NEW: Handle case where workflow is activated but not immediately executed (schedule workflows)
  alert(
    `✅ Workflow Created & Activated!\n\n` +
    `📋 Workflow: ${result.workflowName}\n` +
    `🆔 n8n ID: ${result.n8nWorkflowId}\n\n` +
    `The workflow has been created and activated in n8n.\n` +
    `⏰ It will run automatically according to its schedule.\n\n` +
    `📊 Monitor progress in the n8n dashboard at http://localhost:5678`
  );
} else if (result.status === "created_without_n8n") {
  alert(
    `⚠️ Workflow Saved to Database Only\n\n` +
    `📋 Workflow: ${result.workflowName}\n\n` +
    `n8n is currently unavailable. The workflow was saved to the database.\n` +
    `Please ensure n8n is running at http://localhost:5678 and try again.`
  );
} else {
  // Generic success for any other status
  alert(
    `✅ Workflow Created Successfully!\n\n` +
    `📋 Workflow: ${result.workflowName}\n` +
    `🆔 n8n ID: ${result.n8nWorkflowId}\n` +
    `📊 Status: ${result.status}\n\n` +
    `The workflow has been processed successfully.`
  );
}
        setCredentialDialogOpen(false);
        return true;
      } else {
        let errorMessage = 'Unknown error occurred';
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.detail || errorData.error || errorData.message || errorData.title || JSON.stringify(errorData);
          console.error('❌ Server error details:', errorData);
        } catch (parseError) {
          errorMessage = responseText || `HTTP Error: ${response.status} - ${response.statusText}`;
          console.error('❌ Raw error response:', responseText);
        }
        
        console.error('❌ Full error context:', {
          status: response.status,
          statusText: response.statusText,
          payload: payload,
          errorMessage: errorMessage
        });
        
        alert(
          `❌ Failed to Create Workflow\n\n` +
          `Error: ${errorMessage}\n\n` +
          `Troubleshooting:\n` +
          `1. Check if n8n is running: http://localhost:5678\n` +
          `2. Verify API is running: https://localhost:7104\n` +
          `3. Check console logs for details\n` +
          `4. Ensure all credentials are correct`
        );
        return false;
      }
    } catch (error) {
      console.error('❌ Network/Exception error:', error);
      alert(
        `❌ Network Error\n\n` +
        `${(error as Error).message}\n\n` +
        `Troubleshooting:\n` +
        `1. Check if the backend API is running on https://localhost:7104\n` +
        `2. Verify your network connection\n` +
        `3. Check browser console for more details\n` +
        `4. Ensure CORS is properly configured`
      );
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const triggers = useMemo(() => {
    const trigs = Array.from(new Set(
      workflows
        .map((w) => w.triggerType?.trim())
        .filter((trigger: string | undefined): trigger is string => 
          !!trigger && trigger.length > 0
        )
    ));
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
        {/* Header with Create Button */}
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
    🚀 {activeExecutions.size} workflow{activeExecutions.size > 1 ? 's' : ''} currently executing...
    <div className="text-xs text-blue-500 mt-1">
      Automatically monitoring progress - you'll see results soon!
    </div>
  </div>
)}
          </div>
          <CreateWorkflowButton onClick={handleCreateWorkflow} />
        </div>

        {/* Search and Filters */}
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

        {/* Workflow Grid */}
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
                  integrations={workflow.integrations ? workflow.integrations.split(',').map(i => i.trim()) : []}
                  requiredCredentials={workflow._originalTemplate ? 
                    extractCredentialsFromWorkflow(workflow._originalTemplate.templateJson) : 
                    (workflow.integrations ? workflow.integrations.split(',').map(i => i.trim()) : [])}
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

      {/* Credential Dialog */}
      <CredentialDialog
        open={credentialDialogOpen}
        onOpenChange={setCredentialDialogOpen}
        templateName={selectedWorkflow?.name || ""}
        templateId={selectedWorkflow?.id.toString() || ""}
        integrations={selectedWorkflow?._originalTemplate ? 
          extractIntegrationsFromWorkflow(selectedWorkflow._originalTemplate.templateJson) : 
          (selectedWorkflow?.integrations ? selectedWorkflow.integrations.split(',').map(i => i.trim()) : [])}
        requiredCredentials={selectedWorkflow?._originalTemplate ? 
          extractCredentialsFromWorkflow(selectedWorkflow._originalTemplate.templateJson) : 
          (selectedWorkflow?.integrations ? selectedWorkflow.integrations.split(',').map(i => i.trim()) : [])}
        workflowInputs={selectedWorkflow?._originalTemplate ? 
          extractParametersFromWorkflow(selectedWorkflow._originalTemplate.templateJson) : []}
        onCredentialsSubmit={handleCredentialsSubmit}
        loading={createLoading}
      />

      <CreateWorkflowDialog
        open={createWorkflowDialogOpen}
        onOpenChange={setCreateWorkflowDialogOpen}
        onSave={handleSaveNewWorkflow}
      />
    </>
  );
};