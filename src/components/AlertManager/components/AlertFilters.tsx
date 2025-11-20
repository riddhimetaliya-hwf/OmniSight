
import React from 'react';
import { useAlertContext } from '../context/AlertContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AlertSeverity, AlertStatus } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const timeRangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'all', label: 'All Time' },
];

const departmentOptions = [
  'all',
  'finance',
  'sales',
  'marketing',
  'operations',
  'hr',
  'it',
  'customer-service',
  'inventory',
];

const AlertFilters: React.FC = () => {
  const { filters, updateFilters } = useAlertContext();

  const handleSeverityToggle = (severity: AlertSeverity) => {
    const updatedSeverities = filters.severity.includes(severity)
      ? filters.severity.filter(s => s !== severity)
      : [...filters.severity, severity];
    updateFilters({ severity: updatedSeverities });
  };

  const handleStatusToggle = (status: AlertStatus) => {
    const updatedStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    updateFilters({ status: updatedStatuses });
  };

  const handleDepartmentChange = (department: string) => {
    updateFilters({ 
      departments: department === 'all' ? [] : [department]
    });
  };

  const handleTimeRangeChange = (timeRange: string) => {
    updateFilters({ 
      timeRange: timeRange as 'today' | 'yesterday' | 'last7days' | 'last30days' | 'all'
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value });
  };

  const handleClearFilters = () => {
    updateFilters({
      severity: ['low', 'medium', 'high'],
      status: ['new', 'acknowledged', 'snoozed', 'escalated'],
      departments: [],
      timeRange: 'all',
      search: '',
    });
  };

  const hasSeverityFilter = filters.severity.length < 3; // Less than all severities
  const hasStatusFilter = filters.status.length < 4; // Less than all statuses
  const hasDepartmentFilter = filters.departments.length > 0;
  const hasTimeFilter = filters.timeRange !== 'all';
  const hasSearchFilter = filters.search !== '';

  const hasAnyFilter = hasSeverityFilter || hasStatusFilter || hasDepartmentFilter || hasTimeFilter || hasSearchFilter;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <Select
            onValueChange={handleDepartmentChange}
            value={filters.departments[0] || 'all'}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departmentOptions.map(dept => (
                <SelectItem key={dept} value={dept}>
                  {dept.charAt(0).toUpperCase() + dept.slice(1).replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            onValueChange={handleTimeRangeChange}
            value={filters.timeRange}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium">Severity:</span>
        <Badge
          variant={filters.severity.includes('high') ? 'default' : 'outline'}
          className={`cursor-pointer ${filters.severity.includes('high') ? 'bg-red-500 hover:bg-red-600' : ''}`}
          onClick={() => handleSeverityToggle('high')}
        >
          High
        </Badge>
        <Badge
          variant={filters.severity.includes('medium') ? 'default' : 'outline'}
          className={`cursor-pointer ${filters.severity.includes('medium') ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
          onClick={() => handleSeverityToggle('medium')}
        >
          Medium
        </Badge>
        <Badge
          variant={filters.severity.includes('low') ? 'default' : 'outline'}
          className={`cursor-pointer ${filters.severity.includes('low') ? 'bg-green-500 hover:bg-green-600' : ''}`}
          onClick={() => handleSeverityToggle('low')}
        >
          Low
        </Badge>
        
        <span className="text-sm font-medium ml-4">Status:</span>
        <Badge
          variant={filters.status.includes('new') ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleStatusToggle('new')}
        >
          New
        </Badge>
        <Badge
          variant={filters.status.includes('acknowledged') ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleStatusToggle('acknowledged')}
        >
          Acknowledged
        </Badge>
        <Badge
          variant={filters.status.includes('snoozed') ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleStatusToggle('snoozed')}
        >
          Snoozed
        </Badge>
        <Badge
          variant={filters.status.includes('escalated') ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleStatusToggle('escalated')}
        >
          Escalated
        </Badge>
        
        {hasAnyFilter && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default AlertFilters;
