
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  RefreshCw, 
  Plus, 
  Settings, 
  AlertTriangle,
  TrendingUp,
  Filter,
  Building,
  Globe,
  Users,
  MapPin,
  Tag,
  X
} from 'lucide-react';
import { Filters, FilterOptions } from '../types';

interface FloatingActionMenuProps {
  onRefresh: () => void;
  onQuickFilter: (alertLevel: string) => void;
  isLoading: boolean;
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  availableFilters: FilterOptions;
}

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  onRefresh,
  onQuickFilter,
  isLoading,
  filters,
  onFilterChange,
  availableFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const quickActions = [
    {
      icon: RefreshCw,
      label: 'Refresh',
      action: onRefresh,
      className: `${isLoading ? 'animate-spin' : ''}`,
      color: 'text-blue-600'
    },
    {
      icon: AlertTriangle,
      label: 'Critical Only',
      action: () => onFilterChange({ 
        ...filters,
        alertLevel: ['critical'] 
      }),
      className: 'text-red-600',
      color: 'text-red-600'
    },
    {
      icon: TrendingUp,
      label: 'High Priority',
      action: () => onFilterChange({ 
        ...filters,
        alertLevel: ['high', 'critical'] 
      }),
      className: 'text-amber-600',
      color: 'text-amber-600'
    },
    {
      icon: Filter,
      label: 'All Filters',
      action: () => setShowFilters(!showFilters),
      className: 'text-purple-600',
      color: 'text-purple-600'
    }
  ];

  const sourceFilters = [
    { key: 'business', label: 'Business', icon: Building, color: 'text-blue-600' },
    { key: 'regulatory', label: 'Regulatory', icon: Globe, color: 'text-purple-600' },
    { key: 'market', label: 'Market', icon: TrendingUp, color: 'text-green-600' },
    { key: 'social', label: 'Social', icon: Users, color: 'text-pink-600' }
  ];

  const handleSourceToggle = (source: string) => {
    const newSources = filters.sources.includes(source as any)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source as any];
    
    onFilterChange({ ...filters, sources: newSources });
  };

  const handleClearAllFilters = () => {
    onFilterChange({
      sources: ['business', 'regulatory', 'market', 'social'],
      industries: [],
      departments: [],
      geographies: [],
      topics: [],
      alertLevel: ['low', 'medium', 'high', 'critical'],
      relevanceThreshold: 0
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.sources.length < 4) count++;
    if (filters.alertLevel.length < 4) count++;
    if (filters.industries.length > 0) count++;
    if (filters.departments.length > 0) count++;
    if (filters.geographies.length > 0) count++;
    if (filters.topics.length > 0) count++;
    return count;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end space-y-3">
        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="w-80 bg-white/95 backdrop-blur-sm border border-slate-200/60 shadow-xl animate-fadeInUp">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-purple-600" />
                  Quick Filters
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Source Filters */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Sources
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {sourceFilters.map((source) => {
                    const Icon = source.icon;
                    const isSelected = filters.sources.includes(source.key as any);
                    return (
                      <Button
                        key={source.key}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSourceToggle(source.key)}
                        className={`justify-start text-xs h-8 ${
                          isSelected ? 'bg-blue-50 border-blue-200 text-blue-700' : ''
                        }`}
                      >
                        <Icon className={`h-3 w-3 mr-2 ${source.color}`} />
                        {source.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Alert Level Filters */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Priority Levels
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['critical', 'high', 'medium', 'low'].map((level) => {
                    const isSelected = filters.alertLevel.includes(level as any);
                    return (
                      <Badge
                        key={level}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer text-xs ${
                          isSelected 
                            ? level === 'critical' ? 'bg-red-100 text-red-700 border-red-200' :
                              level === 'high' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                              'bg-blue-100 text-blue-700 border-blue-200'
                            : 'hover:bg-slate-50'
                        }`}
                        onClick={() => {
                          const newLevels = isSelected
                            ? filters.alertLevel.filter(l => l !== level)
                            : [...filters.alertLevel, level as any];
                          onFilterChange({ ...filters, alertLevel: newLevels });
                        }}
                      >
                        {level}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Active Filters Summary */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Active Filters
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {getActiveFilterCount()}
                  </Badge>
                </div>
                
                {getActiveFilterCount() === 0 ? (
                  <p className="text-xs text-slate-500">No filters applied</p>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAllFilters}
                    className="w-full text-xs h-7"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Action Buttons */}
        {isExpanded && !showFilters && (
          <div className="flex flex-col space-y-2 animate-fadeInUp">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className={`floating-assistant-btn border-2 border-white/20 shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white hover:scale-105 transition-all duration-300 ${action.className}`}
                  title={action.label}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        )}

        {/* Main FAB */}
        <Button
          onClick={() => {
            if (showFilters) {
              setShowFilters(false);
            } else {
              setIsExpanded(!isExpanded);
            }
          }}
          className={`floating-assistant-btn w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 ${
            isExpanded || showFilters ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>

        {/* Filter Count Badge */}
        {getActiveFilterCount() > 0 && (
          <Badge 
            variant="default"
            className="absolute -top-2 -left-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
          >
            {getActiveFilterCount()}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default FloatingActionMenu;
