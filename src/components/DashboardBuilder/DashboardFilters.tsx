
import React, { useState } from "react";
import { DashboardFilters } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, RefreshCw, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DashboardFiltersProps {
  filters: DashboardFilters;
  onFilterChange: (filters: DashboardFilters) => void;
  onRefresh: () => void;
}

const DashboardFiltersComponent: React.FC<DashboardFiltersProps> = ({
  filters,
  onFilterChange,
  onRefresh
}) => {
  const [isBusinessUnitOpen, setIsBusinessUnitOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const handleTimeRangeChange = (value: string) => {
    onFilterChange({
      ...filters,
      timeRange: value as DashboardFilters['timeRange'],
      // Reset custom dates if not using custom range
      ...(value !== 'custom' && { startDate: undefined, endDate: undefined })
    });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    onFilterChange({
      ...filters,
      startDate: date
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    onFilterChange({
      ...filters,
      endDate: date
    });
  };

  const businessUnits = [
    "Americas", "EMEA", "APAC", "Global"
  ];

  const regions = [
    "North", "South", "East", "West", "Central", "Northeast", "Southeast", "Northwest", "Southwest"
  ];

  const toggleBusinessUnit = (unit: string) => {
    const currentUnits = filters.businessUnit || [];
    const newUnits = currentUnits.includes(unit)
      ? currentUnits.filter(u => u !== unit)
      : [...currentUnits, unit];
    
    onFilterChange({
      ...filters,
      businessUnit: newUnits
    });
  };

  const toggleRegion = (region: string) => {
    const currentRegions = filters.region || [];
    const newRegions = currentRegions.includes(region)
      ? currentRegions.filter(r => r !== region)
      : [...currentRegions, region];
    
    onFilterChange({
      ...filters,
      region: newRegions
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-36">
            <Select 
              value={filters.timeRange} 
              onValueChange={handleTimeRangeChange}
            >
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7d">Last 7 days</SelectItem>
                <SelectItem value="last30d">Last 30 days</SelectItem>
                <SelectItem value="last90d">Last 90 days</SelectItem>
                <SelectItem value="lastYear">Last year</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filters.timeRange === 'custom' && (
            <>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 text-xs justify-start text-left font-normal w-36"
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {filters.startDate ? (
                        format(filters.startDate, "PPP")
                      ) : (
                        <span>Pick start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 text-xs justify-start text-left font-normal w-36"
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {filters.endDate ? (
                        format(filters.endDate, "PPP")
                      ) : (
                        <span>Pick end date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.endDate}
                      onSelect={handleEndDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          <div>
            <Popover open={isBusinessUnitOpen} onOpenChange={setIsBusinessUnitOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 text-xs justify-start text-left font-normal"
                >
                  Business Unit
                  {filters.businessUnit && filters.businessUnit.length > 0 && (
                    <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-2">
                      {filters.businessUnit.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="start">
                <div className="space-y-2">
                  {businessUnits.map((unit) => (
                    <div key={unit} className="flex items-center">
                      <Button
                        variant="ghost"
                        className={cn(
                          "justify-start text-left font-normal w-full h-8",
                          filters.businessUnit?.includes(unit) && "bg-primary/10"
                        )}
                        onClick={() => toggleBusinessUnit(unit)}
                      >
                        {unit}
                        {filters.businessUnit?.includes(unit) && (
                          <X className="ml-auto h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Popover open={isRegionOpen} onOpenChange={setIsRegionOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 text-xs justify-start text-left font-normal"
                >
                  Region
                  {filters.region && filters.region.length > 0 && (
                    <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-2">
                      {filters.region.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="start">
                <div className="space-y-2">
                  {regions.map((region) => (
                    <div key={region} className="flex items-center">
                      <Button
                        variant="ghost"
                        className={cn(
                          "justify-start text-left font-normal w-full h-8",
                          filters.region?.includes(region) && "bg-primary/10"
                        )}
                        onClick={() => toggleRegion(region)}
                      >
                        {region}
                        {filters.region?.includes(region) && (
                          <X className="ml-auto h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            className="ml-auto h-9 w-9"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFiltersComponent;
