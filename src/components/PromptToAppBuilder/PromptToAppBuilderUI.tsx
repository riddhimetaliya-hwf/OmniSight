
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import PromptInput from './components/PromptInput';
import AppPreview from './components/AppPreview';
import PromptSuggestions from './components/PromptSuggestions';
import { useAppGenerator } from './hooks/useAppGenerator';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import { PromptToAppProvider } from './context/PromptToAppContext';
import { useGuide } from '@/components/OmniGuide';
import { TourButton } from '@/components/OmniGuide';
import CodeView from './components/CodeView';
import { usePromptToApp } from './context/PromptToAppContext';

const PromptToAppBuilderUI: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [moduleTours, setModuleTours] = useState<any[]>([]);
  const [startTour, setStartTour] = useState<(id: string) => void>(() => () => {});
  
  // Try to use the guide hook safely
  useEffect(() => {
    try {
      // This will safely attempt to get tour information if the provider is available
      const { startTour: tourStarter, moduleTours: tours } = useGuide({
        moduleName: 'appbuilder',
        autoStart: false
      });
      
      if (tours && tours.length > 0) {
        setModuleTours(tours);
        setStartTour(() => tourStarter);
      }
    } catch (error) {
      console.log('OmniGuide not available, skipping tour functionality');
    }
  }, []);

  return (
    <PromptToAppProvider>
      <div className="flex h-full overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r flex flex-col bg-card`}
        >
          <div className="p-4 flex-grow overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">App Builder</h2>
              {moduleTours.length > 0 && (
                <TourButton
                  tourId={moduleTours[0]?.id || "appbuilder-tour"}
                  size="sm"
                  variant="ghost"
                  onStartTour={startTour}
                />
              )}
            </div>
            <PromptInput onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isOpen={sidebarOpen} />
            <div className="mt-4">
              <PromptSuggestions />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4 overflow-y-auto">
          <AppContent />
        </div>
      </div>
    </PromptToAppProvider>
  );
};

const AppContent: React.FC = () => {
  const { generatedApp, isProcessing, error } = useAppGenerator();
  const { showCode } = usePromptToApp();

  if (isProcessing) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium text-red-500">Error</h3>
        <p className="mt-2 text-muted-foreground">{error}</p>
      </Card>
    );
  }

  if (!generatedApp) {
    return <EmptyState />;
  }

  return showCode ? 
    <CodeView app={generatedApp} /> : 
    <AppPreview app={generatedApp} />;
};

export default PromptToAppBuilderUI;
