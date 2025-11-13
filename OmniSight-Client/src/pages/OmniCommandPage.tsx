
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { OmniCommand } from '@/components/OmniCommand';
import { CopilotProvider } from '@/components/ExecCopilot';

const OmniCommandPage: React.FC = () => {
  return (
    <CopilotProvider>
      <Layout title="Executive Command Center" subtitle="Mission Control for Executives">
        <OmniCommand />
      </Layout>
    </CopilotProvider>
  );
};

export default OmniCommandPage;
