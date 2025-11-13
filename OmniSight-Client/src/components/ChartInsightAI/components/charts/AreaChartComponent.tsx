
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ChartDataset } from '../../types';
import CustomizedDot from './CustomizedDot';

interface AreaChartComponentProps {
  dataset: ChartDataset;
  selectedPoints: string[];
  hoveredPoint: string | null;
  onPointClick: (pointId: string) => void;
  setHoveredPoint: (pointId: string | null) => void;
}

const AreaChartComponent: React.FC<AreaChartComponentProps> = ({
  dataset,
  selectedPoints,
  hoveredPoint,
  onPointClick,
  setHoveredPoint
}) => {
  return (
    <AreaChart data={dataset.data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="x" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area 
        type="monotone" 
        dataKey="y" 
        stroke="#3b82f6" 
        fill="#3b82f6" 
        fillOpacity={0.3}
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
    </AreaChart>
  );
};

export default AreaChartComponent;
