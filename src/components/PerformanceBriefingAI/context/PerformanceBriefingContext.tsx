
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  BriefingSettings, 
  InsightItem, 
  BriefingDeliveryMethod,
  PerformanceBriefingContextProps
} from '../types';
import { mockInsights } from '../mockData';

const defaultSettings: BriefingSettings = {
  role: 'CIO',
  timeframe: 'weekly',
  deliveryMethods: ['dashboard'],
  departments: ['IT', 'Operations', 'Customer Service'],
  categories: ['kpi', 'risk', 'opportunity', 'trend'],
  isScheduled: false
};

const PerformanceBriefingContext = createContext<PerformanceBriefingContextProps | undefined>(undefined);

export const usePerformanceBriefing = () => {
  const context = useContext(PerformanceBriefingContext);
  if (context === undefined) {
    throw new Error('usePerformanceBriefing must be used within a PerformanceBriefingProvider');
  }
  return context;
};

interface PerformanceBriefingProviderProps {
  children: ReactNode;
}

export const PerformanceBriefingProvider: React.FC<PerformanceBriefingProviderProps> = ({ children }) => {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [settings, setSettings] = useState<BriefingSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  const updateSettings = (newSettings: Partial<BriefingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const generateBriefing = async (options?: Partial<BriefingSettings>) => {
    setIsLoading(true);

    // In a real app, this would make an API call based on settings
    // For now, we'll simulate a delay and return mock data
    const appliedSettings = options ? { ...settings, ...options } : settings;
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter mock insights based on settings
      const filteredInsights = mockInsights.filter(insight => {
        return (
          appliedSettings.departments.includes(insight.department) &&
          appliedSettings.categories.includes(insight.category)
        );
      });
      
      setInsights(filteredInsights);
    } catch (error) {
      console.error('Error generating briefing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportBriefing = async (method: BriefingDeliveryMethod) => {
    setIsLoading(true);
    
    try {
      // Simulate export operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Briefing exported via ${method}`);
      
      // In a real app, this would handle PDF generation, email sending, etc.
    } catch (error) {
      console.error(`Error exporting briefing via ${method}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleBriefing = async (schedule: Partial<BriefingSettings>) => {
    setIsLoading(true);
    
    try {
      // Simulate scheduling operation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newSettings = { ...settings, ...schedule, isScheduled: true };
      setSettings(newSettings);
      
      console.log('Briefing scheduled:', newSettings);
    } catch (error) {
      console.error('Error scheduling briefing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelScheduledBriefing = async () => {
    setIsLoading(true);
    
    try {
      // Simulate cancellation operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSettings(prev => ({ ...prev, isScheduled: false }));
      
      console.log('Scheduled briefing cancelled');
    } catch (error) {
      console.error('Error cancelling scheduled briefing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: PerformanceBriefingContextProps = {
    insights,
    settings,
    isLoading,
    updateSettings,
    generateBriefing,
    exportBriefing,
    scheduleBriefing,
    cancelScheduledBriefing
  };

  return (
    <PerformanceBriefingContext.Provider value={value}>
      {children}
    </PerformanceBriefingContext.Provider>
  );
};
