
import { ChartPoint, ChartDataset, ChartInsight, InsightType } from '../types';
import { getInsightTitle, getInsightDescription } from './insightTextUtils';

export const generateInsightForPoint = (
  type: InsightType, 
  point: ChartPoint,
  dataset: ChartDataset,
  pointId: string
): ChartInsight => {
  return {
    id: `insight-${Date.now()}`,
    type: type,
    title: getInsightTitle(type, point),
    description: getInsightDescription(type, point, dataset),
    timestamp: new Date(),
    chartPoints: [pointId],
    confident: Math.random() > 0.3, // Sometimes uncertain for demo purposes
  };
};

export const generateAnswerForQuestion = (question: string, dataset: ChartDataset): string => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('why') && lowerQuestion.includes('red')) {
    return 'The red color indicates a significant decrease or underperformance compared to targets or previous periods. This is used to draw attention to potential areas of concern that may require investigation or intervention.';
  }
  
  if (lowerQuestion.includes('compare') && lowerQuestion.includes('last year')) {
    return `Compared to the same period last year, current performance shows a ${Math.random() > 0.5 ? 'positive' : 'negative'} change of approximately ${(Math.random() * 15 + 5).toFixed(1)}%. This ${Math.random() > 0.5 ? 'exceeds' : 'falls below'} the expected growth rate of ${(Math.random() * 10).toFixed(1)}% that was projected in the annual forecast.`;
  }
  
  if (lowerQuestion.includes('spike') || lowerQuestion.includes('peak')) {
    return 'The unusual spike in the data was primarily caused by three factors: 1) A major product launch that occurred in that period, 2) Seasonal demand fluctuations that were stronger than usual, and 3) A temporary market disruption that diverted customers to our offerings. The combination of these factors created a significant but temporary increase in performance metrics.';
  }
  
  if (lowerQuestion.includes('trend')) {
    return `The overall trend shows ${Math.random() > 0.6 ? 'a positive growth trajectory' : 'a concerning downward pattern'} with an average change of ${(Math.random() * 8 + 2).toFixed(1)}% per period. This trend has been consistent for the past ${Math.floor(Math.random() * 5 + 3)} reporting periods and correlates strongly with ${Math.random() > 0.5 ? 'market expansion efforts' : 'seasonal business cycles'}.`;
  }
  
  // Default response for other questions
  return `Based on analysis of the ${dataset.title} data, ${Math.random() > 0.5 ? 'we can see a clear pattern emerging' : 'there appear to be several contributing factors'}. The most significant insight is that ${Math.random() > 0.5 ? 'performance tends to peak during specific periods' : 'there\'s a strong correlation between different variables in the dataset'}. This suggests that ${Math.random() > 0.5 ? 'strategic timing of initiatives could improve outcomes' : 'a more holistic approach may be beneficial for optimizing results'}.`;
};
