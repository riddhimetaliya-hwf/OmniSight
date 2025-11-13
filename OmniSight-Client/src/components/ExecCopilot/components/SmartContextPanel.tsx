
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Clock, 
  Users, 
  Target, 
  Calendar,
  TrendingUp,
  Building,
  Globe,
  Briefcase,
  History,
  Settings
} from 'lucide-react';
import { ConversationContext } from '../types';

interface SmartContextPanelProps {
  context: ConversationContext;
  onContextUpdate: (context: Partial<ConversationContext>) => void;
}

const SmartContextPanel: React.FC<SmartContextPanelProps> = ({
  context,
  onContextUpdate
}) => {
  const [activeTab, setActiveTab] = useState('session');

  const updateBusinessContext = (updates: any) => {
    onContextUpdate({
      businessContext: {
        ...context.businessContext,
        ...updates
      }
    });
  };

  const addFocus = (focus: string) => {
    if (!context.currentFocus.includes(focus)) {
      onContextUpdate({
        currentFocus: [...context.currentFocus, focus]
      });
    }
  };

  const removeFocus = (focus: string) => {
    onContextUpdate({
      currentFocus: context.currentFocus.filter(f => f !== focus)
    });
  };

  const focusAreas = [
    'Revenue Growth', 'Cost Optimization', 'Market Expansion', 
    'Risk Management', 'Team Performance', 'Innovation',
    'Customer Retention', 'Operational Efficiency', 'Strategic Planning'
  ];

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Smart Context Awareness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="session">Session</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="session" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Session ID</span>
                  <Badge variant="outline" className="text-xs">
                    {context.sessionId.split('-')[1]}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conversation Length</span>
                  <span className="text-sm text-muted-foreground">
                    {context.history.length} queries
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Current Focus Areas</span>
                  <div className="flex flex-wrap gap-2">
                    {context.currentFocus.map((focus) => (
                      <Badge 
                        key={focus} 
                        variant="default" 
                        className="text-xs cursor-pointer"
                        onClick={() => removeFocus(focus)}
                      >
                        {focus} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {focusAreas
                      .filter(area => !context.currentFocus.includes(area))
                      .slice(0, 3)
                      .map((area) => (
                      <Button
                        key={area}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => addFocus(area)}
                      >
                        + {area}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="business" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Current Quarter
                  </span>
                  <Badge variant="outline">
                    {context.businessContext.quarter}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Role
                  </span>
                  <Badge variant="default">
                    {context.businessContext.role}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Strategic Priorities
                  </span>
                  <div className="space-y-1">
                    {context.businessContext.priorities.map((priority: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {priority}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">User Preferences</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize your AI assistant's behavior and responses
                </p>
                <Button variant="outline">
                  Configure Preferences
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Conversation History */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-500" />
            Recent Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {context.history.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                No conversation history yet. Start by asking a question!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {context.history.slice(-3).map((query) => (
                <div key={query.id} className="p-2 rounded border bg-background/50">
                  <p className="text-sm truncate">{query.text}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(query.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartContextPanel;
