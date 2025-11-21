import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Key, Shield, Settings, Play, XCircle, AlertCircle, Clock, Calendar, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WorkflowInput {
  type: 'credential' | 'parameter';
  nodeName: string;
  field: string;
  value?: string;
  required: boolean;
  inputType: 'text' | 'email' | 'password' | 'url' | 'number' | 'textarea';
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
  integrations: string[];
  requiredCredentials: string[]; 
  workflowInputs?: WorkflowInput[]; 
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
  if (fieldLower.includes('smtp') || fieldLower.includes('email')) return 'smtp';
  if (fieldLower.includes('oauth')) return 'oauth2';
  if (fieldLower.includes('api') && fieldLower.includes('key')) return 'api';
  if (fieldLower.includes('http') && fieldLower.includes('auth')) return 'httpAuth';
  return 'generic';
};

// Helper function to format date in local timezone for display
const formatLocalDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper function to create Date object preserving local timezone
const createLocalDate = (dateTimeString: string): Date => {
  const [datePart, timePart] = dateTimeString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  
  return new Date(year, month - 1, day, hours, minutes);
};

export const CredentialDialog = ({
  open,
  onOpenChange,
  templateName,
  templateId,
  integrations,
  requiredCredentials,
  workflowInputs = [],
  onCredentialsSubmit,
  loading = false
}: CredentialDialogProps) => {
  const [customName, setCustomName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [credentialData, setCredentialData] = useState<Record<string, Record<string, string>>>({});
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [executionMode, setExecutionMode] = useState<"immediate" | "scheduled" | "process">("immediate");
  const [scheduledDateTime, setScheduledDateTime] = useState<string>("");

  useEffect(() => {
    if (open) {
      const initialCredentials: Record<string, Record<string, string>> = {};
      requiredCredentials.forEach(credType => {
        const type = detectCredentialType(credType);
        if (type === 'smtp') {
          initialCredentials[credType] = { user: '', password: '', host: 'smtp.gmail.com', port: '465', secure: 'true' };
        } else if (type === 'api') {
          initialCredentials[credType] = { apiKey: '' };
        } else if (type === 'oauth2') {
          initialCredentials[credType] = { clientId: '', clientSecret: '', accessToken: '' };
        } else {
          initialCredentials[credType] = { value: '' };
        }
      });
      setCredentialData(initialCredentials);

      const initialParameters: Record<string, string> = {};
      workflowInputs.forEach(input => {
        if (input.field.toLowerCase().includes('format')) {
          initialParameters[input.field] = input.value || 'html';
        } else if (input.value && !input.value.startsWith('=') && !input.value.includes('{{')) {
          initialParameters[input.field] = input.value;
        }
      });
      setParameters(initialParameters);

      setError(null);
      setExecutionMode("immediate");
      setScheduledDateTime("");
    }
  }, [open, requiredCredentials, workflowInputs]);

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    Object.entries(credentialData).forEach(([credType, credFields]) => {
      const type = detectCredentialType(credType);
      if (type === 'smtp') {
        if (!credFields.user || !credFields.password) errors.push(`${formatFieldName(credType)}: Email and password are required`);
        if (!credFields.host) errors.push(`${formatFieldName(credType)}: SMTP host is required`);
      } else if (type === 'api') {
        if (!credFields.apiKey) errors.push(`${formatFieldName(credType)}: API key is required`);
      } else if (type === 'oauth2') {
        if (!credFields.clientId || !credFields.clientSecret) errors.push(`${formatFieldName(credType)}: Client ID and Secret are required`);
      } else {
        if (!credFields.value) errors.push(`${formatFieldName(credType)}: Value is required`);
      }
    });

    workflowInputs.forEach(input => {
      if (input.required && !parameters[input.field]) errors.push(formatFieldName(input.field));
    });

    if (executionMode === "scheduled" && !scheduledDateTime) errors.push("Please select a scheduled date and time");
    if (executionMode === "scheduled" && scheduledDateTime) {
      const schedTime = createLocalDate(scheduledDateTime);
      if (schedTime <= new Date()) errors.push("Scheduled time must be in the future");
    }

    const emailFormatParam = Object.keys(parameters).find(key => key.toLowerCase().includes('format'));
    if (emailFormatParam && parameters[emailFormatParam]) {
      const formatValue = parameters[emailFormatParam].toLowerCase();
      if (formatValue !== 'html' && formatValue !== 'text') errors.push(`Email format must be either "html" or "text"`);
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const validation = validateForm();
    if (!validation.isValid) {
      setError(validation.errors.join('. '));
      setSubmitting(false);
      return;
    }

    try {
      const transformedCredentials: Record<string, CredentialData> = {};
      Object.entries(credentialData).forEach(([credType, credFields]) => {
        const type = detectCredentialType(credType);
        if (type === 'smtp') {
          transformedCredentials[credType] = {
            user: credFields.user,
            password: credFields.password,
            host: credFields.host || 'smtp.gmail.com',
            port: credFields.port || '465',
            secure: credFields.secure || 'true'
          };
        } else if (type === 'api') {
          transformedCredentials[credType] = { apiKey: credFields.apiKey };
        } else if (type === 'oauth2') {
          transformedCredentials[credType] = {
            clientId: credFields.clientId,
            clientSecret: credFields.clientSecret,
            accessToken: credFields.accessToken || ''
          };
        } else {
          transformedCredentials[credType] = { value: credFields.value };
        }
      });

      const cleanedParameters: Record<string, string> = { ...parameters };
      if (!cleanedParameters.emailFormat) cleanedParameters.emailFormat = 'html';

      let scheduledTime: Date | undefined;
      if (executionMode === "scheduled" && scheduledDateTime) scheduledTime = createLocalDate(scheduledDateTime);

      const success = await onCredentialsSubmit(
        transformedCredentials,
        cleanedParameters,
        templateId,
        customName || undefined,
        executionMode,
        scheduledTime
      );

      if (success) onOpenChange(false);
    } catch (error) {
      console.error('❌ Network error:', error);
      setError(`Network Error: ${(error as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

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

  const handleCredentialFieldChange = (credType: string, field: string, value: string) => {
    setCredentialData(prev => ({ ...prev, [credType]: { ...prev[credType], [field]: value } }));
    if (error) setError(null);
  };

  const handleParameterChange = (key: string, value: string) => {
    setParameters(prev => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const isFormValid = (): boolean => validateForm().isValid;

  const getPlaceholder = (input: WorkflowInput) => {
    if (input.value && !input.value.startsWith('=') && !input.value.includes('{{')) return input.value;
    const field = input.field.toLowerCase();
    if (field.includes('email') && !field.includes('format')) return `recipient@example.com`;
    if (field.includes('url')) return `https://api.example.com/endpoint`;
    if (field.includes('subject')) return `Email subject`;
    if (field.includes('message') || field.includes('body')) return `Enter your message content`;
    if (field.includes('format')) return `html`;
    return `Enter ${formatFieldName(input.field)}`;
  };

  const getInputType = (input: WorkflowInput): 'text' | 'email' | 'password' | 'url' | 'number' | 'textarea' => {
    const field = input.field.toLowerCase();
    if (field.includes('format')) return 'text';
    if (field.includes('email') && !field.includes('format')) return 'email';
    if (field.includes('url')) return 'url';
    if (field.includes('phone') || field.includes('number') || field.includes('limit')) return 'number';
    if (field.includes('message') || field.includes('body') || field.includes('content') || field.includes('description')) return 'textarea';
    return 'text';
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return formatLocalDateTime(now);
  };

  const getButtonText = () => {
    if (submitting || loading) return { text: "Creating...", icon: Loader2 };
    switch (executionMode) {
      case "immediate": return { text: "Create & Execute Now", icon: Play };
      case "scheduled": return { text: "Create & Schedule", icon: Calendar };
      case "process": return { text: "Create & Activate", icon: Zap };
      default: return { text: "Create Workflow", icon: Settings };
    }
  };

  const getInfoMessage = () => {
    switch (executionMode) {
      case "immediate": return "✅ Workflow executes automatically right away";
      case "scheduled": return "📅 Workflow will execute at your scheduled time";
      case "process": return "🔗 Workflow activated - will process external triggers automatically";
      default: return "Workflow is created and activated in n8n";
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
              <DialogTitle className="text-xl">Configure {templateName}</DialogTitle>
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
          {requiredCredentials.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-semibold">
                    Required Credentials ({requiredCredentials.length})
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  These credentials will be securely stored and used by the workflow
                </p>
                
                {requiredCredentials.map((credType) => (
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

                {workflowInputs.some(i => i.nodeName === 'Webhook Payload') && (
                  <div className="p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">Webhook Workflow Detected</p>
                        <p className="mt-1 text-xs">
                          These parameters will be sent as JSON payload when triggering the workflow via webhook.
                          Choose "Process" mode for real-time webhook processing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {workflowInputs.map((input) => (
                  <div key={input.field} className="space-y-2">
                    {input.description && (
                      <span className="text-xs text-muted-foreground">{input.description}</span>
                    )}
                    {input.inputType === 'textarea' || getInputType(input) === 'textarea' ? (
                      <Textarea
                        id={`param-${input.field}`}
                        value={parameters[input.field] || ''}
                        onChange={(e) => handleParameterChange(input.field, e.target.value)}
                        placeholder={getPlaceholder(input)}
                        className="transition-colors focus:border-primary min-h-[80px]"
                        required={input.required}
                        disabled={submitting || loading}
                      />
                    ) : (
                      <Input
                        id={`param-${input.field}`}
                        type={getInputType(input)}
                        value={parameters[input.field] || ''}
                        onChange={(e) => handleParameterChange(input.field, e.target.value)}
                        placeholder={getPlaceholder(input)}
                        className="transition-colors focus:border-primary"
                        required={input.required}
                        disabled={submitting || loading}
                      />
                    )}
                    {input.field.toLowerCase().includes('format') && (
                      <p className="text-xs text-muted-foreground">
                        Must be "html" or "text" - default is "html"
                      </p>
                    )}
                    {input.nodeName === 'Webhook Payload' && (
                      <p className="text-xs text-muted-foreground">
                        This value will be included in the webhook request payload
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
            <p className="text-sm text-muted-foreground">Choose how this workflow should be triggered</p>

            <RadioGroup value={executionMode} onValueChange={(value: "immediate" | "scheduled" | "process") => setExecutionMode(value)} disabled={submitting || loading}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-green-600" /> Execute Immediately
                  </div>
                  <p className="text-xs text-muted-foreground">Runs the workflow right away after creation</p>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer">
                <RadioGroupItem value="scheduled" id="scheduled" />
                <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" /> Schedule
                  </div>
                  <p className="text-xs text-muted-foreground">Runs at a specific date and time</p>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer">
                <RadioGroupItem value="process" id="process" />
                <Label htmlFor="process" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-600" /> Process
                  </div>
                  <p className="text-xs text-muted-foreground">Activates workflow to process triggers automatically</p>
                </Label>
              </div>
            </RadioGroup>

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
            <Button type="submit" disabled={submitting || loading || !isFormValid()}>
              {ButtonContent.icon && <ButtonContent.icon className="w-4 h-4 mr-2 animate-spin" />}
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
    const type = detectCredentialType(credType);

    if (!credFields) return null;

    return Object.keys(credFields).map((field) => (
      <div key={field} className="space-y-1">
        <Label htmlFor={`${credType}-${field}`} className="text-sm font-medium">
          {formatFieldName(field)}
        </Label>
        <Input
          id={`${credType}-${field}`}
          type={field.toLowerCase().includes('password') ? 'password' : 'text'}
          value={credFields[field]}
          onChange={(e) => handleCredentialFieldChange(credType, field, e.target.value)}
          placeholder={`Enter ${formatFieldName(field)}`}
          required
          disabled={submitting || loading}
          className="transition-colors focus:border-primary"
        />
      </div>
    ));
  }
};
