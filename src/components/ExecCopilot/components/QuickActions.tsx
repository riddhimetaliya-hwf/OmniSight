
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText,
  BarChart3,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Zap,
  Target,
  Shield,
  Globe,
  Brain,
  Clock
} from 'lucide-react';
import { useCopilotContext } from '../context/CopilotContext';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'report' | 'analysis' | 'communication' | 'planning';
  estimatedTime?: string;
}

const QuickActions: React.FC = () => {
  const { generateBriefing, generateReport, submitQuery } = useCopilotContext();

  const quickActions: QuickAction[] = [
    // Reports
    {
      id: 'daily-brief',
      title: 'Daily Briefing',
      description: 'Generate personalized daily business summary',
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      action: () => generateBriefing('daily'),
      category: 'report',
      estimatedTime: '2 min'
    },
    {
      id: 'weekly-brief',
      title: 'Weekly Report',
      description: 'Comprehensive weekly performance overview',
      icon: <BarChart3 className="h-5 w-5 text-green-500" />,
      action: () => generateBriefing('weekly'),
      category: 'report',
      estimatedTime: '5 min'
    },
    {
      id: 'financial-report',
      title: 'Financial Analysis',
      description: 'Current financial metrics and trends',
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
      action: () => generateReport('Finance'),
      category: 'analysis',
      estimatedTime: '3 min'
    },
    {
      id: 'hr-report',
      title: 'People Analytics',
      description: 'Team performance and HR insights',
      icon: <Users className="h-5 w-5 text-purple-500" />,
      action: () => generateReport('HR'),
      category: 'analysis',
      estimatedTime: '4 min'
    },
    
    // Analysis
    {
      id: 'competitive-analysis',
      title: 'Competitive Intelligence',
      description: 'Latest market position and competitor updates',
      icon: <Target className="h-5 w-5 text-amber-500" />,
      action: () => submitQuery('Analyze our competitive position and recent market changes'),
      category: 'analysis',
      estimatedTime: '6 min'
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Current business risks and mitigation strategies',
      icon: <Shield className="h-5 w-5 text-red-500" />,
      action: () => submitQuery('Show me current top business risks and recommended actions'),
      category: 'analysis',
      estimatedTime: '4 min'
    },
    
    // Communication
    {
      id: 'board-prep',
      title: 'Board Meeting Prep',
      description: 'Prepare materials and talking points',
      icon: <MessageSquare className="h-5 w-5 text-indigo-500" />,
      action: () => submitQuery('Prepare board meeting materials with key metrics and talking points'),
      category: 'communication',
      estimatedTime: '8 min'
    },
    {
      id: 'investor-update',
      title: 'Investor Update',
      description: 'Generate investor communication draft',
      icon: <Globe className="h-5 w-5 text-cyan-500" />,
      action: () => submitQuery('Create investor update highlighting key achievements and metrics'),
      category: 'communication',
      estimatedTime: '10 min'
    },
    
    // Planning
    {
      id: 'goal-review',
      title: 'Goal Review',
      description: 'Assess progress on quarterly objectives',
      icon: <Target className="h-5 w-5 text-orange-500" />,
      action: () => submitQuery('Review progress on Q4 goals and identify areas needing attention'),
      category: 'planning',
      estimatedTime: '5 min'
    },
    {
      id: 'forecast-update',
      title: 'Revenue Forecast',
      description: 'Update financial projections and scenarios',
      icon: <Brain className="h-5 w-5 text-pink-500" />,
      action: () => submitQuery('Update revenue forecast based on current trends and pipeline'),
      category: 'planning',
      estimatedTime: '7 min'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'report': return 'border-l-blue-500 bg-blue-500/5';
      case 'analysis': return 'border-l-green-500 bg-green-500/5';
      case 'communication': return 'border-l-purple-500 bg-purple-500/5';
      case 'planning': return 'border-l-amber-500 bg-amber-500/5';
      default: return 'border-l-muted bg-muted/5';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'report': return <FileText className="h-4 w-4" />;
      case 'analysis': return <BarChart3 className="h-4 w-4" />;
      case 'communication': return <MessageSquare className="h-4 w-4" />;
      case 'planning': return <Calendar className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const groupedActions = quickActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, QuickAction[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Quick Actions</h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(groupedActions).map(([category, actions]) => (
          <Card key={category} className="glass-effect border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 capitalize">
                {getCategoryIcon(category)}
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  onClick={action.action}
                  className={`w-full justify-start p-3 h-auto border-l-2 ${getCategoryColor(action.category)} hover:bg-white/10 transition-all duration-300`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {action.icon}
                      <div className="text-left">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </div>
                    {action.estimatedTime && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {action.estimatedTime}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
