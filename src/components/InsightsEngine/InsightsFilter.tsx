
import React from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Department, InsightSeverity, InsightType, InsightsFilterState, MetricCategory, TimeRange } from "./types";

interface InsightsFilterProps {
  filters: InsightsFilterState;
  onFilterChange: (filters: InsightsFilterState) => void;
}

const InsightsFilter: React.FC<InsightsFilterProps> = ({ filters, onFilterChange }) => {
  const handleDepartmentChange = (value: string) => {
    const department = value as Department;
    const newDepartments = department === "all" 
      ? ["sales", "marketing", "finance", "operations", "hr"] 
      : [department];
    onFilterChange({ ...filters, departments: newDepartments as Department[] });
  };

  const handleMetricChange = (value: string) => {
    const metric = value as MetricCategory;
    const newMetrics = metric === "all" 
      ? ["revenue", "costs", "conversion", "engagement", "retention", "productivity"] 
      : [metric];
    onFilterChange({ ...filters, metricCategories: newMetrics as MetricCategory[] });
  };

  const handleTypeChange = (value: string) => {
    // Fix: Use string comparison instead of type comparison
    const newTypes = value === "all" 
      ? ["anomaly", "trend", "forecast", "root-cause", "correlation"] 
      : [value as InsightType];
    onFilterChange({ ...filters, types: newTypes as InsightType[] });
  };

  const handleSeverityChange = (value: string) => {
    // Fix: Use string comparison instead of type comparison
    const newSeverities = value === "all" 
      ? ["critical", "high", "medium", "low", "info"] 
      : [value as InsightSeverity];
    onFilterChange({ ...filters, severities: newSeverities as InsightSeverity[] });
  };

  const handleTimeRangeChange = (value: string) => {
    const timeRange = value as TimeRange;
    
    // Reset custom date range if not using custom
    const updatedFilters = { 
      ...filters, 
      timeRange,
      ...(timeRange !== "custom" ? { startDate: undefined, endDate: undefined } : {})
    };
    
    onFilterChange(updatedFilters);
  };

  const handleDateRangeChange = (date: Date | undefined, isStart = true) => {
    if (isStart) {
      onFilterChange({ ...filters, startDate: date });
    } else {
      onFilterChange({ ...filters, endDate: date });
    }
  };

  // Helper function to determine filter display value
  const getTypeDisplayValue = () => {
    if (filters.types.length > 1) return "all";
    return filters.types.length === 1 ? filters.types[0] : "all";
  };

  // Helper function to determine severity display value
  const getSeverityDisplayValue = () => {
    if (filters.severities.length > 1) return "all";
    return filters.severities.length === 1 ? filters.severities[0] : "all";
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="text-sm font-medium block mb-2">Department</label>
            <Select 
              value={filters.departments.length === 1 ? filters.departments[0] : "all"} 
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[180px]">
            <label className="text-sm font-medium block mb-2">Metric</label>
            <Select 
              value={filters.metricCategories.length === 1 ? filters.metricCategories[0] : "all"} 
              onValueChange={handleMetricChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="costs">Costs</SelectItem>
                <SelectItem value="conversion">Conversion</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="retention">Retention</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[180px]">
            <label className="text-sm font-medium block mb-2">Insight Type</label>
            <Select 
              value={getTypeDisplayValue()} 
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="anomaly">Anomaly</SelectItem>
                <SelectItem value="trend">Trend</SelectItem>
                <SelectItem value="forecast">Forecast</SelectItem>
                <SelectItem value="root-cause">Root Cause</SelectItem>
                <SelectItem value="correlation">Correlation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[180px]">
            <label className="text-sm font-medium block mb-2">Severity</label>
            <Select 
              value={getSeverityDisplayValue()} 
              onValueChange={handleSeverityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[180px]">
            <label className="text-sm font-medium block mb-2">Time Range</label>
            <Select 
              value={filters.timeRange} 
              onValueChange={handleTimeRangeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last24h">Last 24 Hours</SelectItem>
                <SelectItem value="last7d">Last 7 Days</SelectItem>
                <SelectItem value="last30d">Last 30 Days</SelectItem>
                <SelectItem value="last90d">Last 90 Days</SelectItem>
                <SelectItem value="lastYear">Last Year</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filters.timeRange === "custom" && (
            <div className="flex items-end gap-2 min-w-[320px]">
              <div className="flex-1">
                <label className="text-sm font-medium block mb-2">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.startDate ? format(filters.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.startDate}
                      onSelect={(date) => handleDateRangeChange(date, true)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium block mb-2">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.endDate ? format(filters.endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.endDate}
                      onSelect={(date) => handleDateRangeChange(date, false)}
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
      </CardContent>
    </Card>
  );
};

export default InsightsFilter;
