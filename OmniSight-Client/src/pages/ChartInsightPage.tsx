
import React from 'react';
import { ChartInsightAI } from '@/components/ChartInsightAI';

const ChartInsightPage: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-medium mb-6">Chart Insights AI</h1>
      <ChartInsightAI />
    </div>
  );
};

export default ChartInsightPage;
