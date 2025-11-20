
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  BarChart3, 
  Bot, 
  Calendar, 
  Clock, 
  Database, 
  Download, 
  Filter, 
  LineChart, 
  Lightbulb, 
  RefreshCcw, 
  Shield, 
  Ticket, 
  UserRound 
} from 'lucide-react';
import { AIInsight, ITIssue, ServiceMetric } from './types';
import { allITMetrics, serviceDesk, security, infrastructure, itilProcesses, issues, aiInsights } from './data/mockData';
import ServiceMetricCard from './components/ServiceMetricCard';
import IssueCard from './components/IssueCard';
import AIInsightCard from './components/AIInsightCard';
import SLAHeatmap from './components/SLAHeatmap';
import MetricDetailsModal from './components/MetricDetailsModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from "@/components/ui/use-toast";
import { Badge } from '@/components/ui/badge';

type MetricCategory = 'all' | 'service_desk' | 'security' | 'infrastructure' | 'itil';
type TimeRange = '24h' | '7d' | '30d' | '90d';

const ITSentinel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<MetricCategory>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [showInsights, setShowInsights] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  
  const [selectedMetric, setSelectedMetric] = useState<ServiceMetric | null>(null);
  const [metricDetailsOpen, setMetricDetailsOpen] = useState(false);
  
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<ITIssue | null>(null);
  
  // Filter metrics based on selected category
  const filteredMetrics = selectedCategory === 'all' 
    ? allITMetrics 
    : allITMetrics.filter(m => m.category === selectedCategory);

  const handleMetricClick = (metric: ServiceMetric) => {
    setSelectedMetric(metric);
    setMetricDetailsOpen(true);
  };

  const handleIssueResolve = (issue: ITIssue) => {
    toast({
      title: "Issue Action",
      description: issue.status === 'open' ? 
        `Issue "${issue.title}" has been moved to In Progress.` : 
        `Issue "${issue.title}" has been marked as Resolved.`,
      variant: "default",
    });
  };

  const handleIssueAssign = (issue: ITIssue) => {
    setSelectedIssue(issue);
    setAssignDialogOpen(true);
  };

  const handleAssignIssue = () => {
    setAssignDialogOpen(false);
    toast({
      title: "Issue Assigned",
      description: `The issue has been assigned successfully.`,
      variant: "default",
    });
  };

  const handleInsightDetails = (insight: AIInsight) => {
    toast({
      title: "AI Insight Details",
      description: `Viewing details for insight: ${insight.title}`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            IT Services Performance
          </h1>
          <p className="text-muted-foreground">
            Real-time monitoring and intelligence for IT service performance
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1"
            onClick={() => toast({
              title: "Refreshed Data",
              description: "IT performance data has been refreshed.",
              variant: "default",
            })}
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1"
            onClick={() => toast({
              title: "Export Complete",
              description: "Performance report has been exported successfully.",
              variant: "default",
            })}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button 
            variant={showInsights ? "default" : "outline"} 
            size="sm"
            onClick={() => setShowInsights(!showInsights)}
            className="gap-1"
          >
            <Bot className="h-4 w-4" />
            <span>AI Insights</span>
            {aiInsights.length > 0 && (
              <Badge variant="secondary" className="ml-1">{aiInsights.length}</Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-muted/40 border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Domain</label>
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as MetricCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Service Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="service_desk">Service Desk</SelectItem>
                <SelectItem value="security">Security Services</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="itil">ITIL Processes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Time Range</label>
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Region</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="north_america">North America</SelectItem>
                <SelectItem value="emea">EMEA</SelectItem>
                <SelectItem value="apac">APAC</SelectItem>
                <SelectItem value="latam">Latin America</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" size="default" className="w-full gap-1">
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      {showInsights && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {aiInsights.map(insight => (
            <AIInsightCard 
              key={insight.id} 
              insight={insight} 
              onViewDetails={handleInsightDetails}
            />
          ))}
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full max-w-md mb-4 grid grid-cols-5">
          <TabsTrigger value="overview" className="flex-1 flex items-center justify-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="service_desk" className="flex-1 flex items-center justify-center gap-1">
            <Ticket className="h-4 w-4" />
            <span className="hidden sm:inline">Service Desk</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 flex items-center justify-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="infrastructure" className="flex-1 flex items-center justify-center gap-1">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Infrastructure</span>
          </TabsTrigger>
          <TabsTrigger value="itil" className="flex-1 flex items-center justify-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">ITIL</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="xl:col-span-3 space-y-6">
              <h2 className="text-lg font-medium">Service Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredMetrics
                  .filter(metric => metric.status !== 'healthy')
                  .slice(0, 3)
                  .map(metric => (
                    <ServiceMetricCard 
                      key={metric.id} 
                      metric={metric} 
                      onClick={handleMetricClick}
                    />
                  ))
                }
              </div>
              
              <h2 className="text-lg font-medium">IT Service Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-blue-500" />
                      <span>Service Desk</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-3xl font-bold">
                      {serviceDesk.find(m => m.name === 'SLA Compliance')?.value || 89}%
                    </div>
                    <p className="text-muted-foreground text-sm">Overall SLA Compliance</p>
                    
                    <div className="mt-4 flex justify-between text-sm">
                      <div>
                        <div className="text-muted-foreground">Volume</div>
                        <div className="font-medium">
                          {serviceDesk.find(m => m.name === 'Ticket Volume')?.value || 357}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Resolution</div>
                        <div className="font-medium">
                          {serviceDesk.find(m => m.name === 'Average Resolution Time')?.value || 4.2}h
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      <span>Security</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-3xl font-bold">
                      {security.find(m => m.name === 'Threat Detection Rate')?.value || 94}%
                    </div>
                    <p className="text-muted-foreground text-sm">Threat Detection Rate</p>
                    
                    <div className="mt-4 flex justify-between text-sm">
                      <div>
                        <div className="text-muted-foreground">Incidents</div>
                        <div className="font-medium">
                          {security.find(m => m.name === 'Security Incidents')?.value || 12}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Response</div>
                        <div className="font-medium">
                          {security.find(m => m.name === 'Avg Response Time')?.value || 28}m
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="h-5 w-5 text-purple-500" />
                      <span>Infrastructure</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-3xl font-bold">
                      {infrastructure.find(m => m.name === 'System Uptime')?.value || 99.92}%
                    </div>
                    <p className="text-muted-foreground text-sm">System Uptime</p>
                    
                    <div className="mt-4 flex justify-between text-sm">
                      <div>
                        <div className="text-muted-foreground">Latency</div>
                        <div className="font-medium">
                          {infrastructure.find(m => m.name === 'Average Latency')?.value || 185}ms
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Maintenance</div>
                        <div className="font-medium">
                          {infrastructure.find(m => m.name === 'Maintenance Compliance')?.value || 92}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-500" />
                      <span>ITIL Processes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-3xl font-bold">
                      {itilProcesses.find(m => m.name === 'Change Success Rate')?.value || 84}%
                    </div>
                    <p className="text-muted-foreground text-sm">Change Success Rate</p>
                    
                    <div className="mt-4 flex justify-between text-sm">
                      <div>
                        <div className="text-muted-foreground">Aging</div>
                        <div className="font-medium">
                          {itilProcesses.find(m => m.name === 'Incident Aging')?.value || 3.8}d
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Approval</div>
                        <div className="font-medium">
                          {itilProcesses.find(m => m.name === 'Approval Cycle Time')?.value || 22}h
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Active Issues</h2>
              <div className="space-y-3">
                {issues
                  .filter(issue => issue.status !== 'resolved')
                  .slice(0, 4)
                  .map(issue => (
                    <IssueCard 
                      key={issue.id} 
                      issue={issue} 
                      onResolve={handleIssueResolve}
                      onAssign={handleIssueAssign}
                    />
                  ))
                }
              </div>
              
              <Button variant="outline" className="w-full text-sm gap-1">
                <LineChart className="h-4 w-4" />
                View All Issues
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">SLA Performance Tracking</h2>
            <SLAHeatmap metrics={allITMetrics} />
          </div>
        </TabsContent>
        
        <TabsContent value="service_desk" className="mt-0">
          <h2 className="text-lg font-medium mb-4">Service Desk Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {serviceDesk.map(metric => (
              <ServiceMetricCard 
                key={metric.id} 
                metric={metric} 
                onClick={handleMetricClick}
              />
            ))}
          </div>
          
          <h2 className="text-lg font-medium mb-4 mt-6">Service Desk Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issues
              .filter(issue => issue.category === 'service_desk')
              .map(issue => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  onResolve={handleIssueResolve}
                  onAssign={handleIssueAssign}
                />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="mt-0">
          <h2 className="text-lg font-medium mb-4">Security Services Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {security.map(metric => (
              <ServiceMetricCard 
                key={metric.id} 
                metric={metric} 
                onClick={handleMetricClick}
              />
            ))}
          </div>
          
          <h2 className="text-lg font-medium mb-4 mt-6">Security Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issues
              .filter(issue => issue.category === 'security')
              .map(issue => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  onResolve={handleIssueResolve}
                  onAssign={handleIssueAssign}
                />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="infrastructure" className="mt-0">
          <h2 className="text-lg font-medium mb-4">Infrastructure Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {infrastructure.map(metric => (
              <ServiceMetricCard 
                key={metric.id} 
                metric={metric} 
                onClick={handleMetricClick}
              />
            ))}
          </div>
          
          <h2 className="text-lg font-medium mb-4 mt-6">Infrastructure Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issues
              .filter(issue => issue.category === 'infrastructure')
              .map(issue => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  onResolve={handleIssueResolve}
                  onAssign={handleIssueAssign}
                />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="itil" className="mt-0">
          <h2 className="text-lg font-medium mb-4">ITIL Process Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {itilProcesses.map(metric => (
              <ServiceMetricCard 
                key={metric.id} 
                metric={metric} 
                onClick={handleMetricClick}
              />
            ))}
          </div>
          
          <h2 className="text-lg font-medium mb-4 mt-6">ITIL Process Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issues
              .filter(issue => issue.category === 'itil')
              .map(issue => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  onResolve={handleIssueResolve}
                  onAssign={handleIssueAssign}
                />
              ))
            }
          </div>
        </TabsContent>
      </Tabs>

      {/* Metric Details Modal */}
      <MetricDetailsModal 
        metric={selectedMetric}
        open={metricDetailsOpen}
        onOpenChange={setMetricDetailsOpen}
      />
      
      {/* Issue Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Issue</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {selectedIssue && (
              <div className="mb-4">
                <h3 className="font-medium">{selectedIssue.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedIssue.description}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Assign To</label>
                <Select defaultValue="sarah_chen">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Team Member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah_chen">Sarah Chen</SelectItem>
                    <SelectItem value="james_wilson">James Wilson</SelectItem>
                    <SelectItem value="michael_reed">Michael Reed</SelectItem>
                    <SelectItem value="patricia_liu">Patricia Liu</SelectItem>
                    <SelectItem value="robert_johnson">Robert Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Due Date</label>
                <Select defaultValue="24h">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Due Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="48h">48 Hours</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                    <SelectItem value="custom">Custom Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Priority</label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignIssue}>Assign Issue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ITSentinel;

