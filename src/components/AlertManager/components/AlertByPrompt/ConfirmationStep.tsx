
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertPromptRule } from '../../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRight, Bell, Edit, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ConfirmationStepProps {
  rule: AlertPromptRule;
  originalPrompt: string;
  onConfirm: (rule: AlertPromptRule) => void;
  onEdit: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  rule,
  originalPrompt,
  onConfirm,
  onEdit
}) => {
  const [updatedRule, setUpdatedRule] = useState<AlertPromptRule>(rule);

  const handleChange = (field: keyof AlertPromptRule, value: any) => {
    setUpdatedRule(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          Confirm Alert Logic
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-md">
          <div className="flex justify-between items-start">
            <div className="text-sm font-medium">Original Prompt</div>
            <Button variant="ghost" size="sm" onClick={onEdit} className="h-6 gap-1">
              <Edit className="h-3 w-3" /> Edit
            </Button>
          </div>
          <p className="mt-1 text-sm italic">"{originalPrompt}"</p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Alert Name</Label>
            <Input
              id="name"
              value={updatedRule.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={updatedRule.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="condition">Condition (System Generated)</Label>
            <Input
              id="condition"
              value={updatedRule.condition}
              readOnly
              className="bg-muted/50"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="threshold">Threshold</Label>
            <div className="flex gap-2">
              <Input
                id="threshold"
                type="number"
                value={updatedRule.threshold || 0}
                onChange={(e) => handleChange('threshold', Number(e.target.value))}
              />
              <Select
                value={updatedRule.thresholdUnit || 'value'}
                onValueChange={(value) => handleChange('thresholdUnit', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="value">Value</SelectItem>
                  <SelectItem value="percent">Percent</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="severity">Severity</Label>
            <Select
              value={updatedRule.severity}
              onValueChange={(value) => handleChange('severity', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={updatedRule.department}
              onValueChange={(value) => handleChange('department', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="it">IT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled" className="cursor-pointer">Enable Alert</Label>
            <Switch
              id="enabled"
              checked={updatedRule.enabled}
              onCheckedChange={(value) => handleChange('enabled', value)}
            />
          </div>

          <div className="pt-4">
            <p className="text-sm font-medium mb-2">Alert Notifications</p>
            <div className="flex flex-wrap gap-2">
              {updatedRule.channels.map((channel) => (
                <Badge key={channel} variant="outline" className="py-1">
                  <Bell className="h-3 w-3 mr-1.5" />
                  {channel.charAt(0).toUpperCase() + channel.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onEdit} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={() => onConfirm(updatedRule)} className="gap-1">
          Create Alert <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfirmationStep;
