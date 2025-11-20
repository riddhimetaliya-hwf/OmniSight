
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeedbackCollector, FeatureVoting } from '@/components/UserFeedback';

const UserFeedbackPage: React.FC = () => {
  return (
    <Layout 
      title="User Feedback" 
      subtitle="Share your thoughts and vote on feature requests"
    >
      <Tabs defaultValue="feature-voting" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="feature-voting">Feature Requests</TabsTrigger>
            <TabsTrigger value="feedback">Submit Feedback</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="feature-voting">
          <FeatureVoting />
        </TabsContent>
        
        <TabsContent value="feedback">
          <FeedbackCollector />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default UserFeedbackPage;
