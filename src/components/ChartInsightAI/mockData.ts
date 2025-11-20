
import { v4 as uuidv4 } from 'uuid';
import { ChartDataset } from './types';

// Create random data for the charts
const generateLineData = (count: number, name: string) => {
  const data = [];
  let value = Math.floor(Math.random() * 50) + 30;
  
  for (let i = 0; i < count; i++) {
    // Create slight random variations with occasional spikes/dips
    if (i % 5 === 0) {
      value = value + Math.floor(Math.random() * 30) - 15;
    } else {
      value = value + Math.floor(Math.random() * 10) - 5;
    }
    
    // Ensure value stays in a reasonable range
    value = Math.max(10, Math.min(100, value));
    
    data.push({
      id: uuidv4(),
      x: `${name} ${i+1}`,
      y: value,
      label: `${name} ${i+1}`,
    });
  }
  
  return data;
};

const generateMonthlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [];
  
  for (let i = 0; i < months.length; i++) {
    const value = Math.floor(Math.random() * 70) + 30;
    data.push({
      id: uuidv4(),
      x: months[i],
      y: value,
      label: months[i],
    });
  }
  
  return data;
};

const generateQuarterlyData = () => {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const data = [];
  
  for (let i = 0; i < quarters.length; i++) {
    const value = Math.floor(Math.random() * 70) + 30;
    data.push({
      id: uuidv4(),
      x: quarters[i],
      y: value,
      label: quarters[i],
    });
  }
  
  return data;
};

const generateCategoryData = () => {
  const categories = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
  const data = [];
  
  for (let i = 0; i < categories.length; i++) {
    const value = Math.floor(Math.random() * 70) + 30;
    data.push({
      id: uuidv4(),
      x: categories[i],
      y: value,
      label: categories[i],
    });
  }
  
  return data;
};

export const mockChartData: ChartDataset[] = [
  {
    id: 'monthly-sales',
    title: 'Monthly Sales',
    type: 'line',
    data: generateMonthlyData(),
  },
  {
    id: 'quarterly-revenue',
    title: 'Quarterly Revenue',
    type: 'bar',
    data: generateQuarterlyData(),
  },
  {
    id: 'product-distribution',
    title: 'Product Distribution',
    type: 'pie',
    data: generateCategoryData(),
  },
  {
    id: 'customer-activity',
    title: 'Customer Activity',
    type: 'area',
    data: generateLineData(12, 'Week'),
  },
];
