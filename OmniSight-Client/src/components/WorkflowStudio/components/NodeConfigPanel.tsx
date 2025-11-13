
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWorkflow } from '../context/WorkflowContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface NodeConfigPanelProps {
  nodeId: string;
  onClose: () => void;
}

export const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ nodeId, onClose }) => {
  const { workflow, actions } = useWorkflow();
  const [nodeData, setNodeData] = useState<any>(null);
  const [formState, setFormState] = useState<any>({});

  useEffect(() => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (node) {
      setNodeData(node);
      setFormState(node.data.config || {});
    }
  }, [nodeId, workflow.nodes]);

  const handleInputChange = (key: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    if (nodeData) {
      actions.updateNode(nodeId, {
        ...nodeData.data,
        config: formState
      });
      onClose();
    }
  };

  const handleDelete = () => {
    actions.deleteNode(nodeId);
    onClose();
  };

  if (!nodeData) return null;

  const renderConfigFields = () => {
    const nodeType = nodeData.type;
    const configType = nodeData.data.label;

    // Handle specific node configurations based on type and label
    if (nodeType === 'trigger') {
      switch (configType) {
        case 'Schedule':
          return (
            <>
              <div className="space-y-2 mb-4">
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={formState.frequency || 'daily'} 
                  onValueChange={(value) => handleInputChange('frequency', value)}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={formState.time || ''}
                  onChange={(e) => handleInputChange('time', e.target.value)} 
                />
              </div>
            </>
          );

        case 'Data Change':
          return (
            <>
              <div className="space-y-2 mb-4">
                <Label htmlFor="source">Data Source</Label>
                <Select 
                  value={formState.source || ''} 
                  onValueChange={(value) => handleInputChange('source', value)}
                >
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales_data">Sales Data</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="customer_info">Customer Info</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select 
                  value={formState.condition || 'changed'} 
                  onValueChange={(value) => handleInputChange('condition', value)}
                >
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="changed">Changed</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          );

        case 'Email Received':
          return (
            <>
              <div className="space-y-2 mb-4">
                <Label htmlFor="from">From (Email)</Label>
                <Input 
                  id="from" 
                  type="email" 
                  placeholder="sender@example.com"
                  value={formState.from || ''}
                  onChange={(e) => handleInputChange('from', e.target.value)} 
                />
                <p className="text-xs text-muted-foreground mt-1">Leave empty to match any sender</p>
              </div>
              <div className="space-y-2 mb-4">
                <Label htmlFor="subject">Subject Contains</Label>
                <Input 
                  id="subject" 
                  placeholder="Invoice, Report, etc."
                  value={formState.subject || ''}
                  onChange={(e) => handleInputChange('subject', e.target.value)} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasAttachment"
                  checked={formState.hasAttachment || false}
                  onChange={(e) => handleInputChange('hasAttachment', e.target.checked)}
                />
                <Label htmlFor="hasAttachment">Has Attachment</Label>
              </div>
            </>
          );

        // Add more trigger types here
        default:
          return (
            <div className="text-sm text-muted-foreground">
              Configure your {nodeData.data.label} trigger settings
            </div>
          );
      }
    } else if (nodeType === 'condition') {
      switch (configType) {
        case 'Filter':
          return (
            <>
              <div className="space-y-2 mb-4">
                <Label htmlFor="field">Field</Label>
                <Input 
                  id="field" 
                  placeholder="e.g., customer.region"
                  value={formState.field || ''}
                  onChange={(e) => handleInputChange('field', e.target.value)} 
                />
              </div>
              <div className="space-y-2 mb-4">
                <Label htmlFor="operator">Operator</Label>
                <Select 
                  value={formState.operator || 'equals'} 
                  onValueChange={(value) => handleInputChange('operator', value)}
                >
                  <SelectTrigger id="operator">
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="not_equals">Not Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="greater_than">Greater Than</SelectItem>
                    <SelectItem value="less_than">Less Than</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input 
                  id="value" 
                  placeholder="Value to compare against"
                  value={formState.value || ''}
                  onChange={(e) => handleInputChange('value', e.target.value)} 
                />
              </div>
            </>
          );

        // Add more condition types here
        default:
          return (
            <div className="text-sm text-muted-foreground">
              Configure your {nodeData.data.label} condition settings
            </div>
          );
      }
    } else if (nodeType === 'action') {
      switch (configType) {
        case 'Send Email':
          return (
            <>
              <div className="space-y-2 mb-4">
                <Label htmlFor="to">To (Email)</Label>
                <Input 
                  id="to" 
                  type="email" 
                  placeholder="recipient@example.com"
                  value={formState.to || ''}
                  onChange={(e) => handleInputChange('to', e.target.value)} 
                />
              </div>
              <div className="space-y-2 mb-4">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="Email subject"
                  value={formState.subject || ''}
                  onChange={(e) => handleInputChange('subject', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Textarea 
                  id="body" 
                  placeholder="Email content..."
                  value={formState.body || ''}
                  onChange={(e) => handleInputChange('body', e.target.value)} 
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground mt-1">You can use variables like {"{customer_name}"}</p>
              </div>
            </>
          );

        case 'Send Notification':
          return (
            <>
              <div className="space-y-2 mb-4">
                <Label htmlFor="title">Notification Title</Label>
                <Input 
                  id="title" 
                  placeholder="Title"
                  value={formState.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)} 
                />
              </div>
              <div className="space-y-2 mb-4">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Notification content..."
                  value={formState.content || ''}
                  onChange={(e) => handleInputChange('content', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formState.type || 'info'} 
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          );

        // Add more action types here
        default:
          return (
            <div className="text-sm text-muted-foreground">
              Configure your {nodeData.data.label} action settings
            </div>
          );
      }
    }

    return null;
  };

  return (
    <div className="w-80 border-l bg-white overflow-y-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">{nodeData.data.label} Settings</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {renderConfigFields()}
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
