
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Pin, 
  PinOff 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOmniCommand } from '../context/OmniCommandContext';
import { KPIWidget } from '../types';

interface KPIWidgetsGridProps {
  kpiWidgets: KPIWidget[];
}

const KPIWidgetsGrid: React.FC<KPIWidgetsGridProps> = ({ kpiWidgets }) => {
  const { settings, togglePinItem } = useOmniCommand();
  
  const getKPIIcon = (id: string) => {
    if (id.includes('sales') || id.includes('revenue')) {
      return <DollarSign className="h-4 w-4" />;
    } else if (id.includes('headcount')) {
      return <Users className="h-4 w-4" />;
    } else if (id.includes('risks')) {
      return <AlertTriangle className="h-4 w-4" />;
    } else {
      return <TrendingUp className="h-4 w-4" />;
    }
  };
  
  const isPinned = (id: string) => {
    return settings.pinnedItems.some(item => item.id === id && item.type === 'kpi');
  };
  
  const handleTogglePin = (kpi: KPIWidget) => {
    togglePinItem({
      id: kpi.id,
      type: 'kpi',
      position: {
        x: 0,
        y: 0,
        width: 1,
        height: 1
      }
    });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {kpiWidgets.map((kpi) => (
        <Card key={kpi.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {getKPIIcon(kpi.id)}
              {kpi.title}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => handleTogglePin(kpi)}
            >
              {isPinned(kpi.id) ? (
                <PinOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Pin className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline">
              <div className="text-2xl font-bold">{kpi.value}</div>
              <Badge 
                variant="outline" 
                className={`flex items-center gap-1 ${
                  kpi.trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}
              >
                {kpi.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {kpi.change}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress to target: {kpi.target}</span>
                <span>{kpi.progress}%</span>
              </div>
              <Progress value={kpi.progress} className="h-2" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {kpi.period}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPIWidgetsGrid;
