
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  FileText, 
  BarChart3,
  PieChart,
  Table as TableIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  mockCostItems, 
  mockDepartments, 
  mockSavingOpportunities, 
  mockBudgetForecast 
} from './data/mockData';
import CostOverviewCard from './components/CostOverviewCard';
import DepartmentCostBreakdown from './components/DepartmentCostBreakdown';
import CostSavingOpportunityCard from './components/CostSavingOpportunityCard';
import ServiceCostTable from './components/ServiceCostTable';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

type TimeFrame = 'month' | 'quarter' | 'year' | 'ytd';
type ViewMode = 'overview' | 'details' | 'optimization';

const ITCostPulse: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Calculate total cost and budget
  const totalCost = mockCostItems.reduce((sum, item) => sum + item.cost, 0);
  const totalBudget = mockCostItems.reduce((sum, item) => sum + item.budget, 0);
  const percentChange = ((totalCost / totalBudget) - 1) * 100;

  const handleImplementSavings = (id: string) => {
    const opportunity = mockSavingOpportunities.find(o => o.id === id);
    if (opportunity) {
      toast({
        title: "Cost saving initiative started",
        description: `Implementation plan for "${opportunity.title}" has been added to your tasks.`,
        duration: 5000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">IT Cost Pulse</h1>
          <p className="text-muted-foreground">
            Track, analyze, and optimize IT spending across your organization
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={viewMode === 'overview' ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode('overview')}
            className="gap-1"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </Button>
          <Button 
            variant={viewMode === 'details' ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode('details')}
            className="gap-1"
          >
            <TableIcon className="h-4 w-4" />
            <span>Details</span>
          </Button>
          <Button 
            variant={viewMode === 'optimization' ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode('optimization')}
            className="gap-1"
          >
            <DollarSign className="h-4 w-4" />
            <span>Optimization</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="bg-muted/40 border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Time Period</label>
            <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Current Month</SelectItem>
                <SelectItem value="quarter">Current Quarter</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="year">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Department</label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {mockDepartments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" size="default" className="w-full gap-1">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CostOverviewCard 
              totalCost={totalCost}
              totalBudget={totalBudget}
              percentChange={percentChange}
              forecastData={mockBudgetForecast}
            />
          </div>
          <div>
            <DepartmentCostBreakdown departments={mockDepartments} />
          </div>
        </div>
      )}
      
      {viewMode === 'details' && (
        <div>
          <ServiceCostTable costItems={mockCostItems} />
        </div>
      )}
      
      {viewMode === 'optimization' && (
        <div>
          <div className="mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Cost Optimization Opportunities</h3>
                    <p className="text-muted-foreground">Potential annual savings: ${mockSavingOpportunities.reduce((sum, item) => sum + item.potentialSavings, 0).toLocaleString()}</p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {mockSavingOpportunities.length} opportunities identified
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="impact">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="impact">Highest Impact</SelectItem>
                        <SelectItem value="easy">Easiest to Implement</SelectItem>
                        <SelectItem value="quick">Quickest Wins</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSavingOpportunities.map((opportunity) => (
              <CostSavingOpportunityCard 
                key={opportunity.id} 
                opportunity={opportunity}
                onImplement={handleImplementSavings}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ITCostPulse;
