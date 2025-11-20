
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { ProcessPulse } from '@/components/PerformanceHub';

const ProcessPulsePage: React.FC = () => {
  return (
    <Layout title="Process Pulse" subtitle="Business Process Performance Tracker">
      <ProcessPulse />
    </Layout>
  );
};

export default ProcessPulsePage;
