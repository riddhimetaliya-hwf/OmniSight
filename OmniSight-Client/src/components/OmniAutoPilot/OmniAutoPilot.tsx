
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AutomationList } from './components/AutomationList';
import { AutomationHeader } from './components/AutomationHeader';
import { AutomationLogs } from './components/AutomationLogs';
import { AutomationProvider } from './context/AutomationContext';
import { TooltipProvider } from '@/components/ui/tooltip';

const OmniAutoPilot: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('automations');

  return (
    <AutomationProvider>
      <TooltipProvider>
        <div className="flex flex-col space-y-6">
          <AutomationHeader />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="automations">Automations</TabsTrigger>
              <TabsTrigger value="logs">Activity Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="automations" className="mt-6">
              <AutomationList />
            </TabsContent>
            
            <TabsContent value="logs" className="mt-6">
              <AutomationLogs />
            </TabsContent>
          </Tabs>
        </div>
      </TooltipProvider>
    </AutomationProvider>
  );
};

export default OmniAutoPilot;
