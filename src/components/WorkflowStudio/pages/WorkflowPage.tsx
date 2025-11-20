
import React from 'react';
import WorkflowStudio from '../WorkflowStudio';
import Layout from '@/components/Layout/Layout';
import '../styles.css';

export const WorkflowPage: React.FC = () => {
  return (
    <Layout title="OmniSight Workflow Studio" subtitle="Phase 3">
      <div className="h-[calc(100vh-160px)]">
        <WorkflowStudio />
      </div>
    </Layout>
  );
};

export default WorkflowPage;
