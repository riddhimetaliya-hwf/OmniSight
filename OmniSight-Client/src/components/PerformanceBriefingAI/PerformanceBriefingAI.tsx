
import React, { useEffect } from 'react';
import { PerformanceBriefingProvider } from './context/PerformanceBriefingContext';
import BriefingHeader from './components/BriefingHeader';
import InsightsList from './components/InsightsList';
import BriefingSettings from './components/BriefingSettings';
import VoiceCommandPanel from './components/VoiceCommandPanel';

const PerformanceBriefingAI: React.FC = () => {
  return (
    <PerformanceBriefingProvider>
      <div className="w-full space-y-6">
        <BriefingHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InsightsList />
          </div>
          
          <div className="space-y-6">
            <VoiceCommandPanel />
            <BriefingSettings />
          </div>
        </div>
      </div>
    </PerformanceBriefingProvider>
  );
};

export default PerformanceBriefingAI;
