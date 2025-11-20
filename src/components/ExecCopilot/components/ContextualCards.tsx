
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Users,
  TrendingUp,
  Clock,
  FileText,
  MessageSquare,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface ContextualCard {
  id: string;
  title: string;
  description: string;
  type: 'meeting' | 'metric' | 'task' | 'opportunity' | 'alert';
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionType?: 'view' | 'approve' | 'review' | 'schedule';
  timeContext?: string;
  value?: string;
  trend?: 'up' | 'down' | 'stable';
}

const ContextualCards: React.FC = () => {
  const [contextualCards, setContextualCards] = useState<ContextualCard[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadContextualData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const loadContextualData = () => {
    const hour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    
    // Mock contextual data based on time and context
    const mockCards: ContextualCard[] = [
      // Morning context
      ...(hour >= 8 && hour < 12 ? [{
        id: 'morning-1',
        title: 'Daily Standup in 30 minutes',
        description: 'Engineering team standup. Key blockers: API integration delays.',
        type: 'meeting' as const,
        priority: 'high' as const,
        action: 'View Agenda',
        actionType: 'view' as const,
        timeContext: '9:30 AM'
      }] : []),
      
      // Afternoon context
      ...(hour >= 13 && hour < 17 ? [{
        id: 'afternoon-1',
        title: 'Q4 Revenue Review Ready',
        description: 'Complete quarterly analysis prepared for board presentation.',
        type: 'metric' as const,
        priority: 'high' as const,
        action: 'Review Report',
        actionType: 'review' as const,
        value: '$2.4M',
        trend: 'up' as const
      }] : []),
      
      // Weekly context
      ...(dayOfWeek === 1 ? [{
        id: 'weekly-1',
        title: 'Weekly Goals Setting',
        description: 'Set priorities and objectives for the upcoming week.',
        type: 'task' as const,
        priority: 'medium' as const,
        action: 'Set Goals',
        actionType: 'schedule' as const
      }] : []),
      
      // Always relevant
      {
        id: 'always-1',
        title: 'Enterprise Deal Pipeline',
        description: '3 deals worth $1.2M total requiring executive review and approval.',
        type: 'opportunity' as const,
        priority: 'high' as const,
        action: 'Review Deals',
        actionType: 'approve' as const,
        value: '$1.2M',
        trend: 'up' as const
      },
      {
        id: 'always-2',
        title: 'Customer Health Score Alert',
        description: '2 enterprise accounts showing declining engagement. Intervention recommended.',
        type: 'alert' as const,
        priority: 'medium' as const,
        action: 'View Details',
        actionType: 'view' as const
      }
    ];
    
    setContextualCards(mockCards);
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'metric': return <BarChart3 className="h-5 w-5 text-green-500" />;
      case 'task': return <CheckCircle2 className="h-5 w-5 text-purple-500" />;
      case 'opportunity': return <Target className="h-5 w-5 text-emerald-500" />;
      case 'alert': return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/30';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'low': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const getActionIcon = (actionType?: string) => {
    switch (actionType) {
      case 'view': return <FileText className="h-4 w-4" />;
      case 'approve': return <CheckCircle2 className="h-4 w-4" />;
      case 'review': return <MessageSquare className="h-4 w-4" />;
      case 'schedule': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleCardAction = (card: ContextualCard) => {
    console.log(`Executing action for card: ${card.id}`);
    // In real app, this would trigger specific actions
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Contextual Insights</h3>
        <div className="text-sm text-muted-foreground">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      <div className="space-y-3">
        {contextualCards.map((card) => (
          <Card key={card.id} className="glass-effect border-white/10 hover:bg-accent/5 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background/50">
                    {getCardIcon(card.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{card.title}</h4>
                      <Badge size="sm" className={getPriorityColor(card.priority)}>
                        {card.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                </div>
                
                {card.value && (
                  <div className="text-right">
                    <div className="font-semibold">{card.value}</div>
                    {card.trend && (
                      <div className="flex items-center gap-1 text-xs">
                        <TrendingUp className={`h-3 w-3 ${
                          card.trend === 'up' ? 'text-green-500' : 
                          card.trend === 'down' ? 'text-red-500 rotate-180' : 
                          'text-muted-foreground'
                        }`} />
                        <span className={card.trend === 'up' ? 'text-green-500' : 
                                       card.trend === 'down' ? 'text-red-500' : 
                                       'text-muted-foreground'}>
                          {card.trend}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                {card.timeContext && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {card.timeContext}
                  </div>
                )}
                
                {card.action && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCardAction(card)}
                    className="ml-auto"
                  >
                    {getActionIcon(card.actionType)}
                    <span className="ml-1">{card.action}</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContextualCards;
