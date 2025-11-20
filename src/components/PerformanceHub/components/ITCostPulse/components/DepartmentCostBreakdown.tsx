
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { Users } from 'lucide-react';
import { Department } from '../types';
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface DepartmentCostBreakdownProps {
  departments: Department[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#9467BD'];

const DepartmentCostBreakdown: React.FC<DepartmentCostBreakdownProps> = ({ departments }) => {
  const data = departments.map(dept => ({
    name: dept.name,
    value: dept.actualSpend,
    budget: dept.budget,
    variance: dept.actualSpend - dept.budget
  }));

  const config = {
    primary: { theme: { light: '#0088FE', dark: '#0088FE' } },
    secondary: { theme: { light: '#00C49F', dark: '#00C49F' } },
    accent: { theme: { light: '#FFBB28', dark: '#FFBB28' } },
    muted: { theme: { light: '#FF8042', dark: '#FF8042' } },
    info: { theme: { light: '#8884D8', dark: '#8884D8' } },
    success: { theme: { light: '#9467BD', dark: '#9467BD' } },
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Users className="mr-2 h-5 w-5 text-muted-foreground" />
          Department Cost Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={config}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          {departments.map((dept) => (
            <div key={dept.id} className="flex justify-between items-center text-sm p-2 border-b">
              <span>{dept.name}</span>
              <div className="flex flex-col items-end">
                <span className="font-medium">${dept.actualSpend.toLocaleString()}</span>
                <span className={`text-xs ${dept.actualSpend > dept.budget ? 'text-red-500' : 'text-green-500'}`}>
                  {dept.actualSpend > dept.budget ? 'Over budget' : 'Under budget'} by ${Math.abs(dept.actualSpend - dept.budget).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded shadow-md">
        <p className="font-bold">{data.name}</p>
        <p>Actual: ${data.value.toLocaleString()}</p>
        <p>Budget: ${data.budget.toLocaleString()}</p>
        <p className={data.variance > 0 ? 'text-red-500' : 'text-green-500'}>
          {data.variance > 0 ? 'Over budget' : 'Under budget'} by ${Math.abs(data.variance).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default DepartmentCostBreakdown;
