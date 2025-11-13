
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CommandCenterSettings, ExecutiveRole, OmniCommandContextProps, PinnedItem, Snapshot } from '../types';
import { useCopilotContext } from '../../ExecCopilot/context/CopilotContext';
import { mockSnapshots } from '../data/mockData';
import { KPI } from '../../KPITracker/types';
import { Alert } from '../../AlertManager/types';

// Sample KPIs for different executive roles
const getRoleKPIs = (role: ExecutiveRole): KPI[] => {
  // In a real app, this would fetch from an API based on the role
  // For now, we'll return the same mock data
  return [];
};

const defaultSettings: CommandCenterSettings = {
  role: 'CEO',
  darkMode: false,
  pinnedItems: [],
  showAlerts: true,
  showRecommendations: true,
  showInsights: true
};

const OmniCommandContext = createContext<OmniCommandContextProps | undefined>(undefined);

export const useOmniCommand = () => {
  const context = useContext(OmniCommandContext);
  if (!context) {
    throw new Error('useOmniCommand must be used within an OmniCommandProvider');
  }
  return context;
};

interface OmniCommandProviderProps {
  children: ReactNode;
}

export const OmniCommandProvider: React.FC<OmniCommandProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<CommandCenterSettings>(defaultSettings);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>(mockSnapshots);
  
  const { insights, recommendations } = useCopilotContext();

  useEffect(() => {
    // Load KPIs based on the selected role
    const roleKPIs = getRoleKPIs(settings.role);
    setKpis(roleKPIs);
    
    // Load user settings from localStorage
    const savedSettings = localStorage.getItem('omniCommandSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Failed to parse saved settings', error);
      }
    }
  }, [settings.role]);

  const updateSettings = (newSettings: Partial<CommandCenterSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Save to localStorage
    localStorage.setItem('omniCommandSettings', JSON.stringify(updatedSettings));
  };

  const togglePinItem = (item: PinnedItem) => {
    const existingPinIndex = settings.pinnedItems.findIndex(pin => 
      pin.id === item.id && pin.type === item.type
    );
    
    let newPinnedItems: PinnedItem[];
    
    if (existingPinIndex >= 0) {
      // Remove the item if it's already pinned
      newPinnedItems = settings.pinnedItems.filter((_, index) => index !== existingPinIndex);
    } else {
      // Add the item if it's not pinned
      newPinnedItems = [...settings.pinnedItems, item];
    }
    
    updateSettings({ pinnedItems: newPinnedItems });
  };

  const switchRole = (role: ExecutiveRole) => {
    updateSettings({ role });
  };
  
  const value: OmniCommandContextProps = {
    settings,
    kpis,
    alerts,
    recommendations,
    insights,
    snapshots,
    updateSettings,
    togglePinItem,
    switchRole
  };

  return (
    <OmniCommandContext.Provider value={value}>
      {children}
    </OmniCommandContext.Provider>
  );
};
