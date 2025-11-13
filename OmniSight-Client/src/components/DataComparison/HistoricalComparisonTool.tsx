
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface HistoricalComparisonToolProps {
  datasets?: {
    current: any[];
    previous: any[];
  };
}

export const HistoricalComparisonTool: React.FC<HistoricalComparisonToolProps> = ({ 
  datasets 
}) => {
  const [period, setPeriod] = useState("quarter");
  const [compareWith, setCompareWith] = useState("previous-year");
  const [viewType, setViewType] = useState("line");
  const [metricToCompare, setMetricToCompare] = useState("sales");
  const [periodStart, setPeriodStart] = useState<Date | undefined>(new Date());
  const [periodEnd, setPeriodEnd] = useState<Date | undefined>(undefined);
  const [comparisonStart, setComparisonStart] = useState<Date | undefined>(undefined);
  const [comparisonEnd, setComparisonEnd] = useState<Date | undefined>(undefined);
  
  // Sample data for demonstration
  const currentData = datasets?.current || [
    { month: "Jan", sales: 4200, profit: 1050, customers: 350 },
    { month: "Feb", sales: 4500, profit: 1125, customers: 370 },
    { month: "Mar", sales: 4800, profit: 1200, customers: 400 },
    { month: "Apr", sales: 5100, profit: 1275, customers: 420 },
    { month: "May", sales: 5400, profit: 1350, customers: 450 },
    { month: "Jun", sales: 5700, profit: 1425, customers: 480 },
  ];
  
  const previousData = datasets?.previous || [
    { month: "Jan", sales: 3800, profit: 950, customers: 320 },
    { month: "Feb", sales: 4000, profit: 1000, customers: 330 },
    { month: "Mar", sales: 4100, profit: 1025, customers: 350 },
    { month: "Apr", sales: 4300, profit: 1075, customers: 360 },
    { month: "May", sales: 4600, profit: 1150, customers: 380 },
    { month: "Jun", sales: 4800, profit: 1200, customers: 400 },
  ];
  
  // Calculate comparison data
  const comparisonData = currentData.map((current, index) => {
    const previous = previousData[index];
    return {
      month: current.month,
      [`current${metricToCompare.charAt(0).toUpperCase() + metricToCompare.slice(1)}`]: current[metricToCompare],
      [`previous${metricToCompare.charAt(0).toUpperCase() + metricToCompare.slice(1)}`]: previous[metricToCompare],
      difference: current[metricToCompare] - previous[metricToCompare],
      percentChange: (((current[metricToCompare] - previous[metricToCompare]) / previous[metricToCompare]) * 100).toFixed(1),
    };
  });
  
  // Calculate summary statistics
  const summaryStats = {
    currentTotal: currentData.reduce((sum, item) => sum + item[metricToCompare], 0),
    previousTotal: previousData.reduce((sum, item) => sum + item[metricToCompare], 0),
    averageChange: comparisonData.reduce((sum, item) => sum + parseFloat(item.percentChange), 0) / comparisonData.length,
    maxIncrease: Math.max(...comparisonData.map(item => parseFloat(item.percentChange))),
    maxDecrease: Math.min(...comparisonData.map(item => parseFloat(item.percentChange))),
  };
  
  // Handle export
  const handleExport = (format: string) => {
    console.log(`Exporting comparison in ${format} format`);
    // In a real implementation, this would generate and download the file
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-primary" />
          Historical Comparison
        </CardTitle>
        <CardDescription>
          Compare data across different time periods to identify trends and patterns
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Comparison Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
              {period === "custom" && (
                <div className="flex gap-2 mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left text-xs"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {periodStart ? format(periodStart, "PP") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={periodStart}
                        onSelect={setPeriodStart}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left text-xs"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {periodEnd ? format(periodEnd, "PP") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={periodEnd}
                        onSelect={setPeriodEnd}
                        initialFocus
                        disabled={(date) => periodStart ? date < periodStart : false}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Compare With</label>
              <Select value={compareWith} onValueChange={setCompareWith}>
                <SelectTrigger>
                  <SelectValue placeholder="Select comparison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previous-period">Previous Period</SelectItem>
                  <SelectItem value="previous-year">Same Period Last Year</SelectItem>
                  <SelectItem value="baseline">Baseline</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
              {compareWith === "custom" && (
                <div className="flex gap-2 mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left text-xs"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {comparisonStart ? format(comparisonStart, "PP") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={comparisonStart}
                        onSelect={setComparisonStart}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left text-xs"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {comparisonEnd ? format(comparisonEnd, "PP") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={comparisonEnd}
                        onSelect={setComparisonEnd}
                        initialFocus
                        disabled={(date) => comparisonStart ? date < comparisonStart : false}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Metric</label>
              <Select value={metricToCompare} onValueChange={setMetricToCompare}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="profit">Profit</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex justify-end mt-2">
                <Select defaultValue="pdf" onValueChange={handleExport}>
                  <SelectTrigger className="w-[110px]">
                    <Download className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Export" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Difference</p>
                  <div className="text-2xl font-bold">
                    {(summaryStats.currentTotal - summaryStats.previousTotal).toLocaleString()}
                    <span className="text-xs ml-1">
                      ({((summaryStats.currentTotal - summaryStats.previousTotal) / summaryStats.previousTotal * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Average Change</p>
                  <div className="text-2xl font-bold">
                    {summaryStats.averageChange.toFixed(1)}%
                    <Badge className="ml-2" variant={summaryStats.averageChange > 0 ? "default" : "destructive"}>
                      {summaryStats.averageChange > 0 ? "Up" : "Down"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {summaryStats.maxIncrease > Math.abs(summaryStats.maxDecrease) ? "Max Increase" : "Max Decrease"}
                  </p>
                  <div className="text-2xl font-bold">
                    {summaryStats.maxIncrease > Math.abs(summaryStats.maxDecrease) 
                      ? `+${summaryStats.maxIncrease}%` 
                      : `${summaryStats.maxDecrease}%`
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Visualization Tabs */}
          <div>
            <Tabs defaultValue="line" onValueChange={setViewType}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
                <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
              
              <TabsContent value="line" className="mt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={`current${metricToCompare.charAt(0).toUpperCase() + metricToCompare.slice(1)}`} 
                        name={`Current ${metricToCompare}`} 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={`previous${metricToCompare.charAt(0).toUpperCase() + metricToCompare.slice(1)}`} 
                        name={`Previous ${metricToCompare}`} 
                        stroke="#64748b" 
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="bar" className="mt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey={`current${metricToCompare.charAt(0).toUpperCase() + metricToCompare.slice(1)}`} 
                        name={`Current ${metricToCompare}`} 
                        fill="#3b82f6" 
                      />
                      <Bar 
                        dataKey={`previous${metricToCompare.charAt(0).toUpperCase() + metricToCompare.slice(1)}`} 
                        name={`Previous ${metricToCompare}`} 
                        fill="#64748b" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="side-by-side" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-64 border rounded-lg p-4">
                    <h3 className="font-medium text-center mb-2">Current Period</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey={metricToCompare} 
                          name={metricToCompare} 
                          stroke="#3b82f6" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-64 border rounded-lg p-4">
                    <h3 className="font-medium text-center mb-2">Comparison Period</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <LineChart data={previousData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey={metricToCompare} 
                          name={metricToCompare} 
                          stroke="#64748b" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="table" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-4 py-2 text-left">Period</th>
                        <th className="px-4 py-2 text-right">Current</th>
                        <th className="px-4 py-2 text-right">Previous</th>
                        <th className="px-4 py-2 text-right">Difference</th>
                        <th className="px-4 py-2 text-right">% Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((data, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{data.month}</td>
                          <td className="px-4 py-2 text-right">
                            {data[`current${metricToCompare.charAt(0).toUpperCase() + metricToCompare.slice(1)}`].toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {data[`previous${metricToCompare.charAt(0).toUpperCase() + metricToCompare.slice(1)}`].toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {data.difference > 0 ? '+' : ''}{data.difference.toLocaleString()}
                          </td>
                          <td className={`px-4 py-2 text-right ${parseFloat(data.percentChange) > 0 ? 'text-green-600' : parseFloat(data.percentChange) < 0 ? 'text-red-600' : ''}`}>
                            {parseFloat(data.percentChange) > 0 ? '+' : ''}{data.percentChange}%
                          </td>
                        </tr>
                      ))}
                      <tr className="font-medium border-t-2">
                        <td className="px-4 py-2">Total</td>
                        <td className="px-4 py-2 text-right">{summaryStats.currentTotal.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">{summaryStats.previousTotal.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">
                          {summaryStats.currentTotal - summaryStats.previousTotal > 0 ? '+' : ''}
                          {(summaryStats.currentTotal - summaryStats.previousTotal).toLocaleString()}
                        </td>
                        <td className={`px-4 py-2 text-right ${summaryStats.currentTotal - summaryStats.previousTotal > 0 ? 'text-green-600' : summaryStats.currentTotal - summaryStats.previousTotal < 0 ? 'text-red-600' : ''}`}>
                          {((summaryStats.currentTotal - summaryStats.previousTotal) / summaryStats.previousTotal * 100).toFixed(1) > '0' ? '+' : ''}
                          {((summaryStats.currentTotal - summaryStats.previousTotal) / summaryStats.previousTotal * 100).toFixed(1)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Insights */}
          <div className="bg-muted/40 p-4 rounded-lg border">
            <h3 className="font-medium mb-2">Key Insights</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Badge variant={summaryStats.averageChange > 0 ? "default" : "destructive"} className="mt-0.5">
                  {summaryStats.averageChange > 0 ? "Growth" : "Decline"}
                </Badge>
                <span>
                  {metricToCompare.charAt(0).toUpperCase() + metricToCompare.slice(1)} {summaryStats.averageChange > 0 ? 'increased' : 'decreased'} by an average of {Math.abs(summaryStats.averageChange).toFixed(1)}% compared to {compareWith === 'previous-year' ? 'the same period last year' : 'the previous period'}.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">Trend</Badge>
                <span>
                  The highest {summaryStats.maxIncrease > Math.abs(summaryStats.maxDecrease) ? 'growth' : 'decline'} was observed in {comparisonData.find(item => 
                    summaryStats.maxIncrease > Math.abs(summaryStats.maxDecrease) 
                      ? parseFloat(item.percentChange) === summaryStats.maxIncrease
                      : parseFloat(item.percentChange) === summaryStats.maxDecrease
                  )?.month || ''}, with a {summaryStats.maxIncrease > Math.abs(summaryStats.maxDecrease) ? '+' : ''}{summaryStats.maxIncrease > Math.abs(summaryStats.maxDecrease) ? summaryStats.maxIncrease : summaryStats.maxDecrease}% change.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalComparisonTool;
