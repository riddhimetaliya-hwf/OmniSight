
import React from 'react';
import { Check, Filter, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useKPIContext } from './context/KPIContext';
import { Department, BusinessUnit, TimeRange } from './types';

const departments: { value: Department; label: string }[] = [
  { value: 'all', label: 'All Departments' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'hr', label: 'HR' },
];

const businessUnits: { value: BusinessUnit; label: string }[] = [
  { value: 'global', label: 'Global' },
  { value: 'north-america', label: 'North America' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia-pacific', label: 'Asia Pacific' },
  { value: 'latin-america', label: 'Latin America' },
];

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: 'current', label: 'Current Period' },
  { value: 'previous', label: 'Previous Period' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'last12m', label: 'Last 12 Months' },
];

const KPIFilters: React.FC = () => {
  const { filters, updateFilters } = useKPIContext();

  const handleDepartmentChange = (department: Department) => {
    if (department === 'all') {
      updateFilters({ departments: ['all'] });
    } else {
      const newDepartments = filters.departments.includes('all')
        ? [department]
        : filters.departments.includes(department)
          ? filters.departments.filter(d => d !== department)
          : [...filters.departments, department];
      
      updateFilters({ 
        departments: newDepartments.length ? newDepartments : ['all'] 
      });
    }
  };

  const handleBusinessUnitChange = (businessUnit: BusinessUnit) => {
    const newBusinessUnits = filters.businessUnits.includes(businessUnit)
      ? filters.businessUnits.filter(bu => bu !== businessUnit)
      : [...filters.businessUnits, businessUnit];
    
    updateFilters({ 
      businessUnits: newBusinessUnits.length ? newBusinessUnits : ['global'] 
    });
  };

  const handleTimeRangeChange = (timeRange: TimeRange) => {
    updateFilters({ timeRange });
  };

  const toggleFavorites = () => {
    updateFilters({ showFavoritesOnly: !filters.showFavoritesOnly });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchQuery: e.target.value });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="w-full sm:w-auto">
        <Input
          placeholder="Search KPIs..."
          value={filters.searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:w-64"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Department
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {departments.map((dept) => (
              <DropdownMenuCheckboxItem
                key={dept.value}
                checked={filters.departments.includes(dept.value)}
                onCheckedChange={() => handleDepartmentChange(dept.value)}
              >
                {dept.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Business Unit
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter by Business Unit</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {businessUnits.map((bu) => (
              <DropdownMenuCheckboxItem
                key={bu.value}
                checked={filters.businessUnits.includes(bu.value)}
                onCheckedChange={() => handleBusinessUnitChange(bu.value)}
              >
                {bu.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Time Range
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Select Time Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {timeRanges.map((tr) => (
              <DropdownMenuCheckboxItem
                key={tr.value}
                checked={filters.timeRange === tr.value}
                onCheckedChange={() => handleTimeRangeChange(tr.value)}
              >
                {tr.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant={filters.showFavoritesOnly ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-1"
          onClick={toggleFavorites}
        >
          <Star className={`h-4 w-4 ${filters.showFavoritesOnly ? "fill-yellow-400 text-yellow-400" : ""}`} />
          <span className="hidden sm:inline">Favorites</span>
        </Button>
      </div>
    </div>
  );
};

export default KPIFilters;
