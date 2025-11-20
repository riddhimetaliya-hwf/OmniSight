
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { mockChartData } from './mockData';
import InteractiveChart from './InteractiveChart';
import QuestionForm from './QuestionForm';
import ChartHeader from './components/ChartHeader';
import InsightsSidebar from './components/InsightsSidebar';
import { useChartInsights } from './hooks/useChartInsights';

const ChartInsightAI: React.FC = () => {
  const {
    datasets,
    selectedDataset,
    insights,
    selectedPoints,
    activeInsight,
    isPanelOpen,
    isGeneratingInsight,
    handleDatasetChange,
    handlePointClick,
    handleQuestionSubmit,
    closeInsightPanel,
    setActiveInsight,
    setIsPanelOpen
  } = useChartInsights(mockChartData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Main Chart Area */}
      <Card className="md:col-span-2 lg:col-span-3 shadow-md">
        <CardHeader>
          <ChartHeader 
            selectedDataset={selectedDataset}
            datasets={datasets}
            hasActiveInsight={activeInsight !== null}
            onDatasetChange={handleDatasetChange}
            onOpenInsightPanel={() => setIsPanelOpen(true)}
          />
        </CardHeader>
        
        <CardContent>
          <InteractiveChart 
            dataset={selectedDataset}
            selectedPoints={selectedPoints}
            onPointClick={handlePointClick}
          />
          
          <QuestionForm 
            onSubmit={handleQuestionSubmit} 
            isLoading={isGeneratingInsight} 
          />
        </CardContent>
      </Card>
      
      {/* Insights Panel (sidebar on desktop, bottom panel on mobile) */}
      <InsightsSidebar 
        isPanelOpen={isPanelOpen}
        activeInsight={activeInsight}
        insights={insights}
        dataset={selectedDataset}
        isGeneratingInsight={isGeneratingInsight}
        onClose={closeInsightPanel}
        onInsightClick={(insight) => {
          setActiveInsight(insight);
          setIsPanelOpen(true);
        }}
      />
    </div>
  );
};

export default ChartInsightAI;
