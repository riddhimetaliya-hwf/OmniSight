
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { KPI, KPIFiltersState, Department, BusinessUnit, TimeRange, KPIStatus, KPITimeframe } from './types';

// Sample KPI data
const initialKPIs: KPI[] = [
  {
    id: uuidv4(),
    name: 'Quarterly Revenue',
    description: 'Total revenue generated in the current quarter',
    department: 'sales',
    businessUnit: 'north-america',
    timeframe: 'quarterly',
    target: 1000000,
    actual: 850000,
    unit: 'currency',
    prefix: '$',
    formatDecimals: 0,
    previousPeriod: 720000,
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 2, 31),
    status: 'on-track',
    trend: 'up',
    commentary: 'You are on track to meet your quarterly revenue target. Current pace indicates you may exceed it by 2%.',
    favorite: true,
  },
  {
    id: uuidv4(),
    name: 'Customer Acquisition Cost',
    description: 'Average cost to acquire a new customer',
    department: 'marketing',
    businessUnit: 'global',
    timeframe: 'monthly',
    target: 150,
    actual: 175,
    unit: 'currency',
    prefix: '$',
    formatDecimals: 0,
    previousPeriod: 185,
    startDate: new Date(2023, 3, 1),
    endDate: new Date(2023, 3, 30),
    status: 'at-risk',
    trend: 'down',
    commentary: 'CAC is above target but trending downward from previous month. Continue optimizing ad spend.',
    alerts: [{
      id: uuidv4(),
      kpiId: '2',
      message: 'CAC increased by 15% from target',
      severity: 'medium',
      timestamp: new Date(),
      read: false,
    }],
  },
  {
    id: uuidv4(),
    name: 'Conversion Rate',
    description: 'Percentage of leads that convert to customers',
    department: 'marketing',
    businessUnit: 'europe',
    timeframe: 'monthly',
    target: 3.5,
    actual: 4.2,
    unit: 'percentage',
    formatDecimals: 1,
    previousPeriod: 3.2,
    startDate: new Date(2023, 3, 1),
    endDate: new Date(2023, 3, 30),
    status: 'exceeded',
    trend: 'up',
    commentary: 'Excellent performance! Conversion rate has exceeded target by 20%. Recent email campaign improvements have contributed significantly.',
    favorite: true,
  },
  {
    id: uuidv4(),
    name: 'Employee Retention',
    description: 'Percentage of employees retained over the period',
    department: 'hr',
    businessUnit: 'global',
    timeframe: 'annual',
    target: 92,
    actual: 88,
    unit: 'percentage',
    formatDecimals: 0,
    previousPeriod: 90,
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 11, 31),
    status: 'behind',
    trend: 'down',
    commentary: 'Retention is 4% below target and declining. Consider implementing the recommended engagement initiatives.',
    alerts: [{
      id: uuidv4(),
      kpiId: '4',
      message: 'Retention rate has fallen below critical threshold',
      severity: 'high',
      timestamp: new Date(),
      read: false,
    }],
  },
  {
    id: uuidv4(),
    name: 'Profit Margin',
    description: 'Net profit as a percentage of revenue',
    department: 'finance',
    businessUnit: 'global',
    timeframe: 'quarterly',
    target: 15,
    actual: 14.2,
    unit: 'percentage',
    formatDecimals: 1,
    previousPeriod: 13.8,
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 2, 31),
    status: 'on-track',
    trend: 'up',
    commentary: 'Profit margin is slightly below target but showing positive trend. Continue cost optimization efforts.',
  }
];

// Initial filter state
const initialFilters: KPIFiltersState = {
  departments: ['all'],
  businessUnits: ['global'],
  timeRange: 'current',
  showFavoritesOnly: false,
  searchQuery: '',
};

export const useKPITracker = () => {
  const [kpis, setKpis] = useState<KPI[]>(initialKPIs);
  const [filters, setFilters] = useState<KPIFiltersState>(initialFilters);
  const [isCreatingKPI, setIsCreatingKPI] = useState(false);

  const filteredKPIs = kpis.filter(kpi => {
    // Filter by department
    if (filters.departments.includes('all')) {
      // "all" is selected, so include all departments
    } else if (!filters.departments.includes(kpi.department)) {
      return false;
    }

    // Filter by business unit
    if (!filters.businessUnits.includes(kpi.businessUnit) && !filters.businessUnits.includes('global')) {
      return false;
    }

    // Filter by favorites
    if (filters.showFavoritesOnly && !kpi.favorite) {
      return false;
    }

    // Filter by search query
    if (filters.searchQuery && !kpi.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const updateFilters = (newFilters: Partial<KPIFiltersState>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  const toggleFavoriteKPI = (kpiId: string) => {
    setKpis(prevKpis => 
      prevKpis.map(kpi => 
        kpi.id === kpiId ? { ...kpi, favorite: !kpi.favorite } : kpi
      )
    );
  };

  const addKPI = (kpi: Omit<KPI, 'id'>) => {
    const newKPI: KPI = {
      ...kpi,
      id: uuidv4(),
      status: calculateStatus(kpi.actual, kpi.target),
      trend: kpi.previousPeriod 
        ? kpi.actual > kpi.previousPeriod ? 'up' : kpi.actual < kpi.previousPeriod ? 'down' : 'flat'
        : 'flat'
    };
    setKpis(prevKpis => [...prevKpis, newKPI]);
  };

  const updateKPI = (updatedKPI: KPI) => {
    setKpis(prevKpis => 
      prevKpis.map(kpi => 
        kpi.id === updatedKPI.id ? updatedKPI : kpi
      )
    );
  };

  const deleteKPI = (kpiId: string) => {
    setKpis(prevKpis => prevKpis.filter(kpi => kpi.id !== kpiId));
  };

  const calculateStatus = (actual: number, target: number): KPIStatus => {
    const ratio = actual / target;
    
    if (ratio >= 1) return 'exceeded';
    if (ratio >= 0.9) return 'on-track';
    if (ratio >= 0.8) return 'at-risk';
    return 'behind';
  };

  const markAlertAsRead = (kpiId: string, alertId: string) => {
    setKpis(prevKpis => 
      prevKpis.map(kpi => {
        if (kpi.id === kpiId && kpi.alerts) {
          return {
            ...kpi,
            alerts: kpi.alerts.map(alert => 
              alert.id === alertId ? { ...alert, read: true } : alert
            )
          };
        }
        return kpi;
      })
    );
  };

  return {
    kpis,
    filteredKPIs,
    filters,
    updateFilters,
    toggleFavoriteKPI,
    addKPI,
    updateKPI,
    deleteKPI,
    isCreatingKPI,
    setIsCreatingKPI,
    markAlertAsRead
  };
};
