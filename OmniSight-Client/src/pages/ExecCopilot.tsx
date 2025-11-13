import React, { useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { ExecCopilot, CopilotProvider } from '@/components/ExecCopilot';

const ExecCopilotPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <CopilotProvider>
      <Layout title="Executive Copilot" subtitle="AI-Powered Insights">
        <ExecCopilot />
      </Layout>
    </CopilotProvider>
  );
};

export default ExecCopilotPage;
