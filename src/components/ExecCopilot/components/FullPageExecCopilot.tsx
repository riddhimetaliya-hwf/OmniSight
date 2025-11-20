import React, { useState } from 'react';
import { useCopilotContext } from '../context/CopilotContext';
import { ExecutiveThemeProvider } from './ThemeProvider';
import ConversationFirstCopilot from './ConversationFirstCopilot';
import { SettingsView } from './SettingsView';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const FullPageExecCopilot: React.FC = () => {
  const { isLoading } = useCopilotContext();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ExecutiveThemeProvider>
      <div className="relative">
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-2xl h-[600px] overflow-y-auto">
            <SettingsView onBackToDashboard={() => setShowSettings(false)} />
          </DialogContent>
        </Dialog>
        <ConversationFirstCopilot />
      </div>
    </ExecutiveThemeProvider>
  );
};

export default FullPageExecCopilot;
