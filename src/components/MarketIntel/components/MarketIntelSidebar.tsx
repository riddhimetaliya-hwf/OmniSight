
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  AlertTriangle, 
  Bookmark, 
  TrendingUp,
  Globe,
  Building,
  MapPin,
  Tag
} from 'lucide-react';
import { FilterOptions, Filters } from '../types';

interface MarketIntelSidebarProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  availableFilters: FilterOptions;
  collapsed: boolean;
  onToggleCollapse: () => void;
  highAlertCount: number;
  savedItemsCount: number;
}

export const MarketIntelSidebar: React.FC<MarketIntelSidebarProps> = ({
  filters,
  onFilterChange,
  availableFilters,
  collapsed,
  onToggleCollapse,
  highAlertCount,
  savedItemsCount
}) => {
  const quickFilters = [
    { 
      label: 'Critical Only', 
      action: () => onFilterChange({ alertLevel: ['critical'] }),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    },
    { 
      label: 'High Priority', 
      action: () => onFilterChange({ alertLevel: ['high', 'critical'] }),
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200'
    },
    { 
      label: 'Business News', 
      action: () => onFilterChange({ sources: ['business'] }),
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    { 
      label: 'Regulatory', 
      action: () => onFilterChange({ sources: ['regulatory'] }),
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200'
    }
  ];

  const getActiveFilterCount = () => {
    if (!filters) return 0;
    
    let count = 0;
    if (filters.sources && filters.sources.length > 0) count += filters.sources.length;
    if (filters.alertLevel && filters.alertLevel.length > 0) count += filters.alertLevel.length;
    if (filters.industries && filters.industries.length > 0) count += filters.industries.length;
    if (filters.departments && filters.departments.length > 0) count += filters.departments.length;
    if (filters.geographies && filters.geographies.length > 0) count += filters.geographies.length;
    if (filters.topics && filters.topics.length > 0) count += filters.topics.length;
    
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`transition-all duration-300 border-r border-slate-200/60 executive-glass-card ${
      collapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-slate-200/60">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-full justify-center hover:bg-slate-100"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!collapsed && (
        <>
          {/* Quick Stats */}
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-slate-800 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Quick Filters
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3 text-center border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-lg font-bold text-amber-700">{highAlertCount}</div>
                <div className="text-xs text-amber-600">High Alerts</div>
              </Card>
              <Card className="p-3 text-center border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-lg font-bold text-blue-700">{savedItemsCount}</div>
                <div className="text-xs text-blue-600">Saved Items</div>
              </Card>
            </div>
          </div>

          <Separator className="mx-4" />

          {/* Quick Filter Actions */}
          <div className="p-4 space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Quick Actions
            </h4>
            <div className="space-y-2">
              {quickFilters.map((filter, index) => {
                const Icon = filter.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={filter.action}
                    className={`w-full justify-start p-3 h-auto ${filter.bgColor} hover:scale-102 transition-all duration-200`}
                  >
                    <Icon className={`h-4 w-4 mr-3 ${filter.color}`} />
                    <span className={`text-sm font-medium ${filter.color}`}>
                      {filter.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator className="mx-4" />

          {/* Active Filters Summary */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Active Filters
              </h4>
              {activeFilterCount > 0 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
            
            {activeFilterCount === 0 ? (
              <p className="text-sm text-slate-500 italic">No filters applied</p>
            ) : (
              <div className="space-y-2">
                {filters.sources && filters.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <div className="text-xs text-slate-600 w-full mb-1">Sources:</div>
                    {filters.sources.map(source => (
                      <Badge key={source} variant="outline" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {filters.alertLevel && filters.alertLevel.length > 0 && filters.alertLevel.length < 4 && (
                  <div className="flex flex-wrap gap-1">
                    <div className="text-xs text-slate-600 w-full mb-1">Alert Levels:</div>
                    {filters.alertLevel.map(level => (
                      <Badge key={level} variant="outline" className="text-xs">
                        {level}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterChange({
                    sources: ['business', 'regulatory', 'market', 'social'],
                    industries: [],
                    departments: [],
                    geographies: [],
                    topics: [],
                    alertLevel: ['low', 'medium', 'high', 'critical'],
                    relevanceThreshold: 0
                  })}
                  className="w-full text-xs mt-2"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MarketIntelSidebar;
