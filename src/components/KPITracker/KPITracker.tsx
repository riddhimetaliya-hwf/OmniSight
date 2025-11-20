
import React from 'react';
import { KPIProvider } from './context/KPIContext';
import KPIHeader from './KPIHeader';
import KPIFilters from './KPIFilters';
import KPIGrid from './KPIGrid';
import CreateKPIModal from './CreateKPIModal';

const KPITracker: React.FC = () => {
  return (
    <KPIProvider>
      <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
        <KPIHeader />
        <KPIFilters />
        <KPIGrid />
        <CreateKPIModal />
      </div>
    </KPIProvider>
  );
};

export default KPITracker;
