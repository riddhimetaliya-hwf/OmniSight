
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from 'recharts';
import { ChartDataset } from '../../types';

interface BarChartComponentProps {
  dataset: ChartDataset;
  selectedPoints: string[];
  hoveredPoint: string | null;
  onPointClick: (pointId: string) => void;
  setHoveredPoint: (pointId: string | null) => void;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  dataset,
  selectedPoints,
  hoveredPoint,
  onPointClick,
  setHoveredPoint
}) => {
  return (
    <BarChart data={dataset.data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="x" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar 
        dataKey="y" 
        fill="#3b82f6"
        onClick={(prop) => onPointClick(prop.id)}
        onMouseOver={(prop) => setHoveredPoint(prop.id)}
        onMouseOut={() => setHoveredPoint(null)}
      >
        {dataset.data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`}
            fill={selectedPoints.includes(entry.id) ? '#3b82f6' : 
                  hoveredPoint === entry.id ? '#64748b' : '#3b82f6'}
            opacity={selectedPoints.includes(entry.id) || hoveredPoint === entry.id ? 1 : 0.6}
            stroke={selectedPoints.includes(entry.id) ? 'white' : 'none'}
            strokeWidth={2}
            cursor="pointer"
          />
        ))}
      </Bar>
    </BarChart>
  );
};

export default BarChartComponent;
