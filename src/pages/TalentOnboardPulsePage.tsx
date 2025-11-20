
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  FileClock, 
  Laptop, 
  GraduationCap, 
  Filter,
  Download,
  ChevronRight,
  ClipboardList,
  BarChart3,
  ArrowDown,
  ArrowUp,
  Lightbulb,
  Search
} from 'lucide-react';

const TalentOnboardPulsePage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  
  // Mock data for onboarding metrics
  const onboardingMetrics = {
    totalOnboarding: 43,
    avgTime: "18.5 days",
    targetTime: "21 days",
    onTrack: 32,
    delayed: 11,
    earlyCompletions: 8
  };
  
  // Mock data for onboarding stages
  const onboardingStages = [
    { 
      name: 'Documentation',
      icon: ClipboardList,
      candidates: 12,
      delayed: 2,
      avgTime: '2.4 days',
      target: '3 days',
      performance: 'ahead'
    },
    { 
      name: 'Background Check',
      icon: Search,
      candidates: 9,
      delayed: 3,
      avgTime: '5.2 days',
      target: '5 days',
      performance: 'delayed'
    },
    { 
      name: 'IT Setup',
      icon: Laptop,
      candidates: 14,
      delayed: 4,
      avgTime: '4.1 days',
      target: '3 days',
      performance: 'delayed'
    },
    { 
      name: 'Training',
      icon: GraduationCap,
      candidates: 8,
      delayed: 2,
      avgTime: '6.8 days',
      target: '10 days',
      performance: 'ahead'
    }
  ];
  
  // Mock data for delayed onboardings
  const delayedOnboardings = [
    {
      name: 'Alex Johnson',
      position: 'Senior Developer',
      department: 'Engineering',
      startDate: '2023-07-15',
      currentStage: 'IT Setup',
      delayDays: 3,
      reason: 'Hardware procurement delay'
    },
    {
      name: 'Samantha Lee',
      position: 'UX Designer',
      department: 'Product',
      startDate: '2023-07-12',
      currentStage: 'Background Check',
      delayDays: 5,
      reason: 'International verification pending'
    },
    {
      name: 'Miguel Sanchez',
      position: 'Marketing Specialist',
      department: 'Marketing',
      startDate: '2023-07-18',
      currentStage: 'Training',
      delayDays: 2,
      reason: 'Trainer availability issue'
    },
    {
      name: 'Priya Patel',
      position: 'Financial Analyst',
      department: 'Finance',
      startDate: '2023-07-10',
      currentStage: 'Documentation',
      delayDays: 4,
      reason: 'Missing tax documents'
    }
  ];

  return (
    <Layout title="Talent Onboard Pulse" subtitle="Monitor talent onboarding timelines and effectiveness">
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Onboarding</p>
                  <h3 className="text-2xl font-bold mt-1">{onboardingMetrics.totalOnboarding}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium">+12% </span>
                  vs last quarter
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Time to Onboard</p>
                  <h3 className="text-2xl font-bold mt-1">{onboardingMetrics.avgTime}</h3>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={88} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Target: {onboardingMetrics.targetTime}</span>
                  <span className="text-green-500">↓ 12% faster</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">On Track</p>
                  <h3 className="text-2xl font-bold mt-1">{onboardingMetrics.onTrack}</h3>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={(onboardingMetrics.onTrack / onboardingMetrics.totalOnboarding) * 100} 
                  className="h-2"
                />
                <div className="mt-1 text-xs text-muted-foreground">
                  {Math.round((onboardingMetrics.onTrack / onboardingMetrics.totalOnboarding) * 100)}% of total
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delayed</p>
                  <h3 className="text-2xl font-bold mt-1">{onboardingMetrics.delayed}</h3>
                </div>
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={(onboardingMetrics.delayed / onboardingMetrics.totalOnboarding) * 100} 
                  className="h-2 bg-muted" 
                />
                <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  {Math.round((onboardingMetrics.delayed / onboardingMetrics.totalOnboarding) * 100)}% need attention
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Department Selection */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium">Onboarding Timeline View</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor progress across all onboarding stages
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="all" onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="product">Product</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Onboarding Stages Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {onboardingStages.map((stage, index) => (
            <Card key={index} className={
              stage.performance === 'delayed' 
                ? 'border-amber-200 dark:border-amber-800' 
                : 'border'
            }>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${
                      stage.performance === 'delayed' 
                        ? 'bg-amber-100 dark:bg-amber-900/30' 
                        : 'bg-green-100 dark:bg-green-900/30'
                    }`}>
                      <stage.icon className={`h-4 w-4 ${
                        stage.performance === 'delayed' 
                          ? 'text-amber-600 dark:text-amber-400' 
                          : 'text-green-600 dark:text-green-400'
                      }`} />
                    </div>
                    <CardTitle className="text-base">{stage.name}</CardTitle>
                  </div>
                  <Badge variant={stage.performance === 'delayed' ? 'destructive' : 'outline'}>
                    {stage.candidates}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>On Time</span>
                    <span>{stage.candidates - stage.delayed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delayed</span>
                    <span className={stage.delayed > 0 ? "text-amber-600 dark:text-amber-400 font-medium" : ""}>
                      {stage.delayed}
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Avg. Time</span>
                      <div className="flex items-center gap-1">
                        {stage.performance === 'ahead' ? (
                          <ArrowDown className="h-3 w-3 text-green-500" />
                        ) : (
                          <ArrowUp className="h-3 w-3 text-amber-500" />
                        )}
                        <span className={
                          stage.performance === 'ahead' 
                            ? 'text-green-500' 
                            : 'text-amber-500'
                        }>
                          {stage.avgTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Target</span>
                      <span>{stage.target}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Tabs for Candidates and Insights */}
        <Tabs defaultValue="delayed" className="space-y-4">
          <TabsList>
            <TabsTrigger value="delayed">Delayed Onboarding</TabsTrigger>
            <TabsTrigger value="all-candidates">All Candidates</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="delayed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Delayed Onboarding Cases</CardTitle>
                <CardDescription>
                  Candidates experiencing delays in the onboarding process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 p-3 bg-muted/50 text-sm font-medium">
                    <div className="col-span-2">Candidate</div>
                    <div>Department</div>
                    <div>Current Stage</div>
                    <div>Start Date</div>
                    <div>Delay</div>
                    <div>Issue</div>
                  </div>
                  <div className="divide-y">
                    {delayedOnboardings.map((candidate, i) => (
                      <div key={i} className="grid grid-cols-7 p-3 items-center text-sm">
                        <div className="col-span-2">
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-xs text-muted-foreground">{candidate.position}</div>
                        </div>
                        <div>{candidate.department}</div>
                        <div>
                          <Badge variant="outline">{candidate.currentStage}</Badge>
                        </div>
                        <div>{candidate.startDate}</div>
                        <div className="text-amber-600 dark:text-amber-400 font-medium">
                          {candidate.delayDays} days
                        </div>
                        <div>{candidate.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all-candidates">
            <Card>
              <CardHeader>
                <CardTitle>All Candidates</CardTitle>
                <CardDescription>Complete view of all candidates in the onboarding process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Select specific filters to view detailed candidate information
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-insights">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>Intelligent recommendations to improve the onboarding process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-100 dark:border-amber-900/50">
                    <h4 className="font-medium text-amber-700 dark:text-amber-300 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Bottleneck Detected
                    </h4>
                    <p className="mt-2 text-sm">
                      Background checks are taking 37% longer for international candidates. Consider using an alternative verification service for non-US employees.
                    </p>
                    <Button variant="link" className="text-sm p-0 mt-2">View affected candidates</Button>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Improvement Opportunity
                    </h4>
                    <p className="mt-2 text-sm">
                      IT setup delays have increased by 22% this quarter. Pre-provisioning laptops for confirmed hires could reduce this stage by up to 3 days.
                    </p>
                    <Button variant="link" className="text-sm p-0 mt-2">Explore recommendation</Button>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                    <h4 className="font-medium text-green-700 dark:text-green-300 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Trend Analysis
                    </h4>
                    <p className="mt-2 text-sm">
                      Engineering department has reduced onboarding time by 28% after implementing the digital document signing process. Consider expanding to other departments.
                    </p>
                    <Button variant="link" className="text-sm p-0 mt-2">View detailed analysis</Button>
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

export default TalentOnboardPulsePage;
