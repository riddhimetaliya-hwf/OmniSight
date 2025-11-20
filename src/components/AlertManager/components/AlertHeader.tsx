
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Upload } from 'lucide-react';
import { useAlertContext } from '../context/AlertContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AlertHeader: React.FC = () => {
  const { createNaturalLanguageRule } = useAlertContext();
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [open, setOpen] = useState(false);

  const handleCreateRule = () => {
    if (naturalLanguage.trim()) {
      createNaturalLanguageRule(naturalLanguage);
      setNaturalLanguage('');
      setOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Alert Manager</h2>
        <p className="text-muted-foreground mt-1">
          Manage alerts, notifications, and escalation rules
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Rule</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Alert Rule</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="naturalLanguage">Describe your alert rule</Label>
                <p className="text-sm text-muted-foreground">
                  Use natural language to define when you want to be alerted.
                </p>
                <Input
                  id="naturalLanguage"
                  placeholder="e.g., Alert me when Q2 revenue drops 10% vs last year"
                  value={naturalLanguage}
                  onChange={(e) => setNaturalLanguage(e.target.value)}
                  className="h-24"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Examples:
                  <ul className="ml-2 mt-1 space-y-1">
                    <li>• "Notify CFO if profit drops below $50k"</li>
                    <li>• "Alert me if any workflow fails 3 times in a row"</li>
                    <li>• "Send email when inventory is low"</li>
                  </ul>
                </p>
              </div>
              <Button onClick={handleCreateRule} disabled={!naturalLanguage.trim()}>
                Create Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AlertHeader;
