
import React, { useState } from 'react';
import { ResponsiveContainer } from 'recharts';
import { ChartDataset } from './types';
import {
  LineChartComponent,
  BarChartComponent,
  AreaChartComponent,
  PieChartComponent
} from './components/charts';

interface InteractiveChartProps {
  dataset: ChartDataset;
  selectedPoints: string[];
  onPointClick: (pointId: string) => void;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({ 
  dataset, 
  selectedPoints, 
  onPointClick 
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const renderChart = () => {
    const props = {
      dataset,
      selectedPoints,
      hoveredPoint,
      onPointClick,
      setHoveredPoint
    };

    switch (dataset.type) {
      case 'line':
        return <LineChartComponent {...props} />;
      case 'bar':
        return <BarChartComponent {...props} />;
      case 'area':
        return <AreaChartComponent {...props} />;
      case 'pie':
        return <PieChartComponent {...props} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default InteractiveChart;
