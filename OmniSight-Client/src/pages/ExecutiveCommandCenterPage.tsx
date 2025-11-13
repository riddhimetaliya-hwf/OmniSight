
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { ExecutiveCommandCenter } from '@/components/ExecutiveCommandCenter';
import { DemoEngine } from '@/components/DemoEngine';

const ExecutiveCommandCenterPage: React.FC = () => {
  return (
    <DemoEngine>
      <Layout 
        title="Executive Command Center" 
        subtitle="Comprehensive executive insights and decision support"
        fullWidth={true}
      >
        <div className="h-[calc(100vh-180px)] overflow-auto pb-8 w-full">
          <ExecutiveCommandCenter />
        </div>
      </Layout>
    </DemoEngine>
  );
};

export default ExecutiveCommandCenterPage;
