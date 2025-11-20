
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Heart,
  Brain,
  Target,
  Activity,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface AnalyticsData {
  sentiment: {
    market: number;
    internal: number;
    trend: 'up' | 'down' | 'stable';
  };
  forecast: {
    revenue: { current: number; predicted: number; confidence: number };
    growth: { current: number; predicted: number; confidence: number };
  };
  anomalies: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    impact: number;
  }>;
  roi: {
    projects: Array<{
      name: string;
      investment: number;
      expectedReturn: number;
      roi: number;
      timeline: string;
    }>;
  };
}

const AdvancedAnalytics: React.FC = () => {
  const [analyticsData] = useState<AnalyticsData>({
    sentiment: {
      market: 72,
      internal: 85,
      trend: 'up'
    },
    forecast: {
      revenue: { current: 2400000, predicted: 2650000, confidence: 87 },
      growth: { current: 12, predicted: 15.5, confidence: 82 }
    },
    anomalies: [
      {
        id: '1',
        type: 'Revenue Spike',
        severity: 'medium',
        description: 'Enterprise sales 23% above normal for December',
        impact: 15
      },
      {
        id: '2',
        type: 'Cost Anomaly',
        severity: 'high',
        description: 'Marketing spend deviation in Q4',
        impact: -8
      }
    ],
    roi: {
      projects: [
        { name: 'AI Implementation', investment: 500000, expectedReturn: 1200000, roi: 140, timeline: '18 months' },
        { name: 'Market Expansion', investment: 800000, expectedReturn: 1600000, roi: 100, timeline: '24 months' }
      ]
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-600 border-red-500/30';
      case 'high': return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'medium': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/30';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sentiment" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="space-y-4">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Market Sentiment</span>
                  <div className="flex items-center gap-2">
                    <Progress value={analyticsData.sentiment.market} className="w-20 h-2" />
                    <span className="text-sm font-semibold">{analyticsData.sentiment.market}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Internal Sentiment</span>
                  <div className="flex items-center gap-2">
                    <Progress value={analyticsData.sentiment.internal} className="w-20 h-2" />
                    <span className="text-sm font-semibold">{analyticsData.sentiment.internal}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                  {analyticsData.sentiment.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  Trending {analyticsData.sentiment.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Predictive Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Revenue Forecast
                  </h4>
                  <div className="text-2xl font-bold">
                    ${(analyticsData.forecast.revenue.predicted / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {analyticsData.forecast.revenue.confidence}% confidence
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Growth Forecast
                  </h4>
                  <div className="text-2xl font-bold">
                    {analyticsData.forecast.growth.predicted}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {analyticsData.forecast.growth.confidence}% confidence
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                Anomaly Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analyticsData.anomalies.map((anomaly) => (
                <div key={anomaly.id} className="p-3 rounded-lg border bg-background/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <h4 className="font-medium text-sm">{anomaly.type}</h4>
                    </div>
                    <Badge className={getSeverityColor(anomaly.severity)}>
                      {anomaly.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{anomaly.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Impact:</span>
                    <span className={`text-xs font-semibold ${anomaly.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {anomaly.impact > 0 ? '+' : ''}{anomaly.impact}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                ROI Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analyticsData.roi.projects.map((project, index) => (
                <div key={index} className="p-3 rounded-lg border bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{project.name}</h4>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                      {project.roi}% ROI
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Investment:</span>
                      <div className="font-semibold">${(project.investment / 1000).toFixed(0)}K</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected Return:</span>
                      <div className="font-semibold">${(project.expectedReturn / 1000).toFixed(0)}K</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Timeline:</span>
                      <div className="font-semibold">{project.timeline}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
