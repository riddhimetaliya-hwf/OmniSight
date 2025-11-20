
import React from 'react';
import Layout from '@/components/Layout/Layout';
import PerformanceBriefingAI from '@/components/PerformanceBriefingAI';

const PerformanceBriefingAIPage: React.FC = () => {
  return (
    <Layout 
      title="Performance Briefing AI" 
      subtitle="Executive insight summaries for IT & Business performance"
    >
      <PerformanceBriefingAI />
    </Layout>
  );
};

export default PerformanceBriefingAIPage;
