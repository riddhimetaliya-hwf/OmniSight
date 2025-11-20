
import React from 'react';
import Layout from '@/components/Layout/Layout';
import OpportunityResponder from '@/components/OpportunityResponder';

const OpportunityResponderPage: React.FC = () => {
  return (
    <Layout 
      title="Opportunity Responder" 
      subtitle="Real-time response engine for critical opportunities"
    >
      <OpportunityResponder />
    </Layout>
  );
};

export default OpportunityResponderPage;
