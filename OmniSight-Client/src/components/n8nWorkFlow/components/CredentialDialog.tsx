import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Key, Shield, Settings, Play, CheckCircle, XCircle, AlertCircle, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface CredentialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  templateId: string;
  integrations: string[];
  requiredCredentials: string[]; 
  workflowInputs?: WorkflowInput[]; 
  onCredentialsSubmit: (
    credentials: any, 
    parameters: any, 
    templateId: string, 
    customName?: string,
    executeImmediately?: boolean,
    scheduleType?: string,
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
  
  // Separate state for credentials and parameters
  const [credentialData, setCredentialData] = useState<Record<string, Record<string, string>>>({});
  const [parameters, setParameters] = useState<Record<string, string>>({});

  // NEW: Execution timing options
  const [executionMode, setExecutionMode] = useState<"immediate" | "scheduled">("immediate");
  const [scheduledDateTime, setScheduledDateTime] = useState<string>("");

  // Initialize credential structure when dialog opens
  useEffect(() => {
    if (open) {
      const initialCredentials: Record<string, Record<string, string>> = {};
      
      requiredCredentials.forEach(credType => {
        const type = detectCredentialType(credType);
        
        if (type === 'smtp') {
          initialCredentials[credType] = {
            user: '',
            password: '',
            host: 'smtp.gmail.com',
            port: '465',
            secure: 'true'
          };
        } else if (type === 'api') {
          initialCredentials[credType] = {
            apiKey: ''
          };
        } else if (type === 'oauth2') {
          initialCredentials[credType] = {
            clientId: '',
            clientSecret: '',
            accessToken: ''
          };
        } else {
          initialCredentials[credType] = {
            value: ''
          };
        }
      });
      
      setCredentialData(initialCredentials);
      
      // Initialize parameters with default values for emailFormat
      const initialParameters: Record<string, string> = {};
      workflowInputs.forEach(input => {
        if (input.field.toLowerCase().includes('format')) {
          initialParameters[input.field] = input.value || 'html'; // Default to 'html' for format fields
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

    // Validate credentials
    Object.entries(credentialData).forEach(([credType, credFields]) => {
      const type = detectCredentialType(credType);
      
      if (type === 'smtp') {
        if (!credFields.user || !credFields.password) {
          errors.push(`${formatFieldName(credType)}: Email and password are required`);
        }
        if (!credFields.host) {
          errors.push(`${formatFieldName(credType)}: SMTP host is required`);
        }
      } else if (type === 'api') {
        if (!credFields.apiKey) {
          errors.push(`${formatFieldName(credType)}: API key is required`);
        }
      } else if (type === 'oauth2') {
        if (!credFields.clientId || !credFields.clientSecret) {
          errors.push(`${formatFieldName(credType)}: Client ID and Secret are required`);
        }
      } else {
        if (!credFields.value) {
          errors.push(`${formatFieldName(credType)}: Value is required`);
        }
      }
    });

    // Validate parameters
    const missingParameters: string[] = [];
    workflowInputs.forEach(input => {
      if (input.required && !parameters[input.field]) {
        missingParameters.push(formatFieldName(input.field));
      }
    });

    if (missingParameters.length > 0) {
      errors.push(`Missing parameters: ${missingParameters.join(', ')}`);
    }

    // Validate email format parameter
    const emailFormatParam = Object.keys(parameters).find(key => key.toLowerCase().includes('format'));
    if (emailFormatParam && parameters[emailFormatParam]) {
      const formatValue = parameters[emailFormatParam].toLowerCase();
      if (formatValue !== 'html' && formatValue !== 'text') {
        errors.push(`Email format must be either "html" or "text", not "${parameters[emailFormatParam]}"`);
      }
    }

    // Validate scheduled time if scheduled mode
    if (executionMode === "scheduled" && !scheduledDateTime) {
      errors.push("Please select a scheduled date and time");
    }

    if (executionMode === "scheduled" && scheduledDateTime) {
      const schedTime = new Date(scheduledDateTime);
      if (schedTime <= new Date()) {
        errors.push("Scheduled time must be in the future");
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
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
      console.log('🚀 Submitting workflow creation...');
      console.log('🔐 Credential Data:', credentialData);
      console.log('📋 Parameters:', parameters);
      console.log('⏰ Execution Mode:', executionMode);
      console.log('📅 Scheduled Time:', scheduledDateTime);
      
      // Transform credentials for backend
      const transformedCredentials: Record<string, any> = {};
      Object.entries(credentialData).forEach(([credType, credFields]) => {
        const type = detectCredentialType(credType);
        
        if (type === 'smtp') {
          transformedCredentials[credType] = {
            user: credFields.user,
            password: credFields.password,
            host: credFields.host || 'smtp.gmail.com',
            port: parseInt(credFields.port || '465'),
            secure: credFields.secure === 'true'
          };
        } else if (type === 'api') {
          transformedCredentials[credType] = credFields.apiKey;
        } else if (type === 'oauth2') {
          transformedCredentials[credType] = {
            clientId: credFields.clientId,
            clientSecret: credFields.clientSecret,
            accessToken: credFields.accessToken || ''
          };
        } else {
          transformedCredentials[credType] = credFields.value;
        }
      });
      
      console.log('📤 Transformed credentials for backend:', transformedCredentials);
      
      const executeImmediately = executionMode === "immediate";
      const scheduleType = executionMode;
      const scheduledTime = executionMode === "scheduled" ? new Date(scheduledDateTime) : undefined;
      
      const success = await onCredentialsSubmit(
        transformedCredentials, 
        parameters, 
        templateId, 
        customName || undefined,
        executeImmediately,
        scheduleType,
        scheduledTime
      );
      
      if (success) {
        console.log('✅ Workflow created successfully');
        setCredentialData({});
        setParameters({});
        setCustomName("");
        setError(null);
        setExecutionMode("immediate");
        setScheduledDateTime("");
      } else {
        console.log('❌ Workflow creation failed');
        setError("Failed to create workflow. Please check the console for details.");
      }
    } catch (err) {
      console.error('❌ CredentialDialog error:', err);
      setError("An unexpected error occurred while creating the workflow.");
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
    setCredentialData(prev => ({
      ...prev,
      [credType]: {
        ...prev[credType],
        [field]: value
      }
    }));
    if (error) setError(null);
  };

  const handleParameterChange = (key: string, value: string) => {
    setParameters(prev => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const isFormValid = (): boolean => {
    const validation = validateForm();
    return validation.isValid;
  };

  const renderCredentialFields = (credType: string) => {
    const type = detectCredentialType(credType);
    const credFields = credentialData[credType] || {};

    if (type === 'smtp') {
      return (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">{formatFieldName(credType)}</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor={`${credType}-user`} className="text-sm">
                Email Address *
              </Label>
              <Input
                id={`${credType}-user`}
                type="email"
                value={credFields.user || ''}
                onChange={(e) => handleCredentialFieldChange(credType, 'user', e.target.value)}
                placeholder="your.email@gmail.com"
                className="mt-1"
                required
                disabled={submitting || loading}
              />
            </div>

            <div>
              <Label htmlFor={`${credType}-password`} className="text-sm">
                Password / App Password *
              </Label>
              <Input
                id={`${credType}-password`}
                type="password"
                value={credFields.password || ''}
                onChange={(e) => handleCredentialFieldChange(credType, 'password', e.target.value)}
                placeholder="Enter your password or app-specific password"
                className="mt-1"
                required
                disabled={submitting || loading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                For Gmail, use an <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener" className="text-primary underline">App Password</a>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`${credType}-host`} className="text-sm">
                  SMTP Host *
                </Label>
                <Input
                  id={`${credType}-host`}
                  type="text"
                  value={credFields.host || 'smtp.gmail.com'}
                  onChange={(e) => handleCredentialFieldChange(credType, 'host', e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="mt-1"
                  required
                  disabled={submitting || loading}
                />
              </div>

              <div>
                <Label htmlFor={`${credType}-port`} className="text-sm">
                  Port *
                </Label>
                <Input
                  id={`${credType}-port`}
                  type="number"
                  value={credFields.port || '465'}
                  onChange={(e) => handleCredentialFieldChange(credType, 'port', e.target.value)}
                  placeholder="465"
                  className="mt-1"
                  required
                  disabled={submitting || loading}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`${credType}-secure`}
                checked={credFields.secure === 'true'}
                onChange={(e) => handleCredentialFieldChange(credType, 'secure', e.target.checked ? 'true' : 'false')}
                className="rounded"
                disabled={submitting || loading}
              />
              <Label htmlFor={`${credType}-secure`} className="text-sm cursor-pointer">
                Use SSL/TLS (Required for port 465)
              </Label>
            </div>
          </div>
        </div>
      );
    } else if (type === 'api') {
      return (
        <div className="space-y-2">
          <Label htmlFor={`${credType}-apiKey`} className="text-sm">
            {formatFieldName(credType)} *
          </Label>
          <Input
            id={`${credType}-apiKey`}
            type="password"
            value={credFields.apiKey || ''}
            onChange={(e) => handleCredentialFieldChange(credType, 'apiKey', e.target.value)}
            placeholder="Enter your API key"
            className="font-mono"
            required
            disabled={submitting || loading}
          />
        </div>
      );
    } else if (type === 'oauth2') {
      return (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">{formatFieldName(credType)}</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor={`${credType}-clientId`} className="text-sm">
                Client ID *
              </Label>
              <Input
                id={`${credType}-clientId`}
                type="text"
                value={credFields.clientId || ''}
                onChange={(e) => handleCredentialFieldChange(credType, 'clientId', e.target.value)}
                placeholder="Enter client ID"
                className="mt-1"
                required
                disabled={submitting || loading}
              />
            </div>

            <div>
              <Label htmlFor={`${credType}-clientSecret`} className="text-sm">
                Client Secret *
              </Label>
              <Input
                id={`${credType}-clientSecret`}
                type="password"
                value={credFields.clientSecret || ''}
                onChange={(e) => handleCredentialFieldChange(credType, 'clientSecret', e.target.value)}
                placeholder="Enter client secret"
                className="mt-1"
                required
                disabled={submitting || loading}
              />
            </div>

            <div>
              <Label htmlFor={`${credType}-accessToken`} className="text-sm">
                Access Token (Optional)
              </Label>
              <Input
                id={`${credType}-accessToken`}
                type="password"
                value={credFields.accessToken || ''}
                onChange={(e) => handleCredentialFieldChange(credType, 'accessToken', e.target.value)}
                placeholder="Enter access token if available"
                className="mt-1"
                disabled={submitting || loading}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-2">
          <Label htmlFor={`${credType}-value`} className="text-sm">
            {formatFieldName(credType)} *
          </Label>
          <Input
            id={`${credType}-value`}
            type="password"
            value={credFields.value || ''}
            onChange={(e) => handleCredentialFieldChange(credType, 'value', e.target.value)}
            placeholder={`Enter your ${formatFieldName(credType)}`}
            required
            disabled={submitting || loading}
          />
        </div>
      );
    }
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

  // FIXED: Better input type detection
  const getInputType = (input: WorkflowInput): 'text' | 'email' | 'password' | 'url' | 'number' | 'textarea' => {
    const field = input.field.toLowerCase();
    
    // CRITICAL FIX: emailFormat should be text, NOT email
    if (field.includes('format')) return 'text';
    
    if (field.includes('email') && !field.includes('format')) return 'email';
    if (field.includes('url')) return 'url';
    if (field.includes('phone') || field.includes('number') || field.includes('limit')) return 'number';
    if (field.includes('message') || field.includes('body') || field.includes('content') || field.includes('description')) return 'textarea';
    
    return 'text';
  };

  // Get minimum datetime for scheduling (current time + 5 minutes)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

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
                
                {workflowInputs.map((input) => (
                  <div key={input.field} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`param-${input.field}`} className="text-sm">
                        {formatFieldName(input.field)} {input.required && '*'}
                      </Label>
                      {input.description && (
                        <span className="text-xs text-muted-foreground">
                          {input.description}
                        </span>
                      )}
                    </div>
                    
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
                    {/* Show format hint for email format fields */}
                    {input.field.toLowerCase().includes('format') && (
                      <p className="text-xs text-muted-foreground">
                        Must be "html" or "text" - default is "html"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* NEW: Execution Timing Section */}
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold">
                Execution Timing
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose when to execute this workflow
            </p>

            <RadioGroup value={executionMode} onValueChange={(value: any) => setExecutionMode(value)} disabled={submitting || loading}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    <div>
                      <div className="font-medium">Execute Immediately</div>
                      <div className="text-xs text-muted-foreground">Run the workflow right after creation</div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer">
                <RadioGroupItem value="scheduled" id="scheduled" />
                <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <div className="font-medium">Schedule for Later</div>
                      <div className="text-xs text-muted-foreground">Choose a specific date and time</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {executionMode === "scheduled" && (
              <div className="mt-4 space-y-2 p-4 bg-muted/30 rounded-lg border">
                <Label htmlFor="scheduledDateTime" className="text-sm font-medium">
                  Select Date & Time *
                </Label>
                <Input
                  id="scheduledDateTime"
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => {
                    setScheduledDateTime(e.target.value);
                    if (error) setError(null);
                  }}
                  min={getMinDateTime()}
                  className="mt-1"
                  required
                  disabled={submitting || loading}
                />
                <p className="text-xs text-muted-foreground">
                  The workflow will be activated but will only execute at the specified time
                </p>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Error</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">What happens next?</p>
                <ul className="mt-2 text-xs space-y-1 list-disc list-inside">
                  <li>Credentials are encrypted and stored securely</li>
                  <li>Workflow is created and activated in n8n</li>
                  {executionMode === "immediate" ? (
                    <li>✅ Workflow executes automatically right away</li>
                  ) : (
                    <li>📅 Workflow will execute at your scheduled time</li>
                  )}
                  <li>You can monitor execution in the n8n dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting || loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || loading || !isFormValid()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {(submitting || loading) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : executionMode === "immediate" ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Create & Execute Now
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Create & Schedule
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};