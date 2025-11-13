
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface FilterConfig {
  timeRange: string;
  startDate?: Date;
  endDate?: Date;
  regions: string[];
  segments: string[];
  customFilters: { field: string; value: string }[];
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterConfig) => void;
  initialFilters?: Partial<FilterConfig>;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  onFilterChange,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<FilterConfig>({
    timeRange: initialFilters.timeRange || "last30d",
    startDate: initialFilters.startDate,
    endDate: initialFilters.endDate,
    regions: initialFilters.regions || [],
    segments: initialFilters.segments || [],
    customFilters: initialFilters.customFilters || []
  });
  
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  const [newCustomField, setNewCustomField] = useState("");
  const [newCustomValue, setNewCustomValue] = useState("");
  
  const timeRangeOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last7d", label: "Last 7 days" },
    { value: "last30d", label: "Last 30 days" },
    { value: "last90d", label: "Last 90 days" },
    { value: "lastYear", label: "Last year" },
    { value: "ytd", label: "Year to date" },
    { value: "custom", label: "Custom range" }
  ];
  
  const regionOptions = [
    "North America", "Europe", "Asia Pacific", "South America", 
    "Middle East", "Africa", "Australia", "Global"
  ];
  
  const segmentOptions = [
    "Enterprise", "Mid-Market", "SMB", "New Customers", "Existing Customers",
    "High Value", "Low Value", "Inactive", "Active", "At Risk"
  ];
  
  const handleTimeRangeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      timeRange: value,
      // Reset custom dates if not using custom range
      ...(value !== 'custom' && { startDate: undefined, endDate: undefined })
    }));
  };
  
  const handleDateChange = (date: Date | undefined, isStart = true) => {
    setFilters(prev => ({
      ...prev,
      ...(isStart ? { startDate: date } : { endDate: date })
    }));
  };
  
  const toggleRegion = (region: string) => {
    setFilters(prev => {
      const newRegions = prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region];
      
      return { ...prev, regions: newRegions };
    });
  };
  
  const toggleSegment = (segment: string) => {
    setFilters(prev => {
      const newSegments = prev.segments.includes(segment)
        ? prev.segments.filter(s => s !== segment)
        : [...prev.segments, segment];
      
      return { ...prev, segments: newSegments };
    });
  };
  
  const addCustomFilter = () => {
    if (!newCustomField.trim() || !newCustomValue.trim()) return;
    
    setFilters(prev => ({
      ...prev,
      customFilters: [...prev.customFilters, { field: newCustomField, value: newCustomValue }]
    }));
    
    setNewCustomField("");
    setNewCustomValue("");
  };
  
  const removeCustomFilter = (index: number) => {
    setFilters(prev => ({
      ...prev,
      customFilters: prev.customFilters.filter((_, i) => i !== index)
    }));
  };
  
  const applyFilters = () => {
    onFilterChange(filters);
  };
  
  const resetFilters = () => {
    const defaultFilters: FilterConfig = {
      timeRange: "last30d",
      startDate: undefined,
      endDate: undefined,
      regions: [],
      segments: [],
      customFilters: []
    };
    
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Advanced Filters
        </CardTitle>
        <CardDescription>
          Filter your data by time, geography, segments and custom criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Time Range Section */}
          <div>
            <div 
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => setActiveFilterSection(prev => prev === 'timeRange' ? null : 'timeRange')}
            >
              <h3 className="text-sm font-medium">Time Range</h3>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                activeFilterSection === 'timeRange' && "transform rotate-180"
              )} />
            </div>
            
            {activeFilterSection === 'timeRange' && (
              <div className="p-2 border rounded-md space-y-3">
                <Select value={filters.timeRange} onValueChange={handleTimeRangeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRangeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {filters.timeRange === 'custom' && (
                  <div className="flex flex-wrap gap-3">
                    <div>
                      <Label className="text-xs mb-1 block">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[140px] justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.startDate ? (
                              format(filters.startDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.startDate}
                            onSelect={(date) => handleDateChange(date, true)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label className="text-xs mb-1 block">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[140px] justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.endDate ? (
                              format(filters.endDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.endDate}
                            onSelect={(date) => handleDateChange(date, false)}
                            initialFocus
                            disabled={(date) => 
                              filters.startDate ? date < filters.startDate : false
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Geographical Regions Section */}
          <div>
            <div 
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => setActiveFilterSection(prev => prev === 'regions' ? null : 'regions')}
            >
              <h3 className="text-sm font-medium">Geographical Regions</h3>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                activeFilterSection === 'regions' && "transform rotate-180"
              )} />
            </div>
            
            {activeFilterSection === 'regions' && (
              <div className="p-2 border rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  {regionOptions.map(region => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`region-${region}`} 
                        checked={filters.regions.includes(region)}
                        onCheckedChange={() => toggleRegion(region)}
                      />
                      <Label htmlFor={`region-${region}`} className="text-sm">
                        {region}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Customer Segments Section */}
          <div>
            <div 
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => setActiveFilterSection(prev => prev === 'segments' ? null : 'segments')}
            >
              <h3 className="text-sm font-medium">Customer Segments</h3>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                activeFilterSection === 'segments' && "transform rotate-180"
              )} />
            </div>
            
            {activeFilterSection === 'segments' && (
              <div className="p-2 border rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  {segmentOptions.map(segment => (
                    <div key={segment} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`segment-${segment}`} 
                        checked={filters.segments.includes(segment)}
                        onCheckedChange={() => toggleSegment(segment)}
                      />
                      <Label htmlFor={`segment-${segment}`} className="text-sm">
                        {segment}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Custom Filters Section */}
          <div>
            <div 
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => setActiveFilterSection(prev => prev === 'custom' ? null : 'custom')}
            >
              <h3 className="text-sm font-medium">Custom Filters</h3>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                activeFilterSection === 'custom' && "transform rotate-180"
              )} />
            </div>
            
            {activeFilterSection === 'custom' && (
              <div className="p-2 border rounded-md space-y-3">
                <div className="flex flex-wrap gap-2">
                  {filters.customFilters.map((filter, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      <span>{filter.field}: {filter.value}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1"
                        onClick={() => removeCustomFilter(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap items-end gap-2">
                  <div>
                    <Label className="text-xs mb-1 block">Field</Label>
                    <Input 
                      placeholder="Field name" 
                      className="w-[140px]"
                      value={newCustomField}
                      onChange={e => setNewCustomField(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Value</Label>
                    <Input 
                      placeholder="Field value" 
                      className="w-[140px]"
                      value={newCustomValue}
                      onChange={e => setNewCustomValue(e.target.value)}
                    />
                  </div>
                  <Button size="sm" onClick={addCustomFilter}>Add</Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Active Filters Display */}
          {(filters.regions.length > 0 || filters.segments.length > 0 || filters.customFilters.length > 0) && (
            <div className="border-t pt-3 mt-3">
              <h3 className="text-sm font-medium mb-2">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {filters.regions.map(region => (
                  <Badge key={region} variant="outline" className="px-2 py-1">
                    Region: {region}
                  </Badge>
                ))}
                
                {filters.segments.map(segment => (
                  <Badge key={segment} variant="outline" className="px-2 py-1">
                    Segment: {segment}
                  </Badge>
                ))}
                
                {filters.customFilters.map((filter, index) => (
                  <Badge key={index} variant="outline" className="px-2 py-1">
                    {filter.field}: {filter.value}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Filter Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={resetFilters}>Reset</Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
