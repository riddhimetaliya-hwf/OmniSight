
import React, { createContext, useContext, useState } from 'react';

interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'flat';
  category: string;
  period: string;
}

interface KPITrackerContextProps {
  kpis: KPI[];
  loading: boolean;
  error: string | null;
  addKPI: (kpi: Omit<KPI, 'id'>) => void;
  updateKPI: (id: string, data: Partial<KPI>) => void;
  deleteKPI: (id: string) => void;
  refreshData: () => void;
}

const KPITrackerContext = createContext<KPITrackerContextProps | undefined>(undefined);

// Mock data for initial state
const mockKPIs: KPI[] = [
  {
    id: '1',
    name: 'Revenue',
    value: 2500000,
    target: 3000000,
    trend: 'up',
    category: 'financial',
    period: 'Q2 2023',
  },
  {
    id: '2',
    name: 'Customer Satisfaction',
    value: 87,
    target: 90,
    trend: 'up',
    category: 'customer',
    period: 'Q2 2023',
  },
  {
    id: '3',
    name: 'Employee Turnover',
    value: 12,
    target: 10,
    trend: 'down',
    category: 'hr',
    period: 'Q2 2023',
  },
];

export const KPITrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kpis, setKPIs] = useState<KPI[]>(mockKPIs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addKPI = (kpi: Omit<KPI, 'id'>) => {
    const newKPI = {
      ...kpi,
      id: Math.random().toString(36).substring(2, 9),
    };
    setKPIs([...kpis, newKPI]);
  };

  const updateKPI = (id: string, data: Partial<KPI>) => {
    setKPIs(
      kpis.map((kpi) => (kpi.id === id ? { ...kpi, ...data } : kpi))
    );
  };

  const deleteKPI = (id: string) => {
    setKPIs(kpis.filter((kpi) => kpi.id !== id));
  };

  const refreshData = () => {
    setLoading(true);
    // Simulate data fetch
    setTimeout(() => {
      setKPIs(mockKPIs);
      setLoading(false);
    }, 1000);
  };

  return (
    <KPITrackerContext.Provider
      value={{
        kpis,
        loading,
        error,
        addKPI,
        updateKPI,
        deleteKPI,
        refreshData,
      }}
    >
      {children}
    </KPITrackerContext.Provider>
  );
};

export const useKPITracker = () => {
  const context = useContext(KPITrackerContext);
  if (context === undefined) {
    throw new Error('useKPITracker must be used within a KPITrackerProvider');
  }
  return context;
};
