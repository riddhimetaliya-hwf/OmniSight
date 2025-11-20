
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KnowledgeBase } from '@/components/LearningResources';

const LearningResourcesPage: React.FC = () => {
  return (
    <Layout 
      title="Learning Resources" 
      subtitle="Learn how to use the platform and get the most from its features"
    >
      <Tabs defaultValue="knowledge-base" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
            <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
            <TabsTrigger value="guides">User Guides</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="knowledge-base">
          <KnowledgeBase />
        </TabsContent>
        
        <TabsContent value="tutorials">
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Video tutorials will be available soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="guides">
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">User guides will be available soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default LearningResourcesPage;
