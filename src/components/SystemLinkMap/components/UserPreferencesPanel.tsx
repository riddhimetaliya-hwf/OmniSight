import React from 'react';
import { UserPreferences } from '../types';

interface UserPreferencesPanelProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  onClose: () => void;
}

const UserPreferencesPanel: React.FC<UserPreferencesPanelProps> = ({ 
  preferences, 
  onPreferencesChange, 
  onClose 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">User Preferences</h3>
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">
          Customize your experience
        </div>
        <div className="text-xs">
          Theme: {preferences.theme}
        </div>
        <div className="text-xs">
          Auto-refresh: {preferences.autoRefresh ? 'On' : 'Off'}
        </div>
      </div>
    </div>
  );
};

export default UserPreferencesPanel; 