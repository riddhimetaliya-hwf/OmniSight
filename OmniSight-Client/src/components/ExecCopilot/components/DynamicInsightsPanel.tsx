import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Brain,
  Lightbulb,
  Zap
} from 'lucide-react';

interface DynamicInsightsPanelProps {
  selectedInsight: string | null;
}

const DynamicInsightsPanel: React.FC<DynamicInsightsPanelProps> = ({ selectedInsight }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'recommendations' | 'actions'>('insights');

  const insights = [
    {
      id: 'revenue-trend',
      title: 'Revenue Acceleration',
      description: 'Q4 revenue is tracking 12% above target with strong momentum in enterprise segment',
      impact: 'high',
      confidence: 94,
      trend: 'up',
      details: {
        metrics: [
          { name: 'Current Revenue', value: '$2.4M', change: '+12%' },
          { name: 'Enterprise Growth', value: '28%', change: '+15%' },
          { name: 'Recurring Revenue', value: '85%', change: '+3%' }
        ],
        recommendations: [
          'Increase enterprise sales team by 2 members',
          'Launch upselling campaign for existing accounts',
          'Accelerate product features for enterprise clients'
        ]
      }
    },
    {
      id: 'team-performance',
      title: 'Team Productivity Surge',
      description: 'Cross-functional team performance improved 18% following new workflow implementation',
      impact: 'medium',
      confidence: 87,
      trend: 'up',
      details: {
        metrics: [
          { name: 'Overall Productivity', value: '94%', change: '+18%' },
          { name: 'Sprint Completion', value: '96%', change: '+12%' },
          { name: 'Team Satisfaction', value: '4.6/5', change: '+0.4' }
        ],
        recommendations: [
          'Scale successful workflow to other teams',
          'Document best practices for knowledge sharing',
          'Plan team recognition event'
        ]
      }
    },
    {
      id: 'market-opportunity',
      title: 'Market Expansion Opportunity',
      description: 'Competitor analysis reveals 15% market gap in mid-market segment',
      impact: 'high',
      confidence: 91,
      trend: 'neutral',
      details: {
        metrics: [
          { name: 'Market Gap', value: '15%', change: 'new' },
          { name: 'Addressable Market', value: '$50M', change: 'new' },
          { name: 'Competition Density', value: 'Low', change: 'new' }
        ],
        recommendations: [
          'Develop mid-market product strategy',
          'Allocate budget for market research',
          'Schedule competitor deep-dive analysis'
        ]
      }
    }
  ];

  const aiRecommendations = [
    {
      id: 'strategic-1',
      title: 'Accelerate Enterprise Growth',
      priority: 'high',
      impact: '$500K potential revenue',
      timeline: '30 days',
      actions: [
        'Hire 2 enterprise sales specialists',
        'Create enterprise product roadmap',
        'Launch customer success program'
      ]
    },
    {
      id: 'strategic-2',
      title: 'Optimize Team Structure',
      priority: 'medium',
      impact: '25% efficiency gain',
      timeline: '45 days',
      actions: [
        'Restructure engineering teams',
        'Implement cross-training program',
        'Deploy new project management tools'
      ]
    }
  ];

  const quickActions = [
    { id: '1', title: 'Schedule Board Presentation', icon: Target, urgency: 'high' },
    { id: '2', title: 'Review Enterprise Pipeline', icon: DollarSign, urgency: 'medium' },
    { id: '3', title: 'Plan Team All-Hands', icon: Users, urgency: 'low' },
    { id: '4', title: 'Analyze Competitor Moves', icon: BarChart3, urgency: 'medium' }
  ];

  const getInsightDetails = (insightId: string) => {
    return insights.find(i => i.id === insightId) || insights[0];
  };

  const selectedInsightData = selectedInsight ? getInsightDetails(selectedInsight) : insights[0];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 min-h-0">
      {/* AI Status */}
      <Card className="glass-enhanced">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-slate-800">AI Analysis Active</p>
              <p className="text-xs text-slate-600">Monitoring 47 data sources</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Zap className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
        {[
          { key: 'insights', label: 'Insights', icon: Lightbulb },
          { key: 'recommendations', label: 'Actions', icon: Target },
          { key: 'actions', label: 'Quick', icon: Zap }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <tab.icon className="h-3 w-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          <Card className="glass-enhanced">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-700">
                  {selectedInsightData.title}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    selectedInsightData.impact === 'high' 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {selectedInsightData.impact} impact
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedInsightData.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">AI Confidence</span>
                  <span className="text-xs font-medium">{selectedInsightData.confidence}%</span>
                </div>
                <Progress value={selectedInsightData.confidence} className="h-1" />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-700">Key Metrics</p>
                {selectedInsightData.details.metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-xs text-slate-600">{metric.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">{metric.value}</span>
                      {metric.change !== 'new' && (
                        <span className="text-xs text-green-600">{metric.change}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Other Insights */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-slate-700">Other Insights</p>
            {insights.filter(i => i.id !== selectedInsightData.id).map((insight) => (
              <Card key={insight.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {}}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      insight.trend === 'up' ? 'bg-green-500' : 
                      insight.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-xs text-slate-800">{insight.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{insight.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {aiRecommendations.map((rec) => (
            <Card key={rec.id} className="glass-enhanced">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-700">{rec.title}</CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      rec.priority === 'high' 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {rec.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-600">Impact</p>
                    <p className="font-medium text-slate-800">{rec.impact}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Timeline</p>
                    <p className="font-medium text-slate-800">{rec.timeline}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-700">Action Items</p>
                  {rec.actions.map((action, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <CheckCircle className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-700">{action}</span>
                    </div>
                  ))}
                </div>
                
                <Button size="sm" className="w-full mt-3">
                  <Target className="h-3 w-3 mr-1" />
                  Execute Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions Tab */}
      {activeTab === 'actions' && (
        <div className="space-y-3">
          {quickActions.map((action) => (
            <Card key={action.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    action.urgency === 'high' ? 'bg-red-50' :
                    action.urgency === 'medium' ? 'bg-amber-50' : 'bg-blue-50'
                  }`}>
                    <action.icon className={`h-4 w-4 ${
                      action.urgency === 'high' ? 'text-red-600' :
                      action.urgency === 'medium' ? 'text-amber-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-800">{action.title}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs mt-1 ${
                        action.urgency === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                        action.urgency === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {action.urgency}
                    </Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicInsightsPanel;
