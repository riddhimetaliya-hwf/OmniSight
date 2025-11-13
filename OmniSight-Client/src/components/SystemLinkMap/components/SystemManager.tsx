import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemNode as SystemNodeType, SystemEdge, EdgeType } from '../types';
import { X, Plus, Database, ArrowRight } from 'lucide-react';

interface SystemManagerProps {
  onClose: () => void;
  onAddSystem: (systemData: Partial<SystemNodeType>) => void;
  onAddDataFlow: (sourceId: string, targetId: string, flowData: any) => void;
  existingSystems: SystemNodeType[];
  existingEdges: SystemEdge[];
}

const SystemManager: React.FC<SystemManagerProps> = ({
  onClose,
  onAddSystem,
  onAddDataFlow,
  existingSystems,
  existingEdges
}) => {
  const [activeTab, setActiveTab] = useState('system');
  
  // System form state
  const [systemForm, setSystemForm] = useState({
    label: '',
    type: 'custom' as SystemNodeType,
    department: '',
    description: '',
    owner: '',
    tags: [] as string[],
    location: {
      latitude: 0,
      longitude: 0,
      address: '',
      region: '',
      country: ''
    }
  });

  // Data flow form state
  const [flowForm, setFlowForm] = useState({
    sourceId: '',
    targetId: '',
    type: 'data-flow' as EdgeType,
    label: '',
    dataPoints: [] as string[],
    volume: 0,
    frequency: 'real-time',
    animated: false
  });

  const [newTag, setNewTag] = useState('');
  const [newDataPoint, setNewDataPoint] = useState('');

  const systemTypes = [
    { value: 'erp', label: 'ERP System' },
    { value: 'crm', label: 'CRM Platform' },
    { value: 'hr', label: 'HR System' },
    { value: 'marketing', label: 'Marketing Platform' },
    { value: 'finance', label: 'Finance System' },
    { value: 'operations', label: 'Operations System' },
    { value: 'custom', label: 'Custom System' }
  ];

  const departments = [
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'hr', label: 'HR' },
    { value: 'it', label: 'IT' }
  ];

  const edgeTypes = [
    { value: 'data-flow', label: 'Data Flow' },
    { value: 'integration', label: 'Integration' },
    { value: 'dependency', label: 'Dependency' },
    { value: 'bidirectional', label: 'Bidirectional' }
  ];

  const frequencies = [
    { value: 'real-time', label: 'Real-time' },
    { value: 'near-real-time', label: 'Near Real-time' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !systemForm.tags.includes(newTag.trim())) {
      setSystemForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSystemForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddDataPoint = () => {
    if (newDataPoint.trim() && !flowForm.dataPoints.includes(newDataPoint.trim())) {
      setFlowForm(prev => ({
        ...prev,
        dataPoints: [...prev.dataPoints, newDataPoint.trim()]
      }));
      setNewDataPoint('');
    }
  };

  const handleRemoveDataPoint = (pointToRemove: string) => {
    setFlowForm(prev => ({
      ...prev,
      dataPoints: prev.dataPoints.filter(point => point !== pointToRemove)
    }));
  };

  const handleAddSystem = () => {
    if (systemForm.label.trim()) {
      onAddSystem({
        ...systemForm,
        location: systemForm.location.latitude && systemForm.location.longitude ? systemForm.location : undefined
      });
      onClose();
    }
  };

  const handleAddDataFlow = () => {
    if (flowForm.sourceId && flowForm.targetId && flowForm.label.trim()) {
      onAddDataFlow(flowForm.sourceId, flowForm.targetId, flowForm);
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            System Manager
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="system">Add System</TabsTrigger>
            <TabsTrigger value="flow">Add Data Flow</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="system-label">System Name *</Label>
                <Input
                  id="system-label"
                  value={systemForm.label}
                  onChange={(e) => setSystemForm(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Enter system name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-type">System Type</Label>
                <Select
                  value={systemForm.type}
                  onValueChange={(value) => setSystemForm(prev => ({ ...prev, type: value as SystemNodeType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {systemTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="system-department">Department</Label>
                <Select
                  value={systemForm.department}
                  onValueChange={(value) => setSystemForm(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-owner">Owner</Label>
                <Input
                  id="system-owner"
                  value={systemForm.owner}
                  onChange={(e) => setSystemForm(prev => ({ ...prev, owner: e.target.value }))}
                  placeholder="System owner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="system-description">Description</Label>
              <Textarea
                id="system-description"
                value={systemForm.description}
                onChange={(e) => setSystemForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the system's purpose and functionality"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {systemForm.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {systemForm.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="system-lat">Latitude</Label>
                <Input
                  id="system-lat"
                  type="number"
                  step="any"
                  value={systemForm.location.latitude}
                  onChange={(e) => setSystemForm(prev => ({
                    ...prev,
                    location: { ...prev.location, latitude: parseFloat(e.target.value) || 0 }
                  }))}
                  placeholder="Latitude"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-lng">Longitude</Label>
                <Input
                  id="system-lng"
                  type="number"
                  step="any"
                  value={systemForm.location.longitude}
                  onChange={(e) => setSystemForm(prev => ({
                    ...prev,
                    location: { ...prev.location, longitude: parseFloat(e.target.value) || 0 }
                  }))}
                  placeholder="Longitude"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="system-address">Address</Label>
              <Input
                id="system-address"
                value={systemForm.location.address}
                onChange={(e) => setSystemForm(prev => ({
                  ...prev,
                  location: { ...prev.location, address: e.target.value }
                }))}
                placeholder="System address"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAddSystem} disabled={!systemForm.label.trim()}>
                Add System
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="flow" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flow-source">Source System *</Label>
                <Select
                  value={flowForm.sourceId}
                  onValueChange={(value) => setFlowForm(prev => ({ ...prev, sourceId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source system" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingSystems.map((system) => (
                      <SelectItem key={system.id} value={system.id}>
                        {system.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flow-target">Target System *</Label>
                <Select
                  value={flowForm.targetId}
                  onValueChange={(value) => setFlowForm(prev => ({ ...prev, targetId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target system" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingSystems.map((system) => (
                      <SelectItem key={system.id} value={system.id}>
                        {system.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flow-label">Flow Label *</Label>
                <Input
                  id="flow-label"
                  value={flowForm.label}
                  onChange={(e) => setFlowForm(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Data flow description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flow-type">Flow Type</Label>
                <Select
                  value={flowForm.type}
                  onValueChange={(value) => setFlowForm(prev => ({ ...prev, type: value as EdgeType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {edgeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flow-volume">Data Volume</Label>
                <Input
                  id="flow-volume"
                  type="number"
                  value={flowForm.volume}
                  onChange={(e) => setFlowForm(prev => ({ ...prev, volume: parseInt(e.target.value) || 0 }))}
                  placeholder="Records per day"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flow-frequency">Frequency</Label>
                <Select
                  value={flowForm.frequency}
                  onValueChange={(value) => setFlowForm(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Data Points</Label>
              <div className="flex space-x-2">
                <Input
                  value={newDataPoint}
                  onChange={(e) => setNewDataPoint(e.target.value)}
                  placeholder="Add a data point"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDataPoint()}
                />
                <Button onClick={handleAddDataPoint} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {flowForm.dataPoints.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {flowForm.dataPoints.map((point) => (
                    <Badge key={point} variant="secondary" className="flex items-center space-x-1">
                      <span>{point}</span>
                      <button
                        onClick={() => handleRemoveDataPoint(point)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="flow-animated"
                checked={flowForm.animated}
                onChange={(e) => setFlowForm(prev => ({ ...prev, animated: e.target.checked }))}
              />
              <Label htmlFor="flow-animated">Animated flow</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddDataFlow} 
                disabled={!flowForm.sourceId || !flowForm.targetId || !flowForm.label.trim()}
              >
                Add Data Flow
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SystemManager; 