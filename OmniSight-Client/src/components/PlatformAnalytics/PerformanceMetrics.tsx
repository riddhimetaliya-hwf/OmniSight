
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, Calendar, Users, Clock, Activity, Database, PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon } from 'lucide-react';

// Mock data
const performanceData = [
  { date: '2023-05-01', loadTime: 1.2, apiResponseTime: 0.8, renderTime: 0.3, totalRequests: 5230, errorRate: 0.2 },
  { date: '2023-05-02', loadTime: 1.3, apiResponseTime: 0.9, renderTime: 0.3, totalRequests: 5150, errorRate: 0.1 },
  { date: '2023-05-03', loadTime: 1.1, apiResponseTime: 0.7, renderTime: 0.4, totalRequests: 5300, errorRate: 0.3 },
  { date: '2023-05-04', loadTime: 1.5, apiResponseTime: 1.1, renderTime: 0.4, totalRequests: 5400, errorRate: 0.5 },
  { date: '2023-05-05', loadTime: 1.4, apiResponseTime: 1.0, renderTime: 0.3, totalRequests: 5600, errorRate: 0.2 },
  { date: '2023-05-06', loadTime: 1.2, apiResponseTime: 0.8, renderTime: 0.3, totalRequests: 5500, errorRate: 0.3 },
  { date: '2023-05-07', loadTime: 1.1, apiResponseTime: 0.7, renderTime: 0.2, totalRequests: 5250, errorRate: 0.1 },
  { date: '2023-05-08', loadTime: 1.0, apiResponseTime: 0.6, renderTime: 0.3, totalRequests: 5100, errorRate: 0.1 },
  { date: '2023-05-09', loadTime: 1.2, apiResponseTime: 0.7, renderTime: 0.2, totalRequests: 5350, errorRate: 0.2 },
  { date: '2023-05-10', loadTime: 1.3, apiResponseTime: 0.8, renderTime: 0.3, totalRequests: 5400, errorRate: 0.3 },
  { date: '2023-05-11', loadTime: 1.2, apiResponseTime: 0.7, renderTime: 0.3, totalRequests: 5450, errorRate: 0.2 },
  { date: '2023-05-12', loadTime: 1.4, apiResponseTime: 0.9, renderTime: 0.4, totalRequests: 5500, errorRate: 0.4 },
  { date: '2023-05-13', loadTime: 1.3, apiResponseTime: 0.8, renderTime: 0.3, totalRequests: 5550, errorRate: 0.3 },
  { date: '2023-05-14', loadTime: 1.1, apiResponseTime: 0.7, renderTime: 0.2, totalRequests: 5300, errorRate: 0.1 },
];

const userActivityData = [
  { name: 'Dashboard', value: 35 },
  { name: 'Reports', value: 25 },
  { name: 'Analytics', value: 20 },
  { name: 'Workflows', value: 15 },
  { name: 'Settings', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const usageByDepartmentData = [
  { department: 'Sales', users: 45, activeUsers: 38, sessions: 420 },
  { department: 'Marketing', users: 32, activeUsers: 28, sessions: 350 },
  { department: 'Operations', users: 28, activeUsers: 22, sessions: 280 },
  { department: 'Finance', users: 25, activeUsers: 20, sessions: 240 },
  { department: 'HR', users: 18, activeUsers: 12, sessions: 150 },
  { department: 'IT', users: 15, activeUsers: 14, sessions: 200 },
  { department: 'Executive', users: 8, activeUsers: 7, sessions: 100 },
];

interface PerformanceMetricsProps {
  isAdmin?: boolean;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ isAdmin = true }) => {
  const [timeRange, setTimeRange] = useState('2w');
  const [chartType, setChartType] = useState('line');
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Platform Performance</h2>
          <p className="text-muted-foreground">Monitor system performance and usage metrics</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="1w">Last week</SelectItem>
              <SelectItem value="2w">Last 2 weeks</SelectItem>
              <SelectItem value="1m">Last month</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Performance metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Page Load Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">1.23s</div>
              <div className="text-xs text-green-500 flex items-center">
                -0.12s
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="m6 9 6-6 6 6" />
                  <path d="M12 3v18" />
                </svg>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">vs previous period</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">API Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">0.78s</div>
              <div className="text-xs text-green-500 flex items-center">
                -0.05s
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="m6 9 6-6 6 6" />
                  <path d="M12 3v18" />
                </svg>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">vs previous period</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">142</div>
              <div className="text-xs text-green-500 flex items-center">
                +12
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="m6 9 6-6 6 6" />
                  <path d="M12 3v18" />
                </svg>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">vs previous period</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">0.2%</div>
              <div className="text-xs text-green-500 flex items-center">
                -0.1%
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="m6 9 6-6 6 6" />
                  <path d="M12 3v18" />
                </svg>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">vs previous period</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usage
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data & Storage
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle>Performance Over Time</CardTitle>
                  <CardDescription>
                    System performance metrics for the selected period
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line" className="flex items-center gap-2">
                        <LineChartIcon className="h-4 w-4" />
                        Line Chart
                      </SelectItem>
                      <SelectItem value="bar" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Bar Chart
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart
                      data={performanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)}s`, ``]}
                        labelFormatter={(label) => `Date: ${formatDate(label)}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="loadTime"
                        name="Page Load Time"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="apiResponseTime"
                        name="API Response Time"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="renderTime"
                        name="Render Time"
                        stroke="#ffc658"
                        strokeWidth={2}
                      />
                    </LineChart>
                  ) : (
                    <BarChart
                      data={performanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)}s`, ``]}
                        labelFormatter={(label) => `Date: ${formatDate(label)}`}
                      />
                      <Legend />
                      <Bar
                        dataKey="loadTime"
                        name="Page Load Time"
                        fill="#8884d8"
                      />
                      <Bar
                        dataKey="apiResponseTime"
                        name="API Response Time"
                        fill="#82ca9d"
                      />
                      <Bar
                        dataKey="renderTime"
                        name="Render Time"
                        fill="#ffc658"
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Error Rates</CardTitle>
                <CardDescription>
                  System errors over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, `Error Rate`]}
                        labelFormatter={(label) => `Date: ${formatDate(label)}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="errorRate"
                        name="Error Rate"
                        stroke="#ff6b6b"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Request Volume</CardTitle>
                <CardDescription>
                  Total API requests over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toLocaleString()}`, `Requests`]}
                        labelFormatter={(label) => `Date: ${formatDate(label)}`}
                      />
                      <Bar
                        dataKey="totalRequests"
                        name="Total Requests"
                        fill="#4dabf7"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>
                  Most used platform features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userActivityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {userActivityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, ``]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>
                  Active users by time of day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { time: '00:00', users: 12 },
                        { time: '02:00', users: 5 },
                        { time: '04:00', users: 3 },
                        { time: '06:00', users: 8 },
                        { time: '08:00', users: 35 },
                        { time: '10:00', users: 65 },
                        { time: '12:00', users: 72 },
                        { time: '14:00', users: 80 },
                        { time: '16:00', users: 74 },
                        { time: '18:00', users: 45 },
                        { time: '20:00', users: 30 },
                        { time: '22:00', users: 18 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="users"
                        name="Active Users"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Session Duration</CardTitle>
                <CardDescription>
                  Average session time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { day: 'Mon', duration: 15.3 },
                        { day: 'Tue', duration: 17.8 },
                        { day: 'Wed', duration: 18.2 },
                        { day: 'Thu', duration: 16.5 },
                        { day: 'Fri', duration: 14.7 },
                        { day: 'Sat', duration: 8.2 },
                        { day: 'Sun', duration: 7.5 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: number) => [`${value} mins`, `Avg. Duration`]}
                      />
                      <Bar
                        dataKey="duration"
                        name="Session Duration"
                        fill="#8884d8"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Usage by Department</CardTitle>
              <CardDescription>
                Platform usage metrics across departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usageByDepartmentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="users"
                      name="Total Users"
                      fill="#8884d8"
                    />
                    <Bar
                      dataKey="activeUsers"
                      name="Active Users"
                      fill="#82ca9d"
                    />
                    <Bar
                      dataKey="sessions"
                      name="Sessions"
                      fill="#ffc658"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Database Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 GB</div>
                <div className="text-xs text-muted-foreground mt-1">+240 MB this week</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Storage Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.5 GB</div>
                <div className="text-xs text-muted-foreground mt-1">74% of allocated storage</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Query Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">210 ms</div>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  -15 ms
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="m6 9 6-6 6 6" />
                    <path d="M12 3v18" />
                  </svg>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Data Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.4M</div>
                <div className="text-xs text-muted-foreground mt-1">+1.2M this month</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Storage Growth</CardTitle>
                <CardDescription>
                  Storage usage over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', storage: 10.2 },
                        { month: 'Feb', storage: 11.5 },
                        { month: 'Mar', storage: 12.3 },
                        { month: 'Apr', storage: 14.0 },
                        { month: 'May', storage: 15.8 },
                        { month: 'Jun', storage: 16.9 },
                        { month: 'Jul', storage: 18.5 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: number) => [`${value} GB`, `Storage`]}
                      />
                      <Line
                        type="monotone"
                        dataKey="storage"
                        name="Storage Usage"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Types</CardTitle>
                <CardDescription>
                  Storage by data type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Structured Data', value: 8.5 },
                          { name: 'Documents', value: 4.2 },
                          { name: 'Images', value: 3.8 },
                          { name: 'Videos', value: 1.5 },
                          { name: 'Other', value: 0.5 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value} GB`, ``]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Query Performance</CardTitle>
                <CardDescription>
                  Average query execution time by endpoint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { endpoint: '/api/dashboard', time: 120 },
                        { endpoint: '/api/reports', time: 280 },
                        { endpoint: '/api/analytics', time: 350 },
                        { endpoint: '/api/users', time: 110 },
                        { endpoint: '/api/auth', time: 90 },
                        { endpoint: '/api/search', time: 420 },
                        { endpoint: '/api/files', time: 310 },
                        { endpoint: '/api/settings', time: 105 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="endpoint" type="category" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: number) => [`${value} ms`, `Query Time`]}
                      />
                      <Bar
                        dataKey="time"
                        name="Execution Time"
                        fill="#82ca9d"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMetrics;
