
import React from 'react';
import Layout from '@/components/Layout/Layout';
import MarketIntelRealData from '@/components/MarketIntel/MarketIntelRealData';

const MarketIntelPage: React.FC = () => {
  return (
    <Layout title="Market Intelligence" subtitle="External Data Hub">
      <MarketIntelRealData />
    </Layout>
  );
};

export default MarketIntelPage;
