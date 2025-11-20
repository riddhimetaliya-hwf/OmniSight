
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ChartDataset } from '../../types';

interface PieChartComponentProps {
  dataset: ChartDataset;
  selectedPoints: string[];
  hoveredPoint: string | null;
  onPointClick: (pointId: string) => void;
  setHoveredPoint: (pointId: string | null) => void;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
  '#ec4899', '#ef4444', '#84cc16'
];

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  dataset,
  selectedPoints,
  hoveredPoint,
  onPointClick,
  setHoveredPoint
}) => {
  return (
    <PieChart>
      <Pie
        data={dataset.data}
        cx="50%"
        cy="50%"
        labelLine={true}
        outerRadius={100}
        fill="#8884d8"
        dataKey="y"
        nameKey="label"
        label={({ label }) => label}
        onClick={(prop) => onPointClick(prop.id)}
        onMouseOver={(prop) => setHoveredPoint(prop.id)}
        onMouseOut={() => setHoveredPoint(null)}
      >
        {dataset.data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={COLORS[index % COLORS.length]} 
            stroke={selectedPoints.includes(entry.id) ? 'white' : 'none'}
            strokeWidth={2}
            opacity={selectedPoints.includes(entry.id) || hoveredPoint === entry.id ? 1 : 0.8}
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartComponent;
