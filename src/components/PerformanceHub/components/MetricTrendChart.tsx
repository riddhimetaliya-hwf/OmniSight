
import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TimeFrame } from '../PerformanceHub';

interface MetricTrendChartProps {
  data: Array<{ date: string; value: number }>;
  timeFrame: TimeFrame;
}

const MetricTrendChart: React.FC<MetricTrendChartProps> = ({ data, timeFrame }) => {
  // Format the date based on timeframe
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    
    switch (timeFrame) {
      case 'day':
        return `${date.getHours()}:00`;
      case 'week':
        return date.toLocaleDateString(undefined, { weekday: 'short' });
      case 'month':
        return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      case 'quarter':
        return date.toLocaleDateString(undefined, { month: 'short' });
      default:
        return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fontSize: 10 }}
            tickMargin={5}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            hide 
            domain={['dataMin - 10', 'dataMax + 10']} 
          />
          <Tooltip 
            formatter={(value) => [value, 'Value']}
            labelFormatter={formatDate}
            contentStyle={{ fontSize: '12px', padding: '8px' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#8b5cf6" 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricTrendChart;
