
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  AlertCircle, 
  BarChart3, 
  Clock, 
  DollarSign, 
  Filter, 
  LineChart, 
  ShieldCheck, 
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MetricsGrid from './components/MetricsGrid';
import PerformanceAlerts from './components/PerformanceAlerts';
import { mockITMetrics, mockBusinessMetrics } from './data/mockData';

export type ViewMode = 'focus' | 'explore';
export type MetricDomain = 'it' | 'business' | 'all';
export type TimeFrame = 'day' | 'week' | 'month' | 'quarter';

const PerformanceHub: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('focus');
  const [domain, setDomain] = useState<MetricDomain>('all');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('week');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showAlerts, setShowAlerts] = useState<boolean>(true);

  // Filter metrics based on selected domain
  const filteredMetrics = {
    it: domain === 'all' || domain === 'it' ? mockITMetrics : [],
    business: domain === 'all' || domain === 'business' ? mockBusinessMetrics : []
  };

  const alertsCount = 5; // This would come from a real data source

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Performance Command Center</h1>
          <p className="text-muted-foreground">
            Real-time performance metrics across IT and business operations
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={viewMode === 'focus' ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode('focus')}
            className="gap-1"
          >
            <Activity className="h-4 w-4" />
            <span>Focus Mode</span>
          </Button>
          <Button 
            variant={viewMode === 'explore' ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode('explore')}
            className="gap-1"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Explore Mode</span>
          </Button>
          <Button 
            variant={showAlerts ? "default" : "outline"} 
            size="sm"
            onClick={() => setShowAlerts(!showAlerts)}
            className="gap-1 relative"
          >
            <AlertCircle className="h-4 w-4" />
            <span>Alerts</span>
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {alertsCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-muted/40 border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Domain</label>
            <Select value={domain} onValueChange={(value) => setDomain(value as MetricDomain)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                <SelectItem value="it">IT Services</SelectItem>
                <SelectItem value="business">Business Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Time Frame</label>
            <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Time Frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Region</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="north_america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia_pacific">Asia Pacific</SelectItem>
                <SelectItem value="latin_america">Latin America</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" size="default" className="w-full gap-1">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {showAlerts && <PerformanceAlerts />}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full max-w-md mb-4">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="it" className="flex-1">IT Services</TabsTrigger>
          <TabsTrigger value="business" className="flex-1">Business Operations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          {domain !== 'business' && (
            <>
              <h2 className="text-lg font-medium mb-4">IT Services Performance</h2>
              <MetricsGrid 
                metrics={filteredMetrics.it} 
                viewMode={viewMode} 
                timeFrame={timeFrame}
              />
            </>
          )}
          
          {domain !== 'it' && (
            <>
              <h2 className="text-lg font-medium mb-4 mt-6">Business Operations Performance</h2>
              <MetricsGrid 
                metrics={filteredMetrics.business} 
                viewMode={viewMode} 
                timeFrame={timeFrame}
              />
            </>
          )}
        </TabsContent>
        
        <TabsContent value="it" className="mt-0">
          <h2 className="text-lg font-medium mb-4">IT Services Performance</h2>
          <MetricsGrid 
            metrics={mockITMetrics} 
            viewMode={viewMode} 
            timeFrame={timeFrame}
          />
        </TabsContent>
        
        <TabsContent value="business" className="mt-0">
          <h2 className="text-lg font-medium mb-4">Business Operations Performance</h2>
          <MetricsGrid 
            metrics={mockBusinessMetrics} 
            viewMode={viewMode} 
            timeFrame={timeFrame}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceHub;
