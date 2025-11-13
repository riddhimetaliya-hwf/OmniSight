
import React from 'react';
import AppShell from '@/components/AppShell/AppShell';
import { KPITracker } from '@/components/KPITracker';
import Layout from '@/components/Layout/Layout';

const KPITrackerPage: React.FC = () => {
  return (
    <Layout 
      title="KPI Tracker" 
      subtitle="Track and monitor key performance indicators"
      fullWidth={true}
    >
      <div className="w-full">
        <KPITracker />
      </div>
    </Layout>
  );
};

export default KPITrackerPage;
