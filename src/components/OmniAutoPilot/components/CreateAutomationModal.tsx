
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAutomationContext } from '../context/AutomationContext';
import { Automation, AutomationCategory, AutomationTriggerType, AutomationFrequency } from '../types';
import { WorkflowStudio } from '@/components/WorkflowStudio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NaturalLanguageInput } from './NaturalLanguageInput';

interface CreateAutomationModalProps {
  onClose: () => void;
}

export const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({ onClose }) => {
  const { createAutomation } = useAutomationContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AutomationCategory>('workflows');
  const [triggerType, setTriggerType] = useState<AutomationTriggerType>('schedule');
  const [frequency, setFrequency] = useState<AutomationFrequency>('daily');
  const [creationMethod, setCreationMethod] = useState<'builder' | 'natural'>('builder');

  const handleSubmit = () => {
    if (!name) return;

    const newAutomation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      description,
      category,
      trigger: {
        id: `trigger-${Date.now()}`,
        type: triggerType,
        config: {
          frequency,
          time: '09:00',
        },
        description: getTriggerDescription(),
      },
      actions: [
        {
          id: `action-${Date.now()}`,
          type: 'notification',
          params: {
            channel: 'email',
            recipient: 'user@example.com',
          },
          description: 'Send an email notification',
        },
      ],
      status: 'active',
      createdBy: 'Current User',
      isSystem: false,
      nextRun: getNextRunDate().toISOString(),
    };

    createAutomation(newAutomation);
    onClose();
  };

  const getTriggerDescription = () => {
    switch (triggerType) {
      case 'schedule':
        return `Runs ${frequency}`;
      case 'event':
        return 'Triggered by system event';
      case 'condition':
        return 'Runs when condition is met';
      default:
        return 'Trigger description';
    }
  };

  const getNextRunDate = () => {
    const now = new Date();
    
    switch (frequency) {
      case 'hourly':
        now.setHours(now.getHours() + 1);
        break;
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
      default:
        now.setDate(now.getDate() + 1);
    }
    
    return now;
  };

  const handleNaturalLanguageSubmit = (description: string) => {
    // In a real app, this would parse the natural language and create a structured automation
    setName(`Automation from description`);
    setDescription(description);
    setCategory('workflows');
    setTriggerType('schedule');
    setFrequency('daily');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Automation</DialogTitle>
        </DialogHeader>
        
        <Tabs 
          value={creationMethod} 
          onValueChange={(value) => setCreationMethod(value as 'builder' | 'natural')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="builder">Visual Builder</TabsTrigger>
            <TabsTrigger value="natural">Natural Language</TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Daily Sales Report"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Send daily sales report to the finance team"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={category} 
                    onValueChange={(value) => setCategory(value as AutomationCategory)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reports">Reports</SelectItem>
                      <SelectItem value="notifications">Notifications</SelectItem>
                      <SelectItem value="data">Data</SelectItem>
                      <SelectItem value="workflows">Workflows</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trigger-type">Trigger Type</Label>
                  <Select 
                    value={triggerType} 
                    onValueChange={(value) => setTriggerType(value as AutomationTriggerType)}
                  >
                    <SelectTrigger id="trigger-type">
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="schedule">Schedule</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="condition">Condition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {triggerType === 'schedule' && (
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select 
                    value={frequency} 
                    onValueChange={(value) => setFrequency(value as AutomationFrequency)}
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
              )}
              
              <div className="text-sm text-muted-foreground mt-4">
                For advanced workflow configuration, use the Workflow Studio.
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="natural" className="mt-4">
            <NaturalLanguageInput onSubmit={handleNaturalLanguageSubmit} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name}>
            Create Automation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
