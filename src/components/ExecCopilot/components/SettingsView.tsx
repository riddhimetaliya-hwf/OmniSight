
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExecutiveThemeProvider } from './ThemeProvider';
import CopilotSettings from './CopilotSettings';

interface SettingsViewProps {
  onBackToDashboard: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBackToDashboard }) => {
  return (
    <ExecutiveThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Executive Copilot Settings</h1>
            <Button
              variant="outline"
              onClick={onBackToDashboard}
              className="gap-2"
            >
              Back to Dashboard
            </Button>
          </div>
          <CopilotSettings />
        </div>
      </div>
    </ExecutiveThemeProvider>
  );
};
