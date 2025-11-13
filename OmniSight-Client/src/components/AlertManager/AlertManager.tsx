
import React, { useState } from 'react';
import { AlertProvider } from './context/AlertContext';
import AlertHeader from './components/AlertHeader';
import AlertFilters from './components/AlertFilters';
import AlertList from './components/AlertList';
import AlertSummary from './components/AlertSummary';
import AlertRulesList from './components/AlertRulesList';
import { AlertByPrompt } from './components/AlertByPrompt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AlertManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('alerts');

  return (
    <AlertProvider>
      <div className="w-full space-y-6 max-w-[1200px] mx-auto p-4">
        <AlertHeader />
        <AlertSummary />
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
            <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
            <TabsTrigger value="rules">Alert Rules</TabsTrigger>
            <TabsTrigger value="create">Create Alert</TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts" className="mt-4">
            <AlertFilters />
            <div className="mt-4">
              <AlertList />
            </div>
          </TabsContent>
          
          <TabsContent value="rules" className="mt-4">
            <AlertRulesList />
          </TabsContent>
          
          <TabsContent value="create" className="mt-4">
            <AlertByPrompt />
          </TabsContent>
        </Tabs>
      </div>
    </AlertProvider>
  );
};

export default AlertManager;
