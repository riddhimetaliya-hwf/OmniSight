
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOmniCommand } from '../context/OmniCommandContext';
import { useCopilotContext } from '../../ExecCopilot/context/CopilotContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Sparkles, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const AlertsPanel: React.FC = () => {
  const { recommendations, insights } = useCopilotContext();
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Alerts & Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="recommendations">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommendations" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="mt-4 space-y-4">
            {recommendations.length > 0 ? (
              recommendations.slice(0, 5).map((recommendation, index) => (
                <React.Fragment key={recommendation.id}>
                  {index > 0 && <Separator />}
                  <div className="py-2 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium">{recommendation.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={getSeverityColor(recommendation.impact)}
                      >
                        {recommendation.impact}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{recommendation.description}</p>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                        <Check className="h-3 w-3" />
                        Acknowledge
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                        <ExternalLink className="h-3 w-3" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No recommendations available
              </div>
            )}
            
            {recommendations.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="link" size="sm">
                  View all {recommendations.length} recommendations
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="insights" className="mt-4 space-y-4">
            {insights.length > 0 ? (
              insights.slice(0, 5).map((insight, index) => (
                <React.Fragment key={insight.id}>
                  {index > 0 && <Separator />}
                  <div className="py-2 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={getSeverityColor(insight.importance)}
                      >
                        {insight.importance}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Explore
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No insights available
              </div>
            )}
            
            {insights.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="link" size="sm">
                  View all {insights.length} insights
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
