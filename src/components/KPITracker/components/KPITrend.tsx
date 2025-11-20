
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPITrendProps {
  trend: 'up' | 'down' | 'flat';
  className?: string;
}

const KPITrend: React.FC<KPITrendProps> = ({ trend, className }) => {
  return (
    <span className={cn("inline-flex items-center", className)}>
      {trend === 'up' && (
        <TrendingUp className="h-4 w-4 text-green-500" />
      )}
      {trend === 'down' && (
        <TrendingDown className="h-4 w-4 text-red-500" />
      )}
      {trend === 'flat' && (
        <Minus className="h-4 w-4 text-gray-500" />
      )}
    </span>
  );
};

export default KPITrend;
