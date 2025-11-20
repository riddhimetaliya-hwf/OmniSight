
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { ITCostPulse } from '@/components/PerformanceHub';

const ITCostPulsePage: React.FC = () => {
  return (
    <Layout title="IT Cost Pulse" subtitle="IT Cost of Consumption Tracker">
      <ITCostPulse />
    </Layout>
  );
};

export default ITCostPulsePage;
