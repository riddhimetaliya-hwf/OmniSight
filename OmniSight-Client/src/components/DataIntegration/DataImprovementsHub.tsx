
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Filter, ArrowLeftRight, Info } from "lucide-react";

import DataSourceConnector from "./DataSourceConnector";
import AdvancedFilters from "../DataFiltering/AdvancedFilters";
import HistoricalComparisonTool from "../DataComparison/HistoricalComparisonTool";
import { DataQualityIndicator } from "../DataQuality/DataQualityIndicator";
import { FilterConfig } from "../DataFiltering/AdvancedFilters";

export const DataImprovementsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState("integrations");
  const [appliedFilters, setAppliedFilters] = useState<FilterConfig | null>(null);
  
  // Sample data quality scores for demonstration
  const overallQualityScore = {
    overall: 85,
    completeness: 92,
    accuracy: 78,
    consistency: 82,
    timeliness: 88
  };
  
  const handleFilterChange = (filters: FilterConfig) => {
    console.log("Applied filters:", filters);
    setAppliedFilters(filters);
    // In a real app, this would trigger data fetching with the new filters
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Analysis Hub</h1>
          <p className="text-muted-foreground">
            Connect, filter, compare, and evaluate your data from multiple sources
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Export Settings
          </Button>
          <Button variant="default" size="sm">
            Refresh Data
          </Button>
        </div>
      </div>
      
      {/* Data Quality Overview Card */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Data Quality Overview</CardTitle>
              <CardDescription>
                Reliability metrics for your connected data sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <DataQualityIndicator 
                    qualityScore={overallQualityScore}
                    dataSource="All Sources"
                    lastUpdated={new Date()}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Connected Data Sources</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="px-2 py-1 flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          Salesforce
                        </Badge>
                        <Badge className="px-2 py-1 flex items-center gap-1" variant="outline">
                          <Database className="h-3 w-3" />
                          Google Analytics
                        </Badge>
                        <Badge className="px-2 py-1 flex items-center gap-1" variant="outline">
                          <Database className="h-3 w-3" />
                          HubSpot
                        </Badge>
                      </div>
                    </div>
                    
                    {appliedFilters && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Active Filters</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="px-2 py-1">
                            Time: {appliedFilters.timeRange}
                          </Badge>
                          {appliedFilters.regions.length > 0 && (
                            <Badge variant="secondary" className="px-2 py-1">
                              Regions: {appliedFilters.regions.length}
                            </Badge>
                          )}
                          {appliedFilters.segments.length > 0 && (
                            <Badge variant="secondary" className="px-2 py-1">
                              Segments: {appliedFilters.segments.length}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("integrations")}>
                <Database className="mr-2 h-4 w-4" />
                Connect Data
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("filters")}>
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filters
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("comparison")}>
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Historical Comparison
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("quality")}>
                <Info className="mr-2 h-4 w-4" />
                Data Quality
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="integrations" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filters
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-1">
            <ArrowLeftRight className="h-4 w-4" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            Data Quality
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="integrations" className="mt-4">
          <DataSourceConnector />
        </TabsContent>
        
        <TabsContent value="filters" className="mt-4">
          <AdvancedFilters onFilterChange={handleFilterChange} />
        </TabsContent>
        
        <TabsContent value="comparison" className="mt-4">
          <HistoricalComparisonTool />
        </TabsContent>
        
        <TabsContent value="quality" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <DataQualityIndicator 
              qualityScore={{
                overall: 85,
                completeness: 92,
                accuracy: 78,
                consistency: 82,
                timeliness: 88
              }}
              dataSource="Salesforce"
              lastUpdated={new Date()}
              size="large"
            />
            
            <DataQualityIndicator 
              qualityScore={{
                overall: 76,
                completeness: 82,
                accuracy: 70,
                consistency: 75,
                timeliness: 78
              }}
              dataSource="Google Analytics"
              lastUpdated={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)} // 2 days ago
              size="large"
            />
            
            <DataQualityIndicator 
              qualityScore={{
                overall: 68,
                completeness: 75,
                accuracy: 62,
                consistency: 65,
                timeliness: 70
              }}
              dataSource="HubSpot"
              lastUpdated={new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)} // 5 days ago
              size="large"
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Data Quality Tips</CardTitle>
                <CardDescription>Ways to improve your data quality</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">Tip</Badge>
                    <span>Schedule regular syncs to improve data timeliness.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">Tip</Badge>
                    <span>Set up validation rules to ensure data accuracy.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">Tip</Badge>
                    <span>Standardize field formats across systems to improve consistency.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">Tip</Badge>
                    <span>Use required fields to improve data completeness.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataImprovementsHub;
