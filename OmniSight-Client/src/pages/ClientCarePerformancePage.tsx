
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, 
  Clock, 
  Star, 
  Users, 
  AlertTriangle, 
  BarChart3, 
  ChevronRight,
  Filter,
  Download,
  Lightbulb,
  AreaChart,
  PieChart,
  UserPlus,
  UserCheck,
  ArrowUp,
  ArrowDown,
  ThumbsUp,
  ListChecks
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const ClientCarePerformancePage: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Mock data for performance metrics
  const performanceMetrics = {
    totalCases: 483,
    avgResponseTime: "4.2 hrs",
    targetResponseTime: "8 hrs",
    avgResolutionTime: "2.6 days",
    targetResolutionTime: "3 days",
    satisfactionScore: 92,
    previousScore: 89
  };

  // Mock data for team performance
  const teams = [
    {
      name: 'Technical Support',
      openCases: 87,
      resolvedToday: 24,
      avgResponseTime: '3.8 hrs',
      performance: 'above'
    },
    {
      name: 'Billing Team',
      openCases: 45,
      resolvedToday: 18,
      avgResponseTime: '2.1 hrs',
      performance: 'above'
    },
    {
      name: 'Account Management',
      openCases: 62,
      resolvedToday: 29,
      avgResponseTime: '4.9 hrs',
      performance: 'on-target'
    },
    {
      name: 'Product Support',
      openCases: 105,
      resolvedToday: 32,
      avgResponseTime: '6.5 hrs',
      performance: 'below'
    }
  ];

  // Mock data for top issues
  const topIssues = [
    { issue: 'Login authentication failures', count: 58, change: '+12%', category: 'Technical' },
    { issue: 'Payment processing errors', count: 42, change: '-8%', category: 'Billing' },
    { issue: 'Report generation delay', count: 37, change: '+5%', category: 'Product' },
    { issue: 'Account access limitations', count: 31, change: '+14%', category: 'Account' },
    { issue: 'Data integration failures', count: 28, change: '-3%', category: 'Technical' }
  ];

  // Mock data for chart
  const chartData = [
    { name: 'Monday', responseTime: 4.8, resolutionTime: 2.3, satisfaction: 90 },
    { name: 'Tuesday', responseTime: 5.2, resolutionTime: 2.5, satisfaction: 88 },
    { name: 'Wednesday', responseTime: 4.5, resolutionTime: 2.7, satisfaction: 91 },
    { name: 'Thursday', responseTime: 3.8, resolutionTime: 2.4, satisfaction: 93 },
    { name: 'Friday', responseTime: 4.2, resolutionTime: 2.6, satisfaction: 95 },
    { name: 'Saturday', responseTime: 3.5, resolutionTime: 2.1, satisfaction: 94 },
    { name: 'Sunday', responseTime: 3.2, resolutionTime: 2.0, satisfaction: 96 }
  ];

  return (
    <Layout title="Client Care Performance" subtitle="Measure and manage client service delivery performance">
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                  <h3 className="text-2xl font-bold mt-1">{performanceMetrics.totalCases}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">
                  <span className="text-amber-500 font-medium">+8% </span>
                  vs last week
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
                  <h3 className="text-2xl font-bold mt-1">{performanceMetrics.avgResponseTime}</h3>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={53} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Target: {performanceMetrics.targetResponseTime}</span>
                  <span className="text-green-500">↓ 15% faster</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Resolution Time</p>
                  <h3 className="text-2xl font-bold mt-1">{performanceMetrics.avgResolutionTime}</h3>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <ListChecks className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={85} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Target: {performanceMetrics.targetResolutionTime}</span>
                  <span className="text-green-500">↓ 8% faster</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction Rating</p>
                  <h3 className="text-2xl font-bold mt-1">{performanceMetrics.satisfactionScore}%</h3>
                </div>
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                  <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={performanceMetrics.satisfactionScore} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Previous: {performanceMetrics.previousScore}%</span>
                  <span className="text-green-500">↑ 3% increase</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Response time, resolution time, and satisfaction</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="7d" onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last quarter</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="responseTime" 
                    name="Response Time (hrs)" 
                    stroke="#3182ce" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="resolutionTime" 
                    name="Resolution Time (days)" 
                    stroke="#10b981" 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="satisfaction" 
                    name="Satisfaction (%)" 
                    stroke="#f59e0b" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-lg font-medium">Team Performance</h3>
              <p className="text-sm text-muted-foreground">
                Response times and caseload by department
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all" onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="billing">Billing Team</SelectItem>
                  <SelectItem value="account">Account Management</SelectItem>
                  <SelectItem value="product">Product Support</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {teams.map((team, index) => (
              <Card key={index} className={`
                ${team.performance === 'above' ? 'border-green-200 dark:border-green-800' : ''}
                ${team.performance === 'below' ? 'border-amber-200 dark:border-amber-800' : ''}
              `}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{team.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Open Cases</p>
                      <p className="text-lg font-semibold">{team.openCases}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Resolved Today</p>
                      <p className="text-lg font-semibold text-green-600">{team.resolvedToday}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Avg. Response Time</p>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        team.performance === 'above' ? 'text-green-600 dark:text-green-400' : 
                        team.performance === 'below' ? 'text-amber-600 dark:text-amber-400' : ''
                      }`}>
                        {team.performance === 'above' && <ArrowDown className="h-3 w-3" />}
                        {team.performance === 'below' && <ArrowUp className="h-3 w-3" />}
                        {team.avgResponseTime}
                      </div>
                    </div>
                    <Progress 
                      value={team.performance === 'above' ? 85 : team.performance === 'below' ? 65 : 75} 
                      className={`h-1.5 ${
                        team.performance === 'above' ? 'bg-green-100 dark:bg-green-900' : 
                        team.performance === 'below' ? 'bg-amber-100 dark:bg-amber-900' : ''
                      }`} 
                    />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full justify-center">
                    <span>Team Details</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs for Issues and Insights */}
        <Tabs defaultValue="top-issues" className="space-y-4">
          <TabsList>
            <TabsTrigger value="top-issues">Top Issues</TabsTrigger>
            <TabsTrigger value="case-details">Case Details</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="top-issues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Most Common Issues</CardTitle>
                <CardDescription>
                  Recurring issues requiring attention across teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 p-3 bg-muted/50 text-sm font-medium">
                    <div className="col-span-2">Issue</div>
                    <div>Category</div>
                    <div className="text-right">Count</div>
                  </div>
                  <div className="divide-y">
                    {topIssues.map((issue, i) => (
                      <div key={i} className="grid grid-cols-4 p-3 items-center text-sm">
                        <div className="col-span-2 font-medium">{issue.issue}</div>
                        <div>
                          <Badge variant="outline">{issue.category}</Badge>
                        </div>
                        <div className="text-right flex items-center justify-end gap-2">
                          <span className="font-semibold">{issue.count}</span>
                          <span className={
                            issue.change.startsWith('+') ? 'text-amber-600 dark:text-amber-400 text-xs' : 'text-green-600 dark:text-green-400 text-xs'
                          }>
                            {issue.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="case-details">
            <Card>
              <CardHeader>
                <CardTitle>Case Details</CardTitle>
                <CardDescription>Detailed view of all customer cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Select specific filters to view detailed case information
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-insights">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>Intelligent recommendations to improve client service performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Performance Pattern
                    </h4>
                    <p className="mt-2 text-sm">
                      Response times are consistently 25% longer on Friday afternoons. Consider adjusting staff scheduling to maintain coverage during this period.
                    </p>
                    <Button variant="link" className="text-sm p-0 mt-2">View pattern details</Button>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                    <h4 className="font-medium text-green-700 dark:text-green-300 flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Satisfaction Insight
                    </h4>
                    <p className="mt-2 text-sm">
                      Cases resolved within 24 hours have a 96% satisfaction rating vs. 84% for cases that take longer. Prioritizing quick resolution significantly improves client experience.
                    </p>
                    <Button variant="link" className="text-sm p-0 mt-2">Analyze correlation</Button>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-100 dark:border-amber-900/50">
                    <h4 className="font-medium text-amber-700 dark:text-amber-300 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Improvement Opportunity
                    </h4>
                    <p className="mt-2 text-sm">
                      Login authentication failures have increased 12% this month. Providing self-service password reset could reduce these cases by up to 68% based on historical data.
                    </p>
                    <Button variant="link" className="text-sm p-0 mt-2">Explore solution</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClientCarePerformancePage;
