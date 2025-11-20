
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeftRight, Calendar, Download, Filter } from 'lucide-react';

const HistoricalComparison: React.FC = () => {
  const [period, setPeriod] = useState('quarter');
  const [compareWith, setCompareWith] = useState('previous-year');
  const [viewType, setViewType] = useState('line');
  
  // Mock data for different time periods
  const currentData = [
    { month: 'Jan', sales: 4200, profit: 1050, customers: 350 },
    { month: 'Feb', sales: 4500, profit: 1125, customers: 370 },
    { month: 'Mar', sales: 4800, profit: 1200, customers: 400 },
    { month: 'Apr', sales: 5100, profit: 1275, customers: 420 },
    { month: 'May', sales: 5400, profit: 1350, customers: 450 },
    { month: 'Jun', sales: 5700, profit: 1425, customers: 480 }
  ];
  
  const previousYearData = [
    { month: 'Jan', sales: 3800, profit: 950, customers: 320 },
    { month: 'Feb', sales: 4000, profit: 1000, customers: 330 },
    { month: 'Mar', sales: 4100, profit: 1025, customers: 350 },
    { month: 'Apr', sales: 4300, profit: 1075, customers: 360 },
    { month: 'May', sales: 4600, profit: 1150, customers: 380 },
    { month: 'Jun', sales: 4800, profit: 1200, customers: 400 }
  ];
  
  const comparisonData = currentData.map((current, index) => {
    const previous = previousYearData[index];
    return {
      month: current.month,
      currentSales: current.sales,
      previousSales: previous.sales,
      currentProfit: current.profit,
      previousProfit: previous.profit,
      currentCustomers: current.customers,
      previousCustomers: previous.customers,
    };
  });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            Historical Comparison
          </CardTitle>
          <CardDescription>
            Compare current performance with historical data periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <SelectValue placeholder="Time Period" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={compareWith} onValueChange={setCompareWith}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4" />
                    <SelectValue placeholder="Compare With" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previous-period">Previous Period</SelectItem>
                  <SelectItem value="previous-year">Previous Year</SelectItem>
                  <SelectItem value="baseline">Baseline</SelectItem>
                  <SelectItem value="forecast">Forecast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <Tabs value={viewType} onValueChange={setViewType}>
              <TabsList>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
                <TabsTrigger value="side-by-side">Side-by-Side</TabsTrigger>
                <TabsTrigger value="difference">Difference</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {viewType === 'line' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="currentSales" name="Current Sales" stroke="#8884d8" />
                  <Line type="monotone" dataKey="previousSales" name="Previous Year Sales" stroke="#82ca9d" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {viewType === 'bar' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="currentSales" name="Current Sales" fill="#8884d8" />
                  <Bar dataKey="previousSales" name="Previous Year Sales" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {viewType === 'side-by-side' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-80 border rounded-lg p-4">
                <h3 className="font-medium text-center mb-2">Current Period</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" name="Sales" stroke="#8884d8" />
                    <Line type="monotone" dataKey="profit" name="Profit" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-80 border rounded-lg p-4">
                <h3 className="font-medium text-center mb-2">Previous Year</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={previousYearData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" name="Sales" stroke="#8884d8" />
                    <Line type="monotone" dataKey="profit" name="Profit" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {viewType === 'difference' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={comparisonData.map(item => ({
                    month: item.month,
                    sales: item.currentSales - item.previousSales,
                    profit: item.currentProfit - item.previousProfit,
                    customers: item.currentCustomers - item.previousCustomers
                  }))} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" name="Sales Difference" fill="#8884d8" />
                  <Bar dataKey="profit" name="Profit Difference" fill="#82ca9d" />
                  <Bar dataKey="customers" name="Customer Difference" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground mt-4">
            <p>* Comparisons are based on {compareWith === 'previous-year' ? 'same period last year' : 'previous time period'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricalComparison;
