
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { ITSentinel } from '@/components/PerformanceHub';

const ITServicesPage: React.FC = () => {
  return (
    <Layout title="IT Services Performance" subtitle="Monitoring & Intelligence">
      <ITSentinel />
    </Layout>
  );
};

export default ITServicesPage;

