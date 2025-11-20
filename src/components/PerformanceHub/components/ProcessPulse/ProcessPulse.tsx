
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, AlertCircle, Activity, Clock } from 'lucide-react';
import ProcessMetricCard from './components/ProcessMetricCard';
import ProcessDetailsModal from './components/ProcessDetailsModal';
import { ProcessMetric, ProcessDetail } from './types';
import { 
  allProcesses, 
  mockOrderManagementProcesses, 
  mockTalentOnboardingProcesses, 
  mockClientServicesProcesses,
  mockProcessDetails,
  mockProcessAlerts
} from './data/mockData';

type TimeFrame = 'day' | 'week' | 'month' | 'quarter';
type ProcessCategory = 'all' | 'order-management' | 'talent-onboarding' | 'client-services';
type ProcessStatus = 'all' | 'on-track' | 'delayed' | 'at-risk';

const ProcessPulse: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('week');
  const [category, setCategory] = useState<ProcessCategory>('all');
  const [status, setStatus] = useState<ProcessStatus>('all');
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredProcesses = allProcesses.filter(process => {
    // Filter by search term
    if (searchTerm && !process.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (category !== 'all' && process.category !== category) {
      return false;
    }
    
    // Filter by status
    if (status !== 'all' && process.status !== status) {
      return false;
    }
    
    return true;
  });
  
  const orderManagementProcesses = filteredProcesses.filter(p => p.category === 'order-management');
  const talentOnboardingProcesses = filteredProcesses.filter(p => p.category === 'talent-onboarding');
  const clientServicesProcesses = filteredProcesses.filter(p => p.category === 'client-services');
  
  const handleProcessClick = (processId: string) => {
    setSelectedProcessId(processId);
    setShowModal(true);
  };
  
  const selectedProcessDetail = selectedProcessId ? 
    mockProcessDetails[selectedProcessId] || null : null;
  
  const alertsCount = mockProcessAlerts.length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Process Pulse</h1>
          <p className="text-muted-foreground">
            Business Process Performance Tracker
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1 relative"
          >
            <AlertCircle className="h-4 w-4" />
            <span>Alerts</span>
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {alertsCount}
              </span>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1"
          >
            <Activity className="h-4 w-4" />
            <span>Analytics</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search processes..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
            <SelectTrigger>
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-muted/40 border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Process Category</label>
            <Select value={category} onValueChange={(value) => setCategory(value as ProcessCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Process Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Processes</SelectItem>
                <SelectItem value="order-management">Order Management</SelectItem>
                <SelectItem value="talent-onboarding">Talent Onboarding</SelectItem>
                <SelectItem value="client-services">Client Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select value={status} onValueChange={(value) => setStatus(value as ProcessStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full max-w-md mb-4">
          <TabsTrigger value="all" className="flex-1">All Processes</TabsTrigger>
          <TabsTrigger value="order-management" className="flex-1">Order Management</TabsTrigger>
          <TabsTrigger value="talent-onboarding" className="flex-1">Talent Onboarding</TabsTrigger>
          <TabsTrigger value="client-services" className="flex-1">Client Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProcesses.map(process => (
              <ProcessMetricCard 
                key={process.id} 
                process={process} 
                onClick={handleProcessClick}
              />
            ))}
            {filteredProcesses.length === 0 && (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No processes found matching your filters
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="order-management" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderManagementProcesses.map(process => (
              <ProcessMetricCard 
                key={process.id} 
                process={process} 
                onClick={handleProcessClick}
              />
            ))}
            {orderManagementProcesses.length === 0 && (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No order management processes found matching your filters
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="talent-onboarding" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {talentOnboardingProcesses.map(process => (
              <ProcessMetricCard 
                key={process.id} 
                process={process} 
                onClick={handleProcessClick}
              />
            ))}
            {talentOnboardingProcesses.length === 0 && (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No talent onboarding processes found matching your filters
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="client-services" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientServicesProcesses.map(process => (
              <ProcessMetricCard 
                key={process.id} 
                process={process} 
                onClick={handleProcessClick}
              />
            ))}
            {clientServicesProcesses.length === 0 && (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No client services processes found matching your filters
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <ProcessDetailsModal 
        processDetail={selectedProcessDetail}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ProcessPulse;
