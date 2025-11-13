
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { CopilotProvider } from '@/components/ExecCopilot';
import FullPageExecCopilot from '@/components/ExecCopilot/components/FullPageExecCopilot';

const ExecCopilotPage: React.FC = () => {
  return (
    <CopilotProvider>
      <Layout title="Executive Copilot" subtitle="Your AI-Powered Business Assistant">
        <FullPageExecCopilot />
      </Layout>
    </CopilotProvider>
  );
};

export default ExecCopilotPage;
