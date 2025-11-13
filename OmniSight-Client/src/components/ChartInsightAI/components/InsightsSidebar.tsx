
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageCircleQuestion, X, Search } from 'lucide-react';
import { ChartDataset, ChartInsight } from '../types';
import InsightPanel from '../InsightPanel';
import InsightsList from '../InsightsList';

interface InsightsSidebarProps {
  isPanelOpen: boolean;
  activeInsight: ChartInsight | null;
  insights: ChartInsight[];
  dataset: ChartDataset;
  isGeneratingInsight: boolean;
  onClose: () => void;
  onInsightClick: (insight: ChartInsight) => void;
}

const InsightsSidebar: React.FC<InsightsSidebarProps> = ({
  isPanelOpen,
  activeInsight,
  insights,
  dataset,
  isGeneratingInsight,
  onClose,
  onInsightClick
}) => {
  return (
    <Card className={`h-[600px] transition-all ${isPanelOpen ? 'block' : 'hidden md:block'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <MessageCircleQuestion className="mr-2 h-5 w-5 text-primary" />
            Chart Insights
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 md:hidden" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="h-[calc(600px-80px)] px-3">
        <Tabs defaultValue="active" className="h-full">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="h-[calc(100%-40px)] overflow-hidden">
            {activeInsight ? (
              <InsightPanel 
                insight={activeInsight} 
                dataset={dataset}
                isLoading={isGeneratingInsight}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                <Search className="h-12 w-12 mb-4 opacity-20" />
                <h3 className="font-medium text-lg mb-1">No active insight</h3>
                <p className="text-sm">
                  Click on a chart point or ask a question to get insights
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="h-[calc(100%-40px)] overflow-hidden">
            <InsightsList 
              insights={insights} 
              activeInsight={activeInsight}
              onInsightClick={onInsightClick}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InsightsSidebar;
