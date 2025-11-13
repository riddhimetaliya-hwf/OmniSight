import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { 
  Settings, 
  Shield, 
  Activity, 
  Database, 
  Clock, 
  Save,
  TestTube,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    id: string;
    name: string;
    description: string;
    logoSrc: string;
    status: string;
    connectionType: string;
    healthScore?: number;
    dataFlow?: {
      incoming: number;
      outgoing: number;
    };
  };
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  isOpen,
  onClose,
  integration
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    integrationName: integration.name,
    description: integration.description,
    connectionType: integration.connectionType,
    // OAuth 2.0 fields
    clientId: '',
    clientSecret: '',
    redirectUri: 'https://app.omnisight.com/oauth/callback',
    scopes: 'read,write,admin',
    autoRefresh: false,
    secureStorage: true,
    // API Key fields
    apiKey: '',
    apiSecret: '',
    // IAM Role fields
    roleArn: '',
    region: 'us-east-1',
    // Microsoft Graph fields
    tenantId: '',
    applicationId: '',
    clientSecretMs: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationMessage, setValidationMessage] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Connection Type validation
    if (!formData.connectionType) {
      newErrors.connectionType = 'Connection type is required';
    }
    
    // Validate based on connection type
    switch (formData.connectionType) {
      case 'OAuth 2.0':
        if (!formData.clientId.trim()) {
          newErrors.clientId = 'Client ID is required';
        } else if (formData.clientId.length < 10) {
          newErrors.clientId = 'Client ID must be at least 10 characters';
        }
        
        if (!formData.clientSecret.trim()) {
          newErrors.clientSecret = 'Client Secret is required';
        } else if (formData.clientSecret.length < 8) {
          newErrors.clientSecret = 'Client Secret must be at least 8 characters';
        }
        
        if (!formData.redirectUri.trim()) {
          newErrors.redirectUri = 'Redirect URI is required';
        } else {
          try {
            new URL(formData.redirectUri);
          } catch {
            newErrors.redirectUri = 'Redirect URI must be a valid URL';
          }
        }
        
        if (!formData.scopes.trim()) {
          newErrors.scopes = 'At least one scope is required';
        }
        break;
        
      case 'API Key':
        if (!formData.apiKey.trim()) {
          newErrors.apiKey = 'API Key is required';
        } else if (formData.apiKey.length < 8) {
          newErrors.apiKey = 'API Key must be at least 8 characters';
        }
        
        if (!formData.apiSecret.trim()) {
          newErrors.apiSecret = 'API Secret is required';
        } else if (formData.apiSecret.length < 8) {
          newErrors.apiSecret = 'API Secret must be at least 8 characters';
        }
        break;
        
      case 'IAM Role':
        if (!formData.roleArn.trim()) {
          newErrors.roleArn = 'Role ARN is required';
        } else if (!formData.roleArn.startsWith('arn:aws:iam::')) {
          newErrors.roleArn = 'Role ARN must be a valid AWS IAM role ARN';
        }
        
        if (!formData.region.trim()) {
          newErrors.region = 'AWS Region is required';
        }
        break;
        
      case 'Microsoft Graph API':
        if (!formData.tenantId.trim()) {
          newErrors.tenantId = 'Tenant ID is required';
        } else if (!/^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/.test(formData.tenantId)) {
          newErrors.tenantId = 'Tenant ID must be a valid GUID';
        }
        
        if (!formData.applicationId.trim()) {
          newErrors.applicationId = 'Application ID is required';
        } else if (!/^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/.test(formData.applicationId)) {
          newErrors.applicationId = 'Application ID must be a valid GUID';
        }
        
        if (!formData.clientSecretMs.trim()) {
          newErrors.clientSecretMs = 'Client Secret is required';
        } else if (formData.clientSecretMs.length < 8) {
          newErrors.clientSecretMs = 'Client Secret must be at least 8 characters';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestConnection = async () => {
    // Clear previous results
    setTestResult(null);
    setValidationMessage('');
    
    // Validate form
    if (!validateForm()) {
      setValidationMessage('Please fix the validation errors before testing the connection.');
      return;
    }
    
    setIsTesting(true);
    
    // Simulate connection test with validation
    setTimeout(() => {
      setIsTesting(false);
      
      // Simulate different error scenarios based on input
      if (formData.clientId.includes('invalid') || formData.clientSecret.includes('invalid')) {
        setTestResult('error');
        setValidationMessage('Invalid credentials. Please check your Client ID and Client Secret.');
      } else if (formData.clientId.length < 15) {
        setTestResult('error');
        setValidationMessage('Client ID format is invalid. Please verify your credentials.');
      } else {
        setTestResult('success');
        setValidationMessage('Connection established successfully!');
      }
    }, 2000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear validation message when user makes changes
    if (validationMessage) {
      setValidationMessage('');
    }
  };

  const getValidationStatus = () => {
    const hasErrors = Object.keys(errors).length > 0;
    
    // Check required fields based on connection type
    let hasRequiredFields = false;
    switch (formData.connectionType) {
      case 'OAuth 2.0':
        hasRequiredFields = !!(formData.clientId && formData.clientSecret && formData.redirectUri && formData.scopes);
        break;
      case 'API Key':
        hasRequiredFields = !!(formData.apiKey && formData.apiSecret);
        break;
      case 'IAM Role':
        hasRequiredFields = !!(formData.roleArn && formData.region);
        break;
      case 'Microsoft Graph API':
        hasRequiredFields = !!(formData.tenantId && formData.applicationId && formData.clientSecretMs);
        break;
      default:
        hasRequiredFields = false;
    }
    
    if (hasErrors) return 'error';
    if (hasRequiredFields) return 'ready';
    return 'incomplete';
  };

  const getTestButtonText = () => {
    const status = getValidationStatus();
    if (isTesting) return 'Testing...';
    if (status === 'error') return 'Fix Errors First';
    if (status === 'incomplete') return 'Complete Required Fields';
    return 'Test Connection';
  };

  const isTestButtonDisabled = () => {
    return isTesting || getValidationStatus() !== 'ready';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border flex items-center justify-center">
              <img 
                src={integration.logoSrc || '/placeholder.svg'} 
                alt={`${integration.name} logo`} 
                className="max-h-8 max-w-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <div>
              <DialogTitle className="text-xl">{integration.name} Configuration</DialogTitle>
              <p className="text-sm text-muted-foreground">{integration.description}</p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="authentication" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Authentication
            </TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync Settings
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="integration-name">Integration Name</Label>
                  <Input 
                    id="integration-name" 
                    value={formData.integrationName}
                    onChange={(e) => handleInputChange('integrationName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Connection Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                    </div>
                    {integration.healthScore && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Health Score</span>
                        <span className="font-medium">{integration.healthScore}%</span>
                      </div>
                    )}
                    {integration.dataFlow && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Data Flow (24h)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-medium text-green-700">
                              {(integration.dataFlow.incoming / 1000).toFixed(1)}K
                            </div>
                            <div className="text-green-600">Incoming</div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="font-medium text-blue-700">
                              {(integration.dataFlow.outgoing / 1000).toFixed(1)}K
                            </div>
                            <div className="text-blue-600">Outgoing</div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="authentication" className="space-y-6">
            {/* Connection Type Selection */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="connection-type">Connection Type</Label>
                <Select 
                  value={formData.connectionType}
                  onValueChange={(value) => handleInputChange('connectionType', value)}
                >
                  <SelectTrigger className={errors.connectionType ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OAuth 2.0">OAuth 2.0</SelectItem>
                    <SelectItem value="API Key">API Key</SelectItem>
                    <SelectItem value="IAM Role">IAM Role</SelectItem>
                    <SelectItem value="Microsoft Graph API">Microsoft Graph API</SelectItem>
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

            {/* Dynamic Authentication Form */}
            {formData.connectionType === 'OAuth 2.0' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="client-id">Client ID</Label>
                    <Input 
                      id="client-id" 
                      type="password" 
                      placeholder="Enter client ID"
                      value={formData.clientId}
                      onChange={(e) => handleInputChange('clientId', e.target.value)}
                      className={errors.clientId ? 'border-red-500' : ''}
                    />
                    {errors.clientId && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.clientId}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="client-secret">Client Secret</Label>
                    <Input 
                      id="client-secret" 
                      type="password" 
                      placeholder="Enter client secret"
                      value={formData.clientSecret}
                      onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                      className={errors.clientSecret ? 'border-red-500' : ''}
                    />
                    {errors.clientSecret && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.clientSecret}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="redirect-uri">Redirect URI</Label>
                    <Input 
                      id="redirect-uri" 
                      value={formData.redirectUri}
                      onChange={(e) => handleInputChange('redirectUri', e.target.value)}
                      className={errors.redirectUri ? 'border-red-500' : ''}
                    />
                    {errors.redirectUri && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.redirectUri}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="scopes">Required Scopes</Label>
                    <Textarea 
                      id="scopes" 
                      placeholder="Enter required scopes (comma-separated)"
                      value={formData.scopes}
                      onChange={(e) => handleInputChange('scopes', e.target.value)}
                      rows={3}
                      className={errors.scopes ? 'border-red-500' : ''}
                    />
                    {errors.scopes && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.scopes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-refresh" 
                      checked={formData.autoRefresh}
                      onCheckedChange={(checked) => handleInputChange('autoRefresh', checked)}
                    />
                    <Label htmlFor="auto-refresh">Auto-refresh tokens</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="secure-storage" 
                      checked={formData.secureStorage}
                      onCheckedChange={(checked) => handleInputChange('secureStorage', checked)}
                    />
                    <Label htmlFor="secure-storage">Use secure storage</Label>
                  </div>
                </div>
              </div>
            )}

            {formData.connectionType === 'API Key' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key" 
                      type="password" 
                      placeholder="Enter API key"
                      value={formData.apiKey}
                      onChange={(e) => handleInputChange('apiKey', e.target.value)}
                      className={errors.apiKey ? 'border-red-500' : ''}
                    />
                    {errors.apiKey && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.apiKey}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="api-secret">API Secret</Label>
                    <Input 
                      id="api-secret" 
                      type="password" 
                      placeholder="Enter API secret"
                      value={formData.apiSecret}
                      onChange={(e) => handleInputChange('apiSecret', e.target.value)}
                      className={errors.apiSecret ? 'border-red-500' : ''}
                    />
                    {errors.apiSecret && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.apiSecret}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2 text-blue-800">API Key Authentication</h4>
                    <p className="text-sm text-blue-700">
                      Provide your API key and secret for direct API access. This method is simpler but less secure than OAuth.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.connectionType === 'IAM Role' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role-arn">Role ARN</Label>
                    <Input 
                      id="role-arn" 
                      placeholder="arn:aws:iam::123456789012:role/YourRoleName"
                      value={formData.roleArn}
                      onChange={(e) => handleInputChange('roleArn', e.target.value)}
                      className={errors.roleArn ? 'border-red-500' : ''}
                    />
                    {errors.roleArn && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.roleArn}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="region">AWS Region</Label>
                    <Select 
                      value={formData.region}
                      onValueChange={(value) => handleInputChange('region', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                        <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2 text-orange-800">IAM Role Authentication</h4>
                    <p className="text-sm text-orange-700">
                      Use AWS IAM roles for secure, credential-free authentication. Ensure the role has the necessary permissions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.connectionType === 'Microsoft Graph API' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tenant-id">Tenant ID</Label>
                    <Input 
                      id="tenant-id" 
                      placeholder="00000000-0000-0000-0000-000000000000"
                      value={formData.tenantId}
                      onChange={(e) => handleInputChange('tenantId', e.target.value)}
                      className={errors.tenantId ? 'border-red-500' : ''}
                    />
                    {errors.tenantId && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.tenantId}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="application-id">Application ID</Label>
                    <Input 
                      id="application-id" 
                      placeholder="00000000-0000-0000-0000-000000000000"
                      value={formData.applicationId}
                      onChange={(e) => handleInputChange('applicationId', e.target.value)}
                      className={errors.applicationId ? 'border-red-500' : ''}
                    />
                    {errors.applicationId && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.applicationId}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="client-secret-ms">Client Secret</Label>
                    <Input 
                      id="client-secret-ms" 
                      type="password" 
                      placeholder="Enter client secret"
                      value={formData.clientSecretMs}
                      onChange={(e) => handleInputChange('clientSecretMs', e.target.value)}
                      className={errors.clientSecretMs ? 'border-red-500' : ''}
                    />
                    {errors.clientSecretMs && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.clientSecretMs}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2 text-purple-800">Microsoft Graph API</h4>
                    <p className="text-sm text-purple-700">
                      Connect to Microsoft 365 services using Azure AD application credentials. Register your app in Azure AD first.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Separator />
            
            {/* Dynamic Validation Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Validation Status</h4>
              <div className="space-y-1 text-sm">
                {formData.connectionType === 'OAuth 2.0' && (
                  <>
                    <div className="flex items-center gap-2">
                      {formData.clientId ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span className={formData.clientId ? 'text-green-700' : 'text-red-700'}>
                        Client ID {formData.clientId ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.clientSecret ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span className={formData.clientSecret ? 'text-green-700' : 'text-red-700'}>
                        Client Secret {formData.clientSecret ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.redirectUri && !errors.redirectUri ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span className={formData.redirectUri && !errors.redirectUri ? 'text-green-700' : 'text-red-700'}>
                        Redirect URI {formData.redirectUri && !errors.redirectUri ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.scopes ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span className={formData.scopes ? 'text-green-700' : 'text-red-700'}>
                        Required Scopes {formData.scopes ? '✓' : '✗'}
                      </span>
                    </div>
                  </>
                )}
                
                {formData.connectionType === 'API Key' && (
                  <>
                    <div className="flex items-center gap-2">
                      {formData.apiKey ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span className={formData.apiKey ? 'text-green-700' : 'text-red-700'}>
                        API Key {formData.apiKey ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.apiSecret ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span className={formData.apiSecret ? 'text-green-700' : 'text-red-700'}>
                        API Secret {formData.apiSecret ? '✓' : '✗'}
                      </span>
                    </div>
                  </>
                )}
                
                {formData.connectionType === 'IAM Role' && (
                  <>
                    <div className="flex items-center gap-2">
                      {formData.roleArn ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span className={formData.roleArn ? 'text-green-700' : 'text-red-700'}>
                        Role ARN {formData.roleArn ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.region ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span className={formData.region ? 'text-green-700' : 'text-red-700'}>
                        AWS Region {formData.region ? '✓' : '✗'}
                      </span>
                    </div>
                  </>
                )}
                
                {formData.connectionType === 'Microsoft Graph API' && (
                  <>
                    <div className="flex items-center gap-2">
                      {formData.tenantId ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span className={formData.tenantId ? 'text-green-700' : 'text-red-700'}>
                        Tenant ID {formData.tenantId ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.applicationId ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span className={formData.applicationId ? 'text-green-700' : 'text-red-700'}>
                        Application ID {formData.applicationId ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.clientSecretMs ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span className={formData.clientSecretMs ? 'text-green-700' : 'text-red-700'}>
                        Client Secret {formData.clientSecretMs ? '✓' : '✗'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Validation Alert */}
            {validationMessage && (
              <Alert variant={testResult === 'error' ? 'destructive' : 'default'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleTestConnection}
                disabled={isTestButtonDisabled()}
                className={`flex items-center gap-2 ${
                  getValidationStatus() === 'error' ? 'bg-red-500 hover:bg-red-600' : 
                  getValidationStatus() === 'incomplete' ? 'bg-gray-400 hover:bg-gray-500' : ''
                }`}
              >
                {isTesting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : getValidationStatus() === 'error' ? (
                  <XCircle className="h-4 w-4" />
                ) : getValidationStatus() === 'incomplete' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <TestTube className="h-4 w-4" />
                )}
                {getTestButtonText()}
              </Button>
              
              {testResult && !validationMessage && (
                <div className="flex items-center gap-2">
                  {testResult === 'success' ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Connection successful</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">Connection failed</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sync-frequency">Sync Frequency</Label>
                  <Select defaultValue="hourly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="5min">Every 5 minutes</SelectItem>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="batch-size">Batch Size</Label>
                  <Input id="batch-size" type="number" defaultValue="1000" />
                </div>
                <div>
                  <Label htmlFor="retry-attempts">Retry Attempts</Label>
                  <Input id="retry-attempts" type="number" defaultValue="3" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sync-window">Sync Window</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last 1 hour</SelectItem>
                      <SelectItem value="6h">Last 6 hours</SelectItem>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="incremental-sync" defaultChecked />
                  <Label htmlFor="incremental-sync">Incremental sync</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="backup-before-sync" />
                  <Label htmlFor="backup-before-sync">Backup before sync</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="alert-threshold">Alert Threshold (%)</Label>
                  <Input id="alert-threshold" type="number" defaultValue="80" />
                </div>
                <div>
                  <Label htmlFor="notification-email">Notification Email</Label>
                  <Input id="notification-email" type="email" placeholder="admin@company.com" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="enable-alerts" defaultChecked />
                  <Label htmlFor="enable-alerts">Enable alerts</Label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="log-retention">Log Retention (days)</Label>
                  <Input id="log-retention" type="number" defaultValue="30" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="detailed-logging" defaultChecked />
                  <Label htmlFor="detailed-logging">Detailed logging</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="performance-metrics" defaultChecked />
                  <Label htmlFor="performance-metrics">Performance metrics</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationModal; 