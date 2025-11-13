
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { InsightsEngine } from '@/components/InsightsEngine';

const Insights: React.FC = () => {
  return (
    <Layout title="Insights" subtitle="Business Intelligence">
      <InsightsEngine />
    </Layout>
  );
};

export default Insights;
