
import React from 'react';
import { PerformanceMetrics } from '@/components/PlatformAnalytics';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Share2, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PerformanceAnalyticsPage: React.FC = () => {
  const { toast } = useToast();
  
  const handleRefresh = () => {
    toast({
      title: "Refreshing analytics",
      description: "Fetching the latest platform performance data..."
    });
    
    // In a real app, this would trigger a data refresh
    setTimeout(() => {
      toast({
        title: "Refresh complete",
        description: "Performance analytics data is now up to date."
      });
    }, 1500);
  };
  
  const handleExport = () => {
    toast({
      title: "Exporting report",
      description: "Preparing performance analytics report..."
    });
    
    // In a real app, this would generate a report
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Performance analytics report has been downloaded."
      });
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground">
            Monitor system performance, usage patterns, and data metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={handleRefresh}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="performanceMetrics">
        <TabsList>
          <TabsTrigger value="performanceMetrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="usageAnalytics">Usage Analytics</TabsTrigger>
          <TabsTrigger value="aiMetrics">AI Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performanceMetrics" className="space-y-6">
          <PerformanceMetrics />
        </TabsContent>
        
        <TabsContent value="usageAnalytics">
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>Track user engagement and feature adoption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">Usage analytics module will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="aiMetrics">
          <Card>
            <CardHeader>
              <CardTitle>AI Performance Metrics</CardTitle>
              <CardDescription>Monitor AI response times and accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">AI metrics module will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalyticsPage;
