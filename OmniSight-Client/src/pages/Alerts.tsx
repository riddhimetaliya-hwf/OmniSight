
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { AlertManager } from '@/components/AlertManager';

const Alerts: React.FC = () => {
  return (
    <Layout title="Alerts" subtitle="Monitoring & Notifications">
      <AlertManager />
    </Layout>
  );
};

export default Alerts;
