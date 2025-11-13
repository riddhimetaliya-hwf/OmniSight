
import React, { createContext, useContext, ReactNode } from 'react';
import { useKPITracker } from '../useKPITracker';
import { KPI, KPIFiltersState } from '../types';

interface KPIContextType {
  kpis: KPI[];
  filteredKPIs: KPI[];
  filters: KPIFiltersState;
  updateFilters: (newFilters: Partial<KPIFiltersState>) => void;
  toggleFavoriteKPI: (kpiId: string) => void;
  addKPI: (kpi: Omit<KPI, 'id'>) => void;
  updateKPI: (updatedKPI: KPI) => void;
  deleteKPI: (kpiId: string) => void;
  isCreatingKPI: boolean;
  setIsCreatingKPI: (isCreating: boolean) => void;
  markAlertAsRead: (kpiId: string, alertId: string) => void;
}

const KPIContext = createContext<KPIContextType | undefined>(undefined);

export const useKPIContext = () => {
  const context = useContext(KPIContext);
  if (!context) {
    throw new Error('useKPIContext must be used within a KPIProvider');
  }
  return context;
};

interface KPIProviderProps {
  children: ReactNode;
}

export const KPIProvider: React.FC<KPIProviderProps> = ({ children }) => {
  const kpiTracker = useKPITracker();
  
  return (
    <KPIContext.Provider value={kpiTracker}>
      {children}
    </KPIContext.Provider>
  );
};
