
import { useState, useEffect, useMemo } from "react";
import { 
  InsightData, 
  InsightsFilterState, 
  Department, 
  MetricCategory, 
  InsightType, 
  InsightSeverity, 
  TimeRange 
} from "./types";
import { generateMockInsights } from "./mockInsightsData";

const defaultFilters: InsightsFilterState = {
  departments: ["sales", "marketing", "finance", "operations", "hr"] as Department[],
  metricCategories: ["revenue", "costs", "conversion", "engagement", "retention", "productivity"] as MetricCategory[],
  types: ["anomaly", "trend", "forecast", "root-cause", "correlation"] as InsightType[],
  severities: ["critical", "high", "medium", "low", "info"] as InsightSeverity[],
  timeRange: "last30d" as TimeRange,
};

export const useInsights = () => {
  const [allInsights, setAllInsights] = useState<InsightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InsightsFilterState>(defaultFilters);

  // Fetch insights - in a real app, this would be an API call
  useEffect(() => {
    setIsLoading(true);
    try {
      // Simulate an API call with a small delay
      const timeoutId = setTimeout(() => {
        const mockData = generateMockInsights();
        setAllInsights(mockData);
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    } catch (err) {
      setError("Failed to load insights data");
      setIsLoading(false);
    }
  }, []);

  // Filter insights based on current filters
  const filteredInsights = useMemo(() => {
    if (isLoading || error) return [];

    return allInsights.filter(insight => {
      // Filter by department
      if (!filters.departments.includes(insight.department as Department)) {
        return false;
      }

      // Filter by metric category
      if (!filters.metricCategories.includes(insight.metricCategory as MetricCategory)) {
        return false;
      }

      // Filter by insight type
      if (!filters.types.includes(insight.type as InsightType)) {
        return false;
      }

      // Filter by severity
      if (!filters.severities.includes(insight.severity as InsightSeverity)) {
        return false;
      }

      // Filter by time range
      const insightDate = new Date(insight.timestamp);
      const now = new Date();
      
      switch (filters.timeRange) {
        case "last24h":
          const oneDayAgo = new Date(now);
          oneDayAgo.setDate(now.getDate() - 1);
          return insightDate >= oneDayAgo;
        
        case "last7d":
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);
          return insightDate >= sevenDaysAgo;
        
        case "last30d":
          const thirtyDaysAgo = new Date(now);
          thirtyDaysAgo.setDate(now.getDate() - 30);
          return insightDate >= thirtyDaysAgo;
        
        case "last90d":
          const ninetyDaysAgo = new Date(now);
          ninetyDaysAgo.setDate(now.getDate() - 90);
          return insightDate >= ninetyDaysAgo;
        
        case "lastYear":
          const oneYearAgo = new Date(now);
          oneYearAgo.setFullYear(now.getFullYear() - 1);
          return insightDate >= oneYearAgo;
        
        case "ytd":
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          return insightDate >= startOfYear;
        
        case "custom":
          const startDateValid = filters.startDate ? insightDate >= filters.startDate : true;
          const endDateValid = filters.endDate ? insightDate <= filters.endDate : true;
          return startDateValid && endDateValid;
        
        default:
          return true;
      }
    });
  }, [allInsights, filters, isLoading, error]);

  // Update filters
  const updateFilters = (newFilters: InsightsFilterState) => {
    setFilters(newFilters);
  };

  // Reset filters to default
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Group insights by category
  const insightsByCategory = useMemo(() => {
    const grouped = {
      critical: filteredInsights.filter(i => i.severity === "critical"),
      anomalies: filteredInsights.filter(i => i.type === "anomaly"),
      forecasts: filteredInsights.filter(i => i.type === "forecast"),
      trends: filteredInsights.filter(i => i.type === "trend"),
      other: filteredInsights.filter(i => 
        i.type !== "anomaly" && i.type !== "forecast" && i.type !== "trend"
      )
    };
    
    return grouped;
  }, [filteredInsights]);

  return {
    insights: filteredInsights,
    insightsByCategory,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters
  };
};
