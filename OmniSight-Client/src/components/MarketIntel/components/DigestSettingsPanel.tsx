
import React, { useState } from 'react';
import { DigestSettings, DigestFrequency, FilterOptions } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { 
  Bell, 
  X, 
  Plus 
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface DigestSettingsPanelProps {
  settings: DigestSettings;
  onUpdateSettings: (settings: Partial<DigestSettings>) => void;
  availableFilters: {
    industries: string[];
    departments: string[];
    geographies: string[];
    topics: string[];
  };
}

export const DigestSettingsPanel: React.FC<DigestSettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  availableFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  
  const frequencyOptions: { value: DigestFrequency; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'realtime', label: 'Real-time alerts only' }
  ];
  
  const handleToggleEnabled = (enabled: boolean) => {
    onUpdateSettings({ enabled });
  };
  
  const handleFrequencyChange = (frequency: DigestFrequency) => {
    onUpdateSettings({ frequency });
  };
  
  const handleAddEmail = () => {
    if (!email) return;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    if (settings.emailAddresses.includes(email)) {
      toast({
        title: "Email already added",
        description: "This email is already in the list",
        variant: "destructive"
      });
      return;
    }
    
    onUpdateSettings({ 
      emailAddresses: [...settings.emailAddresses, email] 
    });
    setEmail('');
  };
  
  const handleRemoveEmail = (emailToRemove: string) => {
    onUpdateSettings({ 
      emailAddresses: settings.emailAddresses.filter(e => e !== emailToRemove) 
    });
  };
  
  const handleFilterChange = (filterType: keyof FilterOptions, values: any) => {
    onUpdateSettings({
      filters: {
        ...settings.filters,
        [filterType]: values
      }
    });
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Digest settings saved",
      description: `You will receive ${settings.frequency} intelligence digests at ${settings.emailAddresses.join(', ')}`,
    });
    setIsOpen(false);
  };
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-9 space-x-1"
        onClick={() => setIsOpen(true)}
      >
        <Bell className="h-3.5 w-3.5" />
        <span className="text-xs">Digest Settings</span>
      </Button>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Intelligence Digest Settings</SheetTitle>
            <SheetDescription>
              Configure your intelligence digest preferences and notification settings.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="digest-enabled">Enable digests</Label>
                <div className="text-xs text-muted-foreground">
                  Receive intelligence summaries based on your preferences
                </div>
              </div>
              <Switch
                id="digest-enabled"
                checked={settings.enabled}
                onCheckedChange={handleToggleEnabled}
              />
            </div>
            
            {settings.enabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="digest-frequency">Digest frequency</Label>
                  <Select
                    value={settings.frequency}
                    onValueChange={(value) => handleFrequencyChange(value as DigestFrequency)}
                  >
                    <SelectTrigger id="digest-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label>Email recipients</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddEmail}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.emailAddresses.map(email => (
                      <Badge key={email} variant="secondary" className="px-2 py-1 text-xs">
                        {email}
                        <button 
                          className="ml-1 p-0.5"
                          onClick={() => handleRemoveEmail(email)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {settings.emailAddresses.length === 0 && (
                      <div className="text-xs text-muted-foreground">
                        No recipients added yet
                      </div>
                    )}
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Alert Settings</CardTitle>
                    <CardDescription className="text-xs">
                      Configure which types of intelligence to include in your digest
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-2 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Minimum alert level</Label>
                      <div className="flex justify-between items-center">
                        <div className="grid grid-cols-4 gap-2 w-full">
                          {['low', 'medium', 'high', 'critical'].map(level => (
                            <Button
                              key={level}
                              variant="outline"
                              size="sm"
                              className={`text-xs ${
                                settings.filters.alertLevel?.includes(level as any)
                                  ? level === 'critical' ? 'bg-red-100 border-red-300' :
                                    level === 'high' ? 'bg-orange-100 border-orange-300' :
                                    level === 'medium' ? 'bg-yellow-100 border-yellow-300' :
                                    'bg-blue-100 border-blue-300'
                                  : ''
                              }`}
                              onClick={() => {
                                const current = settings.filters.alertLevel || [];
                                const updated = current.includes(level as any)
                                  ? current.filter(l => l !== level)
                                  : [...current, level];
                                handleFilterChange('alertLevel', updated);
                              }}
                            >
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Minimum relevance score: {settings.filters.relevanceThreshold || 0}</Label>
                      <Select
                        value={(settings.filters.relevanceThreshold || 0).toString()}
                        onValueChange={(value) => handleFilterChange('relevanceThreshold', parseInt(value))}
                      >
                        <SelectTrigger id="relevance-threshold">
                          <SelectValue placeholder="Select minimum relevance" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 25, 50, 75, 90].map(score => (
                            <SelectItem key={score} value={score.toString()}>
                              {score} {score > 0 ? `(${score}% relevance or higher)` : '(Include all)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DigestSettingsPanel;
