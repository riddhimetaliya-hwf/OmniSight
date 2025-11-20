
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sun, 
  Moon, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Calendar,
  Target,
  Users
} from 'lucide-react';

interface BriefingItem {
  id: string;
  title: string;
  summary: string;
  type: 'metric' | 'alert' | 'opportunity' | 'meeting';
  priority: 'high' | 'medium' | 'low';
  trend?: 'up' | 'down' | 'stable';
  value?: string;
  change?: string;
}

const SmartBriefings: React.FC = () => {
  const [briefingType, setBriefingType] = useState<'morning' | 'evening'>('morning');
  const [briefingItems, setBriefingItems] = useState<BriefingItem[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    setBriefingType(hour < 12 ? 'morning' : 'evening');
    loadBriefingData();
  }, []);

  const loadBriefingData = () => {
    // Mock briefing data - in real app this would come from API
    const mockItems: BriefingItem[] = [
      {
        id: '1',
        title: 'Revenue Performance',
        summary: 'Q4 revenue is tracking 12% above target with strong performance in enterprise segment',
        type: 'metric',
        priority: 'high',
        trend: 'up',
        value: '$2.4M',
        change: '+12%'
      },
      {
        id: '2',
        title: 'Supply Chain Alert',
        summary: 'Component delivery delays may impact Q1 production schedule. Alternative suppliers identified.',
        type: 'alert',
        priority: 'high'
      },
      {
        id: '3',
        title: 'Customer Expansion Opportunity',
        summary: '3 enterprise clients ready for upsell conversations based on usage patterns',
        type: 'opportunity',
        priority: 'medium'
      },
      {
        id: '4',
        title: 'Board Meeting Today',
        summary: 'Quarterly board meeting at 2 PM. Materials and talking points prepared.',
        type: 'meeting',
        priority: 'high'
      }
    ];
    setBriefingItems(mockItems);
  };

  const getItemIcon = (type: string, trend?: string) => {
    switch (type) {
      case 'metric':
        return trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500" /> : 
               trend === 'down' ? <TrendingDown className="h-4 w-4 text-red-500" /> :
               <Target className="h-4 w-4 text-blue-500" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'opportunity':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4" />;
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

  return (
    <div className="space-y-4">
      <Card className="glass-effect border-white/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                {briefingType === 'morning' ? 
                  <Sun className="h-5 w-5 text-amber-500" /> : 
                  <Moon className="h-5 w-5 text-blue-500" />
                }
              </div>
              <div>
                <CardTitle className="text-lg">
                  {briefingType === 'morning' ? 'Good Morning' : 'Evening Summary'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {briefingType === 'morning' 
                    ? 'Here\'s what you need to know to start your day' 
                    : 'Today\'s key highlights and tomorrow\'s priorities'
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={briefingType === 'morning' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBriefingType('morning')}
              >
                <Sun className="h-4 w-4 mr-1" />
                Morning
              </Button>
              <Button
                variant={briefingType === 'evening' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBriefingType('evening')}
              >
                <Moon className="h-4 w-4 mr-1" />
                Evening
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {briefingItems.map((item) => (
            <div key={item.id} className="p-3 rounded-lg border bg-background/50 hover:bg-accent/5 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getItemIcon(item.type, item.trend)}
                  <h4 className="font-medium text-sm">{item.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge size="sm" className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                  {item.value && (
                    <div className="text-right">
                      <div className="font-semibold text-sm">{item.value}</div>
                      {item.change && (
                        <div className={`text-xs ${
                          item.trend === 'up' ? 'text-green-500' : 
                          item.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                        }`}>
                          {item.change}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{item.summary}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartBriefings;
