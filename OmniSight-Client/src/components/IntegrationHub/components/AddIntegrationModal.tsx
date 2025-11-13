import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  XCircle, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Search,
  Globe,
  Shield,
  Database,
  Zap,
  Settings,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Integration } from '@/services/integrationService';


interface AddIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIntegrationAdded: (integration: Omit<Integration, 'id' | 'createdAt'>) => void;
}

interface FormData {
  integrationName: string;
  description: string;
  category: string;
  connectionType: string;
  // OAuth 2.0 fields
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  // API Key fields
  apiKey: string;
  apiUrl: string;
  // IAM Role fields
  roleArn: string;
  region: string;
  // Microsoft Graph API fields
  tenantId: string;
  applicationId: string;
  // General fields
  syncFrequency: string;
  enableNotifications: boolean;
  enableDataValidation: boolean;
  tags: string[];
}

interface FormErrors {
  [key: string]: string;
}

const AddIntegrationModal: React.FC<AddIntegrationModalProps> = ({
  isOpen,
  onClose,
  onIntegrationAdded
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<FormData>({
    integrationName: '',
    description: '',
    category: '',
    connectionType: '',
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    apiKey: '',
    apiUrl: '',
    roleArn: '',
    region: '',
    tenantId: '',
    applicationId: '',
    syncFrequency: 'hourly',
    enableNotifications: true,
    enableDataValidation: true,
    tags: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');

  const categories = [
    { value: 'crm', label: 'CRM & Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'HR & People' },
    { value: 'communication', label: 'Communication' },
    { value: 'infrastructure', label: 'Infrastructure' }
  ];

  const connectionTypes = [
    { value: 'OAuth 2.0', label: 'OAuth 2.0' },
    { value: 'API Key', label: 'API Key' },
    { value: 'IAM Role', label: 'IAM Role' },
    { value: 'Microsoft Graph API', label: 'Microsoft Graph API' }
  ];

  const syncFrequencies = [
    { value: 'realtime', label: 'Real-time' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // General validation
    if (!formData.integrationName.trim()) {
      newErrors.integrationName = 'Integration name is required';
    } else if (formData.integrationName.length < 3) {
      newErrors.integrationName = 'Integration name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.connectionType) {
      newErrors.connectionType = 'Connection type is required';
    }

    // Connection type specific validation
    if (formData.connectionType === 'OAuth 2.0') {
      if (!formData.clientId.trim()) {
        newErrors.clientId = 'Client ID is required';
      }
      if (!formData.clientSecret.trim()) {
        newErrors.clientSecret = 'Client Secret is required';
      }
      if (!formData.redirectUri.trim()) {
        newErrors.redirectUri = 'Redirect URI is required';
      } else if (!isValidUrl(formData.redirectUri)) {
        newErrors.redirectUri = 'Please enter a valid URL';
      }
    }

    if (formData.connectionType === 'API Key') {
      if (!formData.apiKey.trim()) {
        newErrors.apiKey = 'API Key is required';
      }
      if (!formData.apiUrl.trim()) {
        newErrors.apiUrl = 'API URL is required';
      } else if (!isValidUrl(formData.apiUrl)) {
        newErrors.apiUrl = 'Please enter a valid URL';
      }
    }

    if (formData.connectionType === 'IAM Role') {
      if (!formData.roleArn.trim()) {
        newErrors.roleArn = 'Role ARN is required';
      } else if (!isValidArn(formData.roleArn)) {
        newErrors.roleArn = 'Please enter a valid AWS ARN format';
      }
      if (!formData.region.trim()) {
        newErrors.region = 'AWS Region is required';
      }
    }

    if (formData.connectionType === 'Microsoft Graph API') {
      if (!formData.tenantId.trim()) {
        newErrors.tenantId = 'Tenant ID is required';
      } else if (!isValidGuid(formData.tenantId)) {
        newErrors.tenantId = 'Please enter a valid GUID format';
      }
      if (!formData.applicationId.trim()) {
        newErrors.applicationId = 'Application ID is required';
      } else if (!isValidGuid(formData.applicationId)) {
        newErrors.applicationId = 'Please enter a valid GUID format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidArn = (arn: string): boolean => {
    const arnRegex = /^arn:aws:[a-z0-9]+:[a-z0-9-]+:\d{12}:[a-zA-Z0-9/_-]+$/;
    return arnRegex.test(arn);
  };

  const isValidGuid = (guid: string): boolean => {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(guid);
  };

  const getValidationStatus = (): 'valid' | 'invalid' | 'partial' => {
    const requiredFields = ['integrationName', 'description', 'category', 'connectionType'];
    const connectionFields = {
      'OAuth 2.0': ['clientId', 'clientSecret', 'redirectUri'],
      'API Key': ['apiKey', 'apiUrl'],
      'IAM Role': ['roleArn', 'region'],
      'Microsoft Graph API': ['tenantId', 'applicationId']
    };

    const allRequired = requiredFields.every(field => formData[field as keyof FormData]);
    const connectionRequired = formData.connectionType ? 
      connectionFields[formData.connectionType as keyof typeof connectionFields]?.every(field => 
        formData[field as keyof FormData]
      ) : false;

    if (allRequired && connectionRequired) return 'valid';
    if (allRequired || connectionRequired) return 'partial';
    return 'invalid';
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setValidationMessage('');
    setTestResult('idle');
  };

  const handleTestConnection = async () => {
    if (!validateForm()) {
      setValidationMessage('Please fix all errors before testing connection');
      setTestResult('error');
      return;
    }

    setIsSubmitting(true);
    setValidationMessage('Testing connection...');
    setTestResult('idle');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success/failure based on connection type
    const success = Math.random() > 0.3; // 70% success rate for demo

    if (success) {
      setValidationMessage('Connection test successful! Integration is ready to be added.');
      setTestResult('success');
      toast({
        title: 'Connection Test Successful',
        description: 'The integration connection has been verified.',
      });
    } else {
      setValidationMessage('Connection test failed. Please check your credentials and try again.');
      setTestResult('error');
      toast({
        title: 'Connection Test Failed',
        description: 'Please verify your configuration and try again.',
        variant: 'destructive'
      });
    }

    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setValidationMessage('Please fix all errors before adding integration');
      setTestResult('error');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newIntegration = {
      id: `integration-${Date.now()}`,
      name: formData.integrationName,
      description: formData.description,
      status: 'inactive' as const,
      logoSrc: '',
      lastSync: null,
      dataPoints: 0,
      connectionType: formData.connectionType,
      healthScore: 0,
      dataFlow: { incoming: 0, outgoing: 0 },
      category: formData.category,
      syncFrequency: formData.syncFrequency,
      enableNotifications: formData.enableNotifications,
      enableDataValidation: formData.enableDataValidation,
      tags: formData.tags,
      createdAt: new Date().toISOString()
    };

    onIntegrationAdded(newIntegration);
    
    toast({
      title: 'Integration Added Successfully',
      description: `${formData.integrationName} has been added to your integrations.`,
    });

    // Reset form
    setFormData({
      integrationName: '',
      description: '',
      category: '',
      connectionType: '',
      clientId: '',
      clientSecret: '',
      redirectUri: '',
      apiKey: '',
      apiUrl: '',
      roleArn: '',
      region: '',
      tenantId: '',
      applicationId: '',
      syncFrequency: 'hourly',
      enableNotifications: true,
      enableDataValidation: true,
      tags: []
    });
    setErrors({});
    setValidationMessage('');
    setTestResult('idle');
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const validationStatus = getValidationStatus();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Add New Integration</h2>
              <p className="text-sm text-muted-foreground font-normal">
                Configure a new enterprise system integration
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="integration-name">Integration Name *</Label>
                  <Input
                    id="integration-name"
                    placeholder="e.g., Salesforce CRM"
                    value={formData.integrationName}
                    onChange={(e) => handleInputChange('integrationName', e.target.value)}
                    className={errors.integrationName ? 'border-red-500' : ''}
                  />
                  {errors.integrationName && (
                    <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                      <XCircle className="h-3 w-3" />
                      {errors.integrationName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                      <XCircle className="h-3 w-3" />
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the integration and its purpose..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={errors.description ? 'border-red-500' : ''}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <XCircle className="h-3 w-3" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Integration Preview</p>
                  <p className="text-xs text-muted-foreground">
                    {formData.integrationName ? (
                      <>
                        {formData.integrationName} - {formData.category || 'No category'}
                      </>
                    ) : (
                      'Enter integration details to see preview'
                    )}
                  </p>
                </div>
              </div>
              <Badge variant={validationStatus === 'valid' ? 'default' : 'secondary'}>
                {validationStatus === 'valid' ? 'Ready' : validationStatus === 'partial' ? 'Partial' : 'Incomplete'}
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="authentication" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="connection-type">Connection Type *</Label>
                <Select
                  value={formData.connectionType}
                  onValueChange={(value) => handleInputChange('connectionType', value)}
                >
                  <SelectTrigger className={errors.connectionType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select connection type" />
                  </SelectTrigger>
                  <SelectContent>
                    {connectionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.connectionType && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <XCircle className="h-3 w-3" />
                    {errors.connectionType}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {formData.connectionType === 'OAuth 2.0' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">OAuth 2.0 Configuration</p>
                    <p className="text-xs text-muted-foreground">
                      Configure OAuth 2.0 credentials for secure authentication
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client-id">Client ID *</Label>
                    <Input
                      id="client-id"
                      placeholder="Enter OAuth client ID"
                      value={formData.clientId}
                      onChange={(e) => handleInputChange('clientId', e.target.value)}
                      className={errors.clientId ? 'border-red-500' : ''}
                    />
                    {errors.clientId && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <XCircle className="h-3 w-3" />
                        {errors.clientId}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="client-secret">Client Secret *</Label>
                    <Input
                      id="client-secret"
                      type="password"
                      placeholder="Enter OAuth client secret"
                      value={formData.clientSecret}
                      onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                      className={errors.clientSecret ? 'border-red-500' : ''}
                    />
                    {errors.clientSecret && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <XCircle className="h-3 w-3" />
                        {errors.clientSecret}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="redirect-uri">Redirect URI *</Label>
                  <Input
                    id="redirect-uri"
                    placeholder="https://your-domain.com/oauth/callback"
                    value={formData.redirectUri}
                    onChange={(e) => handleInputChange('redirectUri', e.target.value)}
                    className={errors.redirectUri ? 'border-red-500' : ''}
                  />
                  {errors.redirectUri && (
                    <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                      <XCircle className="h-3 w-3" />
                      {errors.redirectUri}
                    </p>
                  )}
                </div>
              </div>
            )}

            {formData.connectionType === 'API Key' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Zap className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">API Key Configuration</p>
                    <p className="text-xs text-muted-foreground">
                      Configure API key authentication for direct API access
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="api-key">API Key *</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Enter API key"
                      value={formData.apiKey}
                      onChange={(e) => handleInputChange('apiKey', e.target.value)}
                      className={errors.apiKey ? 'border-red-500' : ''}
                    />
                    {errors.apiKey && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <XCircle className="h-3 w-3" />
                        {errors.apiKey}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="api-url">API URL *</Label>
                    <Input
                      id="api-url"
                      placeholder="https://api.example.com/v1"
                      value={formData.apiUrl}
                      onChange={(e) => handleInputChange('apiUrl', e.target.value)}
                      className={errors.apiUrl ? 'border-red-500' : ''}
                    />
                    {errors.apiUrl && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <XCircle className="h-3 w-3" />
                        {errors.apiUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {formData.connectionType === 'IAM Role' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <Database className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-sm">AWS IAM Role Configuration</p>
                    <p className="text-xs text-muted-foreground">
                      Configure AWS IAM role for secure cloud service access
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role-arn">Role ARN *</Label>
                    <Input
                      id="role-arn"
                      placeholder="arn:aws:iam::123456789012:role/YourRoleName"
                      value={formData.roleArn}
                      onChange={(e) => handleInputChange('roleArn', e.target.value)}
                      className={errors.roleArn ? 'border-red-500' : ''}
                    />
                    {errors.roleArn && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <XCircle className="h-3 w-3" />
                        {errors.roleArn}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="region">AWS Region *</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => handleInputChange('region', value)}
                    >
                      <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select AWS region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                        <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.region && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <XCircle className="h-3 w-3" />
                        {errors.region}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {formData.connectionType === 'Microsoft Graph API' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">Microsoft Graph API Configuration</p>
                    <p className="text-xs text-muted-foreground">
                      Configure Microsoft Graph API for Office 365 integration
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tenant-id">Tenant ID *</Label>
                    <Input
                      id="tenant-id"
                      placeholder="12345678-1234-1234-1234-123456789012"
                      value={formData.tenantId}
                      onChange={(e) => handleInputChange('tenantId', e.target.value)}
                      className={errors.tenantId ? 'border-red-500' : ''}
                    />
                    {errors.tenantId && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <XCircle className="h-3 w-3" />
                        {errors.tenantId}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="application-id">Application ID *</Label>
                    <Input
                      id="application-id"
                      placeholder="87654321-4321-4321-4321-210987654321"
                      value={formData.applicationId}
                      onChange={(e) => handleInputChange('applicationId', e.target.value)}
                      className={errors.applicationId ? 'border-red-500' : ''}
                    />
                    {errors.applicationId && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <XCircle className="h-3 w-3" />
                        {errors.applicationId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {formData.connectionType && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Connection Validation</h4>
                  <Badge variant={validationStatus === 'valid' ? 'default' : 'secondary'}>
                    {validationStatus === 'valid' ? 'Ready to Test' : 'Incomplete'}
                  </Badge>
                </div>

                {validationMessage && (
                  <Alert variant={testResult === 'error' ? 'destructive' : 'default'}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{validationMessage}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleTestConnection}
                  disabled={validationStatus !== 'valid' || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Testing Connection...
                    </>
                  ) : validationStatus === 'valid' ? (
                    <>
                      {testResult === 'success' ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : testResult === 'error' ? (
                        <XCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      Test Connection
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Complete Required Fields
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="sync-frequency">Sync Frequency</Label>
                <Select
                  value={formData.syncFrequency}
                  onValueChange={(value) => handleInputChange('syncFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {syncFrequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Integration Options</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts for sync failures and data issues
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={formData.enableNotifications}
                    onCheckedChange={(checked) => handleInputChange('enableNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="validation">Enable Data Validation</Label>
                    <p className="text-xs text-muted-foreground">
                      Validate data integrity during synchronization
                    </p>
                  </div>
                  <Switch
                    id="validation"
                    checked={formData.enableDataValidation}
                    onCheckedChange={(checked) => handleInputChange('enableDataValidation', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        onClick={() => handleInputChange('tags', formData.tags.filter((_, i) => i !== index))}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const tag = input.value.trim();
                        if (tag && !formData.tags.includes(tag)) {
                          handleInputChange('tags', [...formData.tags, tag]);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <Button variant="outline" size="sm">Add</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Settings className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Integration Summary</p>
                  <p className="text-xs text-muted-foreground">
                    Review your configuration before adding the integration
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">General Information</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Integration Name</Label>
                      <p className="font-medium">{formData.integrationName || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Category</Label>
                      <p className="font-medium">
                        {categories.find(c => c.value === formData.category)?.label || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <p className="text-sm">{formData.description || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Connection Details</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Connection Type</Label>
                      <p className="font-medium">{formData.connectionType || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Sync Frequency</Label>
                      <p className="font-medium">
                        {syncFrequencies.find(f => f.value === formData.syncFrequency)?.label || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Options</Label>
                      <div className="space-y-1">
                        <p className="text-sm">
                          {formData.enableNotifications ? '✓' : '✗'} Notifications
                        </p>
                        <p className="text-sm">
                          {formData.enableDataValidation ? '✓' : '✗'} Data Validation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    validationStatus === 'valid' ? 'bg-green-500' : 
                    validationStatus === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">
                      {validationStatus === 'valid' ? 'Ready to Add' : 
                       validationStatus === 'partial' ? 'Partially Complete' : 'Incomplete Configuration'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {validationStatus === 'valid' ? 'All required fields are completed' :
                       validationStatus === 'partial' ? 'Some required fields are missing' :
                       'Please complete all required fields'}
                    </p>
                  </div>
                </div>
                <Progress value={validationStatus === 'valid' ? 100 : validationStatus === 'partial' ? 60 : 20} className="w-24" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={validationStatus !== 'valid' || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Adding Integration...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddIntegrationModal; 