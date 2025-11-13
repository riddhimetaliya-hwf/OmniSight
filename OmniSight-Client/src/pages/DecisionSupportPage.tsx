
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScenarioModeling, HistoricalComparison } from '@/components/DecisionSupport';

const DecisionSupportPage: React.FC = () => {
  return (
    <Layout 
      title="Decision Support" 
      subtitle="Model scenarios and analyze historical performance"
    >
      <Tabs defaultValue="scenario-modeling" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="scenario-modeling">Scenario Modeling</TabsTrigger>
            <TabsTrigger value="historical-comparison">Historical Comparison</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="scenario-modeling">
          <ScenarioModeling />
        </TabsContent>
        
        <TabsContent value="historical-comparison">
          <HistoricalComparison />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default DecisionSupportPage;
