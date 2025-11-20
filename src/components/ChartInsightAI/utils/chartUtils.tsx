
import React from 'react';
import { ChartDataset } from '../types';
import { 
  ChartBarIcon, 
  ChartLine, 
  ChartPie, 
  BarChart, 
  TrendingUp
} from 'lucide-react';

export const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
  '#ec4899', '#ef4444', '#84cc16'
];

export const getChartIcon = (type: ChartDataset['type']) => {
  switch (type) {
    case 'bar': return <BarChart className="h-5 w-5" />;
    case 'line': return <ChartLine className="h-5 w-5" />;
    case 'pie': return <ChartPie className="h-5 w-5" />;
    case 'area': return <TrendingUp className="h-5 w-5" />;
    default: return <ChartBarIcon className="h-5 w-5" />;
  }
};
