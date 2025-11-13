
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, AlertCircle, CheckCircle2, Filter, ArrowUpRight, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const OrderFlowTrackerPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data for order flow tracking
  const orderStatusData = {
    total: 235,
    onTrack: 178,
    atRisk: 42,
    delayed: 15
  };

  const cycleTimeData = {
    average: "2.4 days",
    target: "3.0 days",
    improvement: "12%"
  };

  // Mock data for orders in different stages
  const orderStages = [
    { stage: "Order Intake", count: 42, delayed: 3 },
    { stage: "Approval", count: 67, delayed: 12 },
    { stage: "Fulfillment", count: 89, delayed: 5 },
    { stage: "Invoicing", count: 37, delayed: 2 }
  ];

  // Mock data for orders at risk
  const atRiskOrders = [
    { id: "ORD-7829", customer: "Acme Corp", status: "Approval", duration: "3d 4h", reason: "Missing documentation" },
    { id: "ORD-6541", customer: "TechGlobal", status: "Fulfillment", duration: "2d 8h", reason: "Inventory shortage" },
    { id: "ORD-9023", customer: "InnoSys", status: "Approval", duration: "4d 2h", reason: "Pending review" },
    { id: "ORD-5437", customer: "DataFlow Inc", status: "Intake", duration: "1d 6h", reason: "Incomplete information" }
  ];

  return (
    <Layout title="Order Flow Tracker" subtitle="Monitor and optimize your order processing workflow">
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <h3 className="text-2xl font-bold mt-1">{orderStatusData.total}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium">+8% </span>
                  vs last week
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Cycle Time</p>
                  <h3 className="text-2xl font-bold mt-1">{cycleTimeData.average}</h3>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={80} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Target: {cycleTimeData.target}</span>
                  <span className="text-green-500">↓ {cycleTimeData.improvement}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                  <h3 className="text-2xl font-bold mt-1">{orderStatusData.atRisk}</h3>
                </div>
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={(orderStatusData.atRisk / orderStatusData.total) * 100} className="h-2 bg-muted" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{Math.round((orderStatusData.atRisk / orderStatusData.total) * 100)}% of total</span>
                  <span className="text-amber-500">Action needed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fulfilled Orders</p>
                  <h3 className="text-2xl font-bold mt-1">{orderStatusData.onTrack}</h3>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={(orderStatusData.onTrack / orderStatusData.total) * 100} className="h-2 bg-muted" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{Math.round((orderStatusData.onTrack / orderStatusData.total) * 100)}% completion rate</span>
                  <span className="text-green-500">On track</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Flow Visualization */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Order Flow Pipeline</CardTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="all" onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="vip">VIP Customers</SelectItem>
                    <SelectItem value="delayed">Delayed Orders</SelectItem>
                    <SelectItem value="recent">Last 24 Hours</SelectItem>
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
            <CardDescription>Visualize the entire order journey from intake to invoicing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {orderStages.map((stage, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">{stage.stage}</h4>
                    <Badge variant={stage.delayed > 0 ? "destructive" : "outline"}>
                      {stage.count}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>On Track</span>
                      <span>{stage.count - stage.delayed}</span>
                    </div>
                    <Progress 
                      value={((stage.count - stage.delayed) / stage.count) * 100} 
                      className="h-1.5"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Delayed</span>
                      <span className={stage.delayed > 0 ? "text-destructive" : ""}>
                        {stage.delayed}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Order Details and Insights */}
        <Tabs defaultValue="at-risk" className="space-y-4">
          <TabsList>
            <TabsTrigger value="at-risk">At-Risk Orders</TabsTrigger>
            <TabsTrigger value="all-orders">All Orders</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="at-risk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Orders Requiring Attention</CardTitle>
                <CardDescription>
                  Orders that may breach SLA or are experiencing delays
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-3 bg-muted/50 text-sm font-medium">
                    <div>Order ID</div>
                    <div>Customer</div>
                    <div>Current Stage</div>
                    <div>Time in Stage</div>
                    <div>Issue</div>
                    <div className="text-right">Action</div>
                  </div>
                  <div className="divide-y">
                    {atRiskOrders.map((order, i) => (
                      <div key={i} className="grid grid-cols-6 p-3 items-center text-sm">
                        <div className="font-medium">{order.id}</div>
                        <div>{order.customer}</div>
                        <div>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                        <div className="text-amber-500 font-medium">{order.duration}</div>
                        <div>{order.reason}</div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">
                            <span>Resolve</span>
                            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all-orders">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Complete view of all orders in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Select specific filters to view detailed order information
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-insights">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>Intelligent recommendations to improve order processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Bottleneck Detected
                    </h4>
                    <p className="mt-2 text-sm">
                      15 orders are stuck in approval stage for more than 48 hours. Most delayed orders are from the East Region.
                    </p>
                    <Button variant="link" className="text-sm p-0 mt-2">View affected orders</Button>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                    <h4 className="font-medium text-green-700 dark:text-green-300 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Optimization Opportunity
                    </h4>
                    <p className="mt-2 text-sm">
                      Fast-tracking VIP customer orders could improve average cycle time by 18%. Consider implementing an expedited approval process.
                    </p>
                    <Button variant="link" className="text-sm p-0 mt-2">Apply recommendation</Button>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-100 dark:border-amber-900/50">
                    <h4 className="font-medium text-amber-700 dark:text-amber-300 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Prediction Alert
                    </h4>
                    <p className="mt-2 text-sm">
                      Based on historical patterns, 8 orders are predicted to miss SLA targets unless addressed in the next 24 hours.
                    </p>
                    <Button variant="link" className="text-sm p-0 mt-2">View predicted orders</Button>
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

export default OrderFlowTrackerPage;
