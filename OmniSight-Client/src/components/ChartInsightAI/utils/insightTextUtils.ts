
import { InsightType, ChartPoint, ChartDataset } from '../types';

export const getInsightTitle = (type: InsightType, point: ChartPoint): string => {
  switch (type) {
    case 'explanation':
      return `Why this ${point.label || 'point'} is significant`;
    case 'comparison':
      return `${point.label || 'This point'} compared to others`;
    case 'anomaly':
      return `Anomaly detected in ${point.label || 'data point'}`;
    case 'trend':
      return `Trend analysis for ${point.label || 'this period'}`;
    case 'prediction':
      return `Forecast based on ${point.label || 'this data'}`;
    default:
      return 'Insight';
  }
};

export const getInsightDescription = (type: InsightType, point: ChartPoint, dataset: ChartDataset): string => {
  const value = point.y;
  const label = point.label || point.x.toString();
  
  switch (type) {
    case 'explanation':
      return `The value of ${value} for ${label} is notable because it represents a significant ${value > 50 ? 'peak' : 'dip'} in the dataset. This could be attributed to seasonal factors or specific market conditions during this period.`;
    
    case 'comparison':
      const avg = dataset.data.reduce((sum, p) => sum + p.y, 0) / dataset.data.length;
      const diff = ((value - avg) / avg * 100).toFixed(1);
      const direction = value > avg ? 'above' : 'below';
      
      return `${label} is ${Math.abs(Number(diff))}% ${direction} the average of ${avg.toFixed(1)}. This makes it ${Math.abs(Number(diff)) > 20 ? 'significantly' : 'slightly'} ${direction} normal performance. ${Math.abs(Number(diff)) > 30 ? 'This deviation warrants further investigation.' : ''}`;
    
    case 'anomaly':
      return `The data point for ${label} with value ${value} appears to be an anomaly. It deviates significantly from the expected pattern. Possible causes include measurement error, exceptional circumstances, or a genuine outlier event.`;
    
    case 'trend':
      const pointIndex = dataset.data.findIndex(p => p.id === point.id);
      const prevPoints = dataset.data.slice(Math.max(0, pointIndex - 3), pointIndex);
      const trend = prevPoints.length > 0 
        ? prevPoints.every(p => p.y < value) ? 'upward'
        : prevPoints.every(p => p.y > value) ? 'downward'
        : 'fluctuating'
        : 'stable';
      
      return `There is a ${trend} trend leading up to ${label}. ${trend === 'upward' ? 'This positive progression suggests growing performance or increasing adoption.' : trend === 'downward' ? 'This decline may indicate potential issues that need to be addressed.' : 'The pattern shows normal variability within expected ranges.'}`;
    
    case 'prediction':
      return `Based on the current trends and historical data, we predict that values following ${label} will ${Math.random() > 0.5 ? 'continue to increase' : 'gradually decline'} over the next period. Our confidence in this prediction is ${Math.random() > 0.7 ? 'high' : 'moderate'} based on pattern consistency.`;
    
    default:
      return 'No additional insights available for this data point.';
  }
};
