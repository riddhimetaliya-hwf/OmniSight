
import React, { useState } from 'react';
import { OmniCommandProvider } from './context/OmniCommandContext';
import CommandHeader from './components/CommandHeader';
import KPIWidgetsGrid from './components/KPIWidgetsGrid';
import SnapshotCardsGrid from './components/SnapshotCardsGrid';
import AlertsPanel from './components/AlertsPanel';
import RoleSwitcher from './components/RoleSwitcher';
import { mockKPIWidgets } from './data/mockData';

const OmniCommand: React.FC = () => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  return (
    <OmniCommandProvider>
      <div className="w-full max-w-[1400px] mx-auto p-4 space-y-6">
        <CommandHeader 
          isCustomizing={isCustomizing} 
          setIsCustomizing={setIsCustomizing} 
        />
        
        {isCustomizing && (
          <div className="bg-muted/30 rounded-omni p-4 mb-4">
            <RoleSwitcher />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <KPIWidgetsGrid kpiWidgets={mockKPIWidgets} />
            <SnapshotCardsGrid />
          </div>
          
          <div className="space-y-6">
            <AlertsPanel />
          </div>
        </div>
      </div>
    </OmniCommandProvider>
  );
};

export default OmniCommand;
