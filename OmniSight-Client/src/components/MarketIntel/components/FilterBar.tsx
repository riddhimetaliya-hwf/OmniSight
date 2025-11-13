
import React, { useState } from 'react';
import { FilterOptions, NewsSource, AlertLevel, FilterType } from '../types';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  RefreshCw
} from 'lucide-react';
import {
  FilterPopoverButton,
  FilterPopoverContent,
  AdvancedFiltersPopover
} from './FilterComponents';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onRefresh: () => void;
  availableFilters: {
    industries: string[];
    departments: string[];
    geographies: string[];
    topics: string[];
  };
  isLoading: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onRefresh,
  availableFilters,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [popoverOpen, setPopoverOpen] = useState<FilterType | null>(null);
  
  const handleSourceToggle = (source: NewsSource) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source];
    
    onFilterChange({ sources: newSources });
  };
  
  const handleAlertLevelToggle = (level: AlertLevel) => {
    if (!filters.alertLevel) return;
    
    const newLevels = filters.alertLevel.includes(level)
      ? filters.alertLevel.filter(l => l !== level)
      : [...filters.alertLevel, level];
    
    onFilterChange({ alertLevel: newLevels });
  };
  
  const handleFilterChange = (type: FilterType, value: string, isChecked: boolean) => {
    const filterArrayKey = type === 'industry' ? 'industries' :
                          type === 'department' ? 'departments' :
                          type === 'geography' ? 'geographies' :
                          'topics';
    
    const currentValues = filters[filterArrayKey] as string[];
    const newValues = isChecked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    onFilterChange({ [filterArrayKey]: newValues });
  };
  
  const handleRelevanceChange = (value: number[]) => {
    onFilterChange({ relevanceThreshold: value[0] });
  };
  
  const handleDateChange = (field: 'from' | 'to', date: Date | null) => {
    const currentDateRange = filters.dateRange || { from: null, to: null };
    onFilterChange({ 
      dateRange: { 
        ...currentDateRange, 
        [field]: date 
      } 
    });
  };
  
  const clearFilters = () => {
    onFilterChange({
      sources: ['business', 'regulatory', 'market', 'social'],
      industries: [],
      departments: [],
      geographies: [],
      topics: [],
      alertLevel: ['low', 'medium', 'high', 'critical'],
      dateRange: { from: null, to: null },
      relevanceThreshold: 0
    });
  };
  
  const handleClearDates = () => {
    onFilterChange({ dateRange: { from: null, to: null } });
  };
  
  const countActiveFilters = (): number => {
    let count = 0;
    
    if (filters.industries.length > 0) count++;
    if (filters.departments.length > 0) count++;
    if (filters.geographies.length > 0) count++;
    if (filters.topics.length > 0) count++;
    if (filters.sources.length < 4) count++;
    if (filters.alertLevel && filters.alertLevel.length < 4) count++;
    if (filters.dateRange && (filters.dateRange.from || filters.dateRange.to)) count++;
    if (filters.relevanceThreshold && filters.relevanceThreshold > 0) count++;
    
    return count;
  };
  
  const activeFiltersCount = countActiveFilters();
  
  // CategoryFilter component for each filter type
  const CategoryFilter = ({ 
    type, 
    title, 
    options 
  }: { 
    type: FilterType; 
    title: string; 
    options: string[]; 
  }) => {
    const filterKey = type === 'industry' ? 'industries' : 
                    type === 'department' ? 'departments' : 
                    type === 'geography' ? 'geographies' : 
                    'topics';
                    
    const selectedOptions = filters[filterKey] as string[];
    
    return (
      <Popover open={popoverOpen === type} onOpenChange={(open) => setPopoverOpen(open ? type : null)}>
        <PopoverTrigger asChild>
          <FilterPopoverButton
            type={type}
            title={title}
            count={selectedOptions.length}
            active={selectedOptions.length > 0}
            onClick={() => setPopoverOpen(popoverOpen === type ? null : type)}
          />
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <FilterPopoverContent 
            title={title}
            options={options}
            selectedOptions={selectedOptions}
            onOptionToggle={(option, checked) => handleFilterChange(type, option, checked)}
          />
        </PopoverContent>
      </Popover>
    );
  };
  
  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Input
            placeholder="Search intelligence feed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 pr-9"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 space-x-1"
            onClick={clearFilters}
            disabled={activeFiltersCount === 0}
          >
            <X className="h-3.5 w-3.5" />
            <span className="text-xs">Clear</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-9 space-x-1"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-xs">Refresh</span>
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={activeFiltersCount > 0 ? "default" : "outline"}
                size="sm"
                className="h-9 space-x-1"
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="text-xs">Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 bg-white/20">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <AdvancedFiltersPopover
                filters={filters}
                activeFiltersCount={activeFiltersCount}
                onSourceToggle={handleSourceToggle}
                onAlertLevelToggle={handleAlertLevelToggle}
                onRelevanceChange={handleRelevanceChange}
                onDateChange={handleDateChange}
                onClearDates={handleClearDates}
                onClearAllFilters={clearFilters}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <CategoryFilter 
          type="industry" 
          title="Industries" 
          options={availableFilters.industries} 
        />
        <CategoryFilter 
          type="department" 
          title="Departments" 
          options={availableFilters.departments} 
        />
        <CategoryFilter 
          type="geography" 
          title="Locations" 
          options={availableFilters.geographies} 
        />
        <CategoryFilter 
          type="topic" 
          title="Topics" 
          options={availableFilters.topics} 
        />
      </div>
    </div>
  );
};

export default FilterBar;
