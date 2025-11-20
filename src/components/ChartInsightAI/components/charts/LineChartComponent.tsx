
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceDot 
} from 'recharts';
import { ChartDataset } from '../../types';
import CustomizedDot from './CustomizedDot';

interface LineChartComponentProps {
  dataset: ChartDataset;
  selectedPoints: string[];
  hoveredPoint: string | null;
  onPointClick: (pointId: string) => void;
  setHoveredPoint: (pointId: string | null) => void;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  dataset,
  selectedPoints,
  hoveredPoint,
  onPointClick,
  setHoveredPoint
}) => {
  return (
    <LineChart data={dataset.data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="x" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line 
        type="monotone" 
        dataKey="y" 
        stroke="#3b82f6" 
        activeDot={{ 
          onClick: (prop: any) => onPointClick(prop.payload.id),
          onMouseOver: (prop: any) => setHoveredPoint(prop.payload.id),
          onMouseOut: () => setHoveredPoint(null)
        }}
        dot={(props: any) => (
          <CustomizedDot 
            {...props} 
            selected={selectedPoints.includes(props.payload.id)}
            isHovered={hoveredPoint === props.payload.id}
            onClick={onPointClick}
          />
        )}
      />
      {selectedPoints.map(pointId => {
        const point = dataset.data.find(p => p.id === pointId);
        if (!point) return null;
        
        return (
          <ReferenceDot 
            key={pointId}
            x={point.x} 
            y={point.y} 
            r={8}
            fill="#3b82f6"
            stroke="white"
          />
        );
      })}
    </LineChart>
  );
};

export default LineChartComponent;
