
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { PromptToAppBuilderUI } from '@/components/PromptToAppBuilder';
import { DemoEngine } from '@/components/DemoEngine';

const PromptToAppBuilderPage: React.FC = () => {
  return (
    <DemoEngine>
      <Layout 
        title="Conversational App Builder" 
        subtitle="Create mini applications using natural language"
      >
        <div className="h-[calc(100vh-180px)]">
          <PromptToAppBuilderUI />
        </div>
      </Layout>
    </DemoEngine>
  );
};

export default PromptToAppBuilderPage;
