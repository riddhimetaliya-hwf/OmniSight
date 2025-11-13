import React, { useState } from 'react';
import { SystemNodeType, EdgeType, SystemMapFilter } from '../types';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X, Filter, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EnhancedFilterPanelProps {
  filters: SystemMapFilter;
  onFilterChange: (filters: SystemMapFilter) => void;
  onReset: () => void;
}

const EnhancedFilterPanel: React.FC<EnhancedFilterPanelProps> = ({ 
  filters, 
  onFilterChange, 
  onReset 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const systemTypes: { value: SystemNodeType; label: string; color: string }[] = [
    { value: 'erp', label: 'ERP', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { value: 'crm', label: 'CRM', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { value: 'hr', label: 'HR', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
    { value: 'marketing', label: 'Marketing', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
    { value: 'finance', label: 'Finance', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { value: 'operations', label: 'Operations', color: 'bg-pink-100 text-pink-800 hover:bg-pink-200' },
    { value: 'custom', label: 'Custom', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
  ];

  const departments = [
    { value: 'sales', label: 'Sales', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { value: 'marketing', label: 'Marketing', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
    { value: 'finance', label: 'Finance', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { value: 'operations', label: 'Operations', color: 'bg-pink-100 text-pink-800 hover:bg-pink-200' },
    { value: 'hr', label: 'HR', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
    { value: 'it', label: 'IT', color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
  ];

  const dataFlowTypes: { value: EdgeType; label: string; color: string }[] = [
    { value: 'data-flow', label: 'Data Flow', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { value: 'integration', label: 'Integration', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { value: 'dependency', label: 'Dependency', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { value: 'bidirectional', label: 'Bidirectional', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
  ];

  const statusTypes = [
    { value: 'healthy', label: 'Healthy', color: 'bg-green-100 text-green-800' },
    { value: 'warning', label: 'Warning', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'error', label: 'Error', color: 'bg-red-100 text-red-800' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-blue-100 text-blue-800' },
    { value: 'offline', label: 'Offline', color: 'bg-gray-100 text-gray-800' },
  ];

  const commonTags = ['critical', 'legacy', 'cloud', 'on-premise', 'customer-facing', 'internal', 'compliance'];
  const commonOwners = ['John Smith', 'Mike Chen', 'Lisa Wang', 'David Kim', 'Robert Brown', 'Maria Garcia'];

  const toggleSystemType = (type: SystemNodeType) => {
    const updatedSystems = filters.systems?.includes(type)
      ? filters.systems.filter(t => t !== type)
      : [...(filters.systems || []), type];
    
    onFilterChange({
      ...filters,
      systems: updatedSystems
    });
  };

  const toggleDepartment = (dept: string) => {
    const updatedDepartments = filters.departments?.includes(dept)
      ? filters.departments.filter(d => d !== dept)
      : [...(filters.departments || []), dept];
    
    onFilterChange({
      ...filters,
      departments: updatedDepartments
    });
  };

  const toggleDataFlow = (type: EdgeType) => {
    const updatedDataFlows = filters.dataFlows?.includes(type)
      ? filters.dataFlows.filter(t => t !== type)
      : [...(filters.dataFlows || []), type];
    
    onFilterChange({
      ...filters,
      dataFlows: updatedDataFlows
    });
  };

  const toggleStatus = (status: string) => {
    const updatedStatus = filters.status?.includes(status as any)
      ? filters.status.filter(s => s !== status)
      : [...(filters.status || []), status as any];
    
    onFilterChange({
      ...filters,
      status: updatedStatus
    });
  };

  const toggleTag = (tag: string) => {
    const updatedTags = filters.tags?.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...(filters.tags || []), tag];
    
    onFilterChange({
      ...filters,
      tags: updatedTags
    });
  };

  const toggleOwner = (owner: string) => {
    const updatedOwners = filters.owners?.includes(owner)
      ? filters.owners.filter(o => o !== owner)
      : [...(filters.owners || []), owner];
    
    onFilterChange({
      ...filters,
      owners: updatedOwners
    });
  };

  const updateHealthScore = (range: [number, number]) => {
    onFilterChange({
      ...filters,
      healthScore: { min: range[0], max: range[1] }
    });
  };

  const updateDateRange = (start: Date | undefined, end: Date | undefined) => {
    onFilterChange({
      ...filters,
      dateRange: start && end ? {
        start: start.toISOString(),
        end: end.toISOString()
      } : undefined
    });
  };

  const hasActiveFilters = () => {
    return (
      (filters.systems && filters.systems.length > 0) ||
      (filters.departments && filters.departments.length > 0) ||
      (filters.dataFlows && filters.dataFlows.length > 0) ||
      (filters.status && filters.status.length > 0) ||
      (filters.tags && filters.tags.length > 0) ||
      (filters.owners && filters.owners.length > 0) ||
      filters.healthScore ||
      filters.dateRange
    );
  };

  const activeFilterCount = [
    filters.systems?.length || 0,
    filters.departments?.length || 0,
    filters.dataFlows?.length || 0,
    filters.status?.length || 0,
    filters.tags?.length || 0,
    filters.owners?.length || 0,
    filters.healthScore ? 1 : 0,
    filters.dateRange ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-sm font-semibold hover:text-primary"
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
        </button>
        {hasActiveFilters() && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount} active
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-6 text-xs"
            >
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="space-y-4">
          {/* System Types */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">System Types</Label>
            <div className="flex flex-wrap gap-1.5">
              {systemTypes.map((type) => (
                <Badge
                  key={type.value}
                  variant="outline"
                  className={`cursor-pointer ${type.color} ${
                    filters.systems?.includes(type.value) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => toggleSystemType(type.value)}
                >
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Departments */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Departments</Label>
            <div className="flex flex-wrap gap-1.5">
              {departments.map((dept) => (
                <Badge
                  key={dept.value}
                  variant="outline"
                  className={`cursor-pointer ${dept.color} ${
                    filters.departments?.includes(dept.value) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => toggleDepartment(dept.value)}
                >
                  {dept.label}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Data Flow Types */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Data Flow Types</Label>
            <div className="flex flex-wrap gap-1.5">
              {dataFlowTypes.map((type) => (
                <Badge
                  key={type.value}
                  variant="outline"
                  className={`cursor-pointer ${type.color} ${
                    filters.dataFlows?.includes(type.value) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => toggleDataFlow(type.value)}
                >
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Status */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">System Status</Label>
            <div className="flex flex-wrap gap-1.5">
              {statusTypes.map((status) => (
                <Badge
                  key={status.value}
                  variant="outline"
                  className={`cursor-pointer ${status.color} ${
                    filters.status?.includes(status.value as any) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => toggleStatus(status.value)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Health Score Range */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">
              Health Score: {filters.healthScore?.min || 0} - {filters.healthScore?.max || 100}
            </Label>
            <Slider
              value={[filters.healthScore?.min || 0, filters.healthScore?.max || 100]}
              onValueChange={updateHealthScore}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Tags</Label>
            <div className="flex flex-wrap gap-1.5">
              {commonTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`cursor-pointer ${
                    filters.tags?.includes(tag) ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Owners */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Owners</Label>
            <div className="flex flex-wrap gap-1.5">
              {commonOwners.map((owner) => (
                <Badge
                  key={owner}
                  variant="outline"
                  className={`cursor-pointer ${
                    filters.owners?.includes(owner) ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                  onClick={() => toggleOwner(owner)}
                >
                  {owner}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Date Range</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateRange?.start && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.start ? format(new Date(filters.dateRange.start), "PPP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange?.start ? new Date(filters.dateRange.start) : undefined}
                    onSelect={(date) => updateDateRange(date, filters.dateRange?.end ? new Date(filters.dateRange.end) : undefined)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateRange?.end && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.end ? format(new Date(filters.dateRange.end), "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange?.end ? new Date(filters.dateRange.end) : undefined}
                    onSelect={(date) => updateDateRange(filters.dateRange?.start ? new Date(filters.dateRange.start) : undefined, date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFilterPanel; 