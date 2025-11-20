
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { ExecutiveCommandCenter } from '@/components/ExecutiveCommandCenter';

const CommandCenter: React.FC = () => {
  return (
    <Layout 
      title="Executive Command Center" 
      subtitle="Role-Specific Executive Dashboard"
      fullWidth={true}
    >
      <div className="w-full">
        <ExecutiveCommandCenter />
      </div>
    </Layout>
  );
};

export default CommandCenter;
