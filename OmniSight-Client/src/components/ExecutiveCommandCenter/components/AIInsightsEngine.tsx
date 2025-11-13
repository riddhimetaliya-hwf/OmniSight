
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Zap,
  Activity,
  BarChart3,
  RefreshCw,
  Eye
} from 'lucide-react';
import { ExecutiveRole } from '@/types/executive-roles';

interface AIInsight {
  id: string;
  type: 'predictive' | 'anomaly' | 'pattern' | 'automated';
  title: string;
  description: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  dataSource: string;
}

interface AIInsightsEngineProps {
  role: ExecutiveRole;
}

const AIInsightsEngine: React.FC<AIInsightsEngineProps> = ({ role }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockInsights: Record<ExecutiveRole, AIInsight[]> = {
    CEO: [
      {
        id: '1',
        type: 'predictive',
        title: 'Market Share Growth Opportunity',
        description: 'AI models predict 15% market share increase possible in Q2 based on competitor weakness and product launch timing.',
        confidence: 87,
        priority: 'high',
        actionable: true,
        dataSource: 'Market Intelligence + Sales Data'
      },
      {
        id: '2',
        type: 'anomaly',
        title: 'Customer Sentiment Shift Detected',
        description: 'Unusual pattern in customer feedback suggests emerging concern about product reliability in enterprise segment.',
        confidence: 92,
        priority: 'high',
        actionable: true,
        dataSource: 'Customer Support + Social Media'
      }
    ],
    CFO: [
      {
        id: '3',
        type: 'predictive',
        title: 'Cash Flow Optimization Alert',
        description: 'ML models suggest optimizing payment terms could improve cash flow by $2.3M over next quarter.',
        confidence: 85,
        priority: 'high',
        actionable: true,
        dataSource: 'Financial Systems + Vendor Data'
      },
      {
        id: '4',
        type: 'pattern',
        title: 'Cost Structure Inefficiency Pattern',
        description: 'AI detected recurring cost spikes in IT infrastructure during month-end processes, suggesting automation opportunity.',
        confidence: 78,
        priority: 'medium',
        actionable: true,
        dataSource: 'ERP + Infrastructure Monitoring'
      }
    ],
    COO: [
      {
        id: '5',
        type: 'anomaly',
        title: 'Supply Chain Disruption Risk',
        description: 'Predictive models indicate 73% probability of supplier delays in Southeast Asia affecting Q3 production.',
        confidence: 91,
        priority: 'high',
        actionable: true,
        dataSource: 'Supply Chain + External Risk Data'
      }
    ],
    CTO: [
      {
        id: '6',
        type: 'predictive',
        title: 'System Performance Degradation Forecast',
        description: 'ML analysis predicts database performance issues in 2-3 weeks based on current usage trends.',
        confidence: 89,
        priority: 'high',
        actionable: true,
        dataSource: 'System Monitoring + Usage Analytics'
      }
    ],
    CMO: [
      {
        id: '7',
        type: 'pattern',
        title: 'Campaign Attribution Insights',
        description: 'Advanced analytics reveal that video content drives 3x higher conversion rates for B2B segments.',
        confidence: 94,
        priority: 'medium',
        actionable: true,
        dataSource: 'Marketing Automation + CRM'
      }
    ]
  };

  useEffect(() => {
    setInsights(mockInsights[role] || []);
  }, [role]);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Simulate new insights generation
      setInsights([...mockInsights[role] || []]);
    }, 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'predictive':
        return <TrendingUp className="h-4 w-4" />;
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4" />;
      case 'pattern':
        return <Activity className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI Insights Engine</h3>
            <p className="text-sm text-muted-foreground">Predictive analytics and anomaly detection</p>
          </div>
        </div>
        <Button 
          onClick={runAnalysis} 
          disabled={isAnalyzing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <Card key={insight.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(insight.type)}
                  <Badge variant="outline" size="sm" className="capitalize">
                    {insight.type}
                  </Badge>
                  <Badge variant={getPriorityColor(insight.priority)} size="sm">
                    {insight.priority}
                  </Badge>
                </div>
                {insight.actionable && (
                  <Badge variant="success" size="sm">
                    Actionable
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base mt-2">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Confidence Level</span>
                  <span>{insight.confidence}%</span>
                </div>
                <Progress value={insight.confidence} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Source: {insight.dataSource}
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Eye className="h-3 w-3" />
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {insights.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No AI insights available</p>
              <Button onClick={runAnalysis} disabled={isAnalyzing}>
                Generate Insights
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIInsightsEngine;
