
import React from 'react';
import Layout from '@/components/Layout/Layout';
import WorkflowStudio from '@/components/WorkflowStudio/WorkflowStudio';

const WorkflowStudioPage: React.FC = () => {
  return (
    <Layout title="OmniSight Workflow Studio" subtitle="Phase 3">
      <div className="h-[calc(100vh-160px)]">
        <WorkflowStudio />
      </div>
    </Layout>
  );
};

export default WorkflowStudioPage;
