
import React from 'react';
import { SystemNodeType, EdgeType, SystemMapFilter } from './types';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';

interface FilterPanelProps {
  filters: SystemMapFilter;
  onFilterChange: (filters: SystemMapFilter) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onReset }) => {
  const systemTypes: { value: SystemNodeType; label: string; color: string }[] = [
    { value: 'erp', label: 'ERP', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { value: 'crm', label: 'CRM', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { value: 'hr', label: 'HR', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
    { value: 'marketing', label: 'Marketing', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
    { value: 'finance', label: 'Finance', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { value: 'operations', label: 'Operations', color: 'bg-pink-100 text-pink-800 hover:bg-pink-200' },
  ];

  const departments = [
    { value: 'sales', label: 'Sales', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { value: 'marketing', label: 'Marketing', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
    { value: 'finance', label: 'Finance', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { value: 'operations', label: 'Operations', color: 'bg-pink-100 text-pink-800 hover:bg-pink-200' },
    { value: 'hr', label: 'HR', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
  ];

  const dataFlowTypes: { value: EdgeType; label: string; color: string }[] = [
    { value: 'data-flow', label: 'Data Flow', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { value: 'integration', label: 'Integration', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { value: 'dependency', label: 'Dependency', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { value: 'bidirectional', label: 'Bidirectional', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
  ];

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

  const hasActiveFilters = () => {
    return (
      (filters.systems && filters.systems.length > 0) ||
      (filters.departments && filters.departments.length > 0) ||
      (filters.dataFlows && filters.dataFlows.length > 0)
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center">
          <Filter className="h-4 w-4 mr-1.5" /> Filter Systems
        </h3>
        {hasActiveFilters() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 text-xs"
          >
            <X className="h-3 w-3 mr-1" /> Clear All
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <Label className="text-xs">System Types</Label>
        <div className="flex flex-wrap gap-1.5">
          {systemTypes.map((type) => (
            <Badge
              key={type.value}
              variant="outline"
              className={`cursor-pointer ${type.color} ${
                filters.systems?.includes(type.value) ? 'ring-1 ring-primary' : ''
              }`}
              onClick={() => toggleSystemType(type.value)}
            >
              {type.label}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-xs">Departments</Label>
        <div className="flex flex-wrap gap-1.5">
          {departments.map((dept) => (
            <Badge
              key={dept.value}
              variant="outline"
              className={`cursor-pointer ${dept.color} ${
                filters.departments?.includes(dept.value) ? 'ring-1 ring-primary' : ''
              }`}
              onClick={() => toggleDepartment(dept.value)}
            >
              {dept.label}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-xs">Data Flow Types</Label>
        <div className="flex flex-wrap gap-1.5">
          {dataFlowTypes.map((type) => (
            <Badge
              key={type.value}
              variant="outline"
              className={`cursor-pointer ${type.color} ${
                filters.dataFlows?.includes(type.value) ? 'ring-1 ring-primary' : ''
              }`}
              onClick={() => toggleDataFlow(type.value)}
            >
              {type.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
