
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SaveIcon, Send, CalendarClock } from 'lucide-react';
import { usePerformanceBriefing } from '../context/PerformanceBriefingContext';

const BriefingSettings: React.FC = () => {
  const { settings, updateSettings, scheduleBriefing, cancelScheduledBriefing } = usePerformanceBriefing();
  const [emailRecipient, setEmailRecipient] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  const handleRoleChange = (value: string) => {
    updateSettings({ role: value as any });
  };
  
  const handleDepartmentToggle = (department: string) => {
    const departments = settings.departments.includes(department)
      ? settings.departments.filter(d => d !== department)
      : [...settings.departments, department];
    
    updateSettings({ departments });
  };
  
  const handleCategoryToggle = (category: 'kpi' | 'risk' | 'opportunity' | 'trend') => {
    const categories = settings.categories.includes(category)
      ? settings.categories.filter(c => c !== category)
      : [...settings.categories, category];
    
    updateSettings({ categories });
  };
  
  const handleAddEmailRecipient = () => {
    if (!emailRecipient || !emailRecipient.includes('@')) return;
    
    const emailRecipients = settings.emailRecipients
      ? [...settings.emailRecipients, emailRecipient]
      : [emailRecipient];
    
    updateSettings({ emailRecipients });
    setEmailRecipient('');
  };
  
  const handleRemoveEmailRecipient = (email: string) => {
    if (!settings.emailRecipients) return;
    
    const emailRecipients = settings.emailRecipients.filter(e => e !== email);
    updateSettings({ emailRecipients });
  };
  
  const handleSchedule = () => {
    if (!scheduleTime) return;
    
    scheduleBriefing({
      scheduledTime: scheduleTime,
      isScheduled: true
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Briefing Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="role">
          <AccordionItem value="role">
            <AccordionTrigger className="text-sm">Role & Content</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Executive Role</Label>
                  <Select value={settings.role} onValueChange={handleRoleChange}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CEO">CEO</SelectItem>
                      <SelectItem value="CIO">CIO</SelectItem>
                      <SelectItem value="CFO">CFO</SelectItem>
                      <SelectItem value="COO">COO</SelectItem>
                      <SelectItem value="CHRO">CHRO</SelectItem>
                      <SelectItem value="CTO">CTO</SelectItem>
                      <SelectItem value="CMO">CMO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Departments</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="it" 
                        checked={settings.departments.includes('IT')}
                        onCheckedChange={() => handleDepartmentToggle('IT')}
                      />
                      <Label htmlFor="it" className="text-sm">IT</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hr" 
                        checked={settings.departments.includes('HR')}
                        onCheckedChange={() => handleDepartmentToggle('HR')}
                      />
                      <Label htmlFor="hr" className="text-sm">HR</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="operations" 
                        checked={settings.departments.includes('Operations')}
                        onCheckedChange={() => handleDepartmentToggle('Operations')}
                      />
                      <Label htmlFor="operations" className="text-sm">Operations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cs" 
                        checked={settings.departments.includes('Customer Service')}
                        onCheckedChange={() => handleDepartmentToggle('Customer Service')}
                      />
                      <Label htmlFor="cs" className="text-sm">Customer Service</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Content Categories</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="kpi" 
                        checked={settings.categories.includes('kpi')}
                        onCheckedChange={() => handleCategoryToggle('kpi')}
                      />
                      <Label htmlFor="kpi" className="text-sm">KPIs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="risk" 
                        checked={settings.categories.includes('risk')}
                        onCheckedChange={() => handleCategoryToggle('risk')}
                      />
                      <Label htmlFor="risk" className="text-sm">Risks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="opportunity" 
                        checked={settings.categories.includes('opportunity')}
                        onCheckedChange={() => handleCategoryToggle('opportunity')}
                      />
                      <Label htmlFor="opportunity" className="text-sm">Opportunities</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trend" 
                        checked={settings.categories.includes('trend')}
                        onCheckedChange={() => handleCategoryToggle('trend')}
                      />
                      <Label htmlFor="trend" className="text-sm">Trends</Label>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="delivery">
            <AccordionTrigger className="text-sm">Email Delivery</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="email@example.com" 
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleAddEmailRecipient} className="shrink-0">
                      Add
                    </Button>
                  </div>
                  
                  {settings.emailRecipients && settings.emailRecipients.length > 0 && (
                    <div className="mt-2">
                      <Label className="text-xs text-muted-foreground mb-1 block">Recipients</Label>
                      <div className="flex flex-wrap gap-1">
                        {settings.emailRecipients.map(email => (
                          <Badge key={email} variant="secondary" className="flex items-center gap-1">
                            {email}
                            <button 
                              onClick={() => handleRemoveEmailRecipient(email)}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="schedule-time">Schedule Time</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="schedule-time"
                      type="datetime-local" 
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSchedule} 
                    disabled={!scheduleTime}
                    className="flex-1 gap-2"
                  >
                    <CalendarClock className="h-4 w-4" />
                    Schedule
                  </Button>
                  
                  {settings.isScheduled && (
                    <Button 
                      variant="outline" 
                      onClick={() => cancelScheduledBriefing()}
                      className="flex-1"
                    >
                      Cancel Schedule
                    </Button>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  disabled={!settings.emailRecipients || settings.emailRecipients.length === 0}
                >
                  <Send className="h-4 w-4" />
                  Send Now
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="save">
            <AccordionTrigger className="text-sm">Save Configuration</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="config-name">Configuration Name</Label>
                  <Input id="config-name" placeholder="My Briefing Configuration" />
                </div>
                
                <Button className="w-full gap-2">
                  <SaveIcon className="h-4 w-4" />
                  Save Configuration
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default BriefingSettings;
