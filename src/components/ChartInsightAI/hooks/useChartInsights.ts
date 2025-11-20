
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChartDataset, ChartInsight, InsightType } from '../types';
import { generateInsightForPoint, generateAnswerForQuestion } from '../utils/insightGenerator';

export const useChartInsights = (initialDatasets: ChartDataset[]) => {
  const [datasets, setDatasets] = useState<ChartDataset[]>(initialDatasets);
  const [selectedDataset, setSelectedDataset] = useState<ChartDataset>(initialDatasets[0]);
  const [insights, setInsights] = useState<ChartInsight[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [activeInsight, setActiveInsight] = useState<ChartInsight | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  
  const { toast } = useToast();

  const handleDatasetChange = (datasetId: string) => {
    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset) {
      setSelectedDataset(dataset);
      setSelectedPoints([]);
      setActiveInsight(null);
      setIsPanelOpen(false);
    }
  };

  const handlePointClick = (pointId: string) => {
    // Toggle point selection
    if (selectedPoints.includes(pointId)) {
      setSelectedPoints(selectedPoints.filter(id => id !== pointId));
    } else {
      setSelectedPoints([...selectedPoints, pointId]);
      
      // Automatically generate insight if this is the first selected point
      if (selectedPoints.length === 0) {
        generateInsightForPointHandler(pointId);
      }
    }
  };

  const generateInsightForPointHandler = async (pointId: string) => {
    setIsGeneratingInsight(true);
    setIsPanelOpen(true);
    
    try {
      // In a real app, this would call an AI service to generate insights
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const point = selectedDataset.data.find(p => p.id === pointId);
      if (!point) return;
      
      const insightTypes: InsightType[] = ['explanation', 'comparison', 'trend', 'anomaly', 'prediction'];
      const randomType = insightTypes[Math.floor(Math.random() * insightTypes.length)];
      
      const newInsight = generateInsightForPoint(randomType, point, selectedDataset, pointId);
      
      setInsights([newInsight, ...insights]);
      setActiveInsight(newInsight);
      
    } catch (error) {
      console.error('Error generating insight:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate insight. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const handleQuestionSubmit = async (question: string) => {
    if (!question.trim()) return;
    
    setIsGeneratingInsight(true);
    setIsPanelOpen(true);
    
    try {
      // In a real app, this would call an AI service to answer the question
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a new insight from the question
      const randomType = Math.random() > 0.5 ? 'explanation' : 'comparison';
      
      const newInsight: ChartInsight = {
        id: `insight-${Date.now()}`,
        type: randomType as InsightType,
        title: `Answer: ${question}`,
        description: generateAnswerForQuestion(question, selectedDataset),
        timestamp: new Date(),
        chartPoints: selectedPoints.length > 0 ? selectedPoints : undefined,
        confident: Math.random() > 0.2,
      };
      
      setInsights([newInsight, ...insights]);
      setActiveInsight(newInsight);
      
      toast({
        title: 'Insight generated',
        description: 'Your question has been analyzed successfully.'
      });
      
    } catch (error) {
      console.error('Error answering question:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze your question. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const closeInsightPanel = () => {
    setIsPanelOpen(false);
    setActiveInsight(null);
  };

  return {
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
  };
};
