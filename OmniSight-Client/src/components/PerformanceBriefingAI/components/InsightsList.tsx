
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePerformanceBriefing } from '../context/PerformanceBriefingContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  AlertTriangle, 
  Lightbulb, 
  BarChart, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import InsightCard from './InsightCard';

const InsightsList: React.FC = () => {
  const { insights, generateBriefing, isLoading } = usePerformanceBriefing();
  
  useEffect(() => {
    // Generate briefing on component mount
    generateBriefing();
  }, []);
  
  const kpiInsights = insights.filter(i => i.category === 'kpi');
  const opportunityInsights = insights.filter(i => i.category === 'opportunity');
  const riskInsights = insights.filter(i => i.category === 'risk');
  const trendInsights = insights.filter(i => i.category === 'trend');
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500">Generating your performance briefing...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Insights Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No performance insights are available for the current settings.
            Try changing your timeframe or department filters.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="kpi">KPIs</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {insights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </TabsContent>
          
          <TabsContent value="kpi" className="space-y-4">
            {kpiInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </TabsContent>
          
          <TabsContent value="risks" className="space-y-4">
            {riskInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </TabsContent>
          
          <TabsContent value="opportunities" className="space-y-4">
            {opportunityInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            {trendInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InsightsList;
