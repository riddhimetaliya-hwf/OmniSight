
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { BudgetForecast } from '../types';

interface CostOverviewCardProps {
  totalCost: number;
  totalBudget: number;
  percentChange: number;
  forecastData: BudgetForecast[];
}

const CostOverviewCard: React.FC<CostOverviewCardProps> = ({ 
  totalCost, 
  totalBudget, 
  percentChange,
  forecastData
}) => {
  const isOverBudget = totalCost > totalBudget;
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(totalCost);
  
  const formattedBudget = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(totalBudget);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
          Total IT Expenditure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-baseline mb-4">
          <div>
            <span className="text-3xl font-bold">{formattedTotal}</span>
            <span className="text-sm text-muted-foreground ml-2">vs {formattedBudget} budget</span>
          </div>
          <div className={`flex items-center ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
            {percentChange > 0 ? 
              <TrendingUp className="h-4 w-4 mr-1" /> : 
              <TrendingDown className="h-4 w-4 mr-1" />
            }
            <span className="font-medium">{Math.abs(percentChange).toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={forecastData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar name="Projected" dataKey="projected" fill="#8884d8" opacity={0.7} />
              <Bar name="Actual" dataKey="actual" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          {isOverBudget ? 
            `Currently ${((totalCost/totalBudget - 1) * 100).toFixed(1)}% over allocated budget` : 
            `Currently ${((1 - totalCost/totalBudget) * 100).toFixed(1)}% under allocated budget`
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default CostOverviewCard;
