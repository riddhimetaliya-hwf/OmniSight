
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { IntegrationHub } from '@/components/IntegrationHub/Dashboard';

const IntegrationsPage: React.FC = () => {
  return (
    <Layout title="Integration Hub" subtitle="Connect and manage your enterprise systems">
      <div className="container-fluid mx-auto">
        <IntegrationHub />
      </div>
    </Layout>
  );
};

export default IntegrationsPage;
