
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Widget, WidgetType, DashboardType } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddWidgetModalProps {
  open: boolean;
  onClose: () => void;
  onAddWidget: (widget: Widget) => void;
  dashboardType: DashboardType;
}

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  open,
  onClose,
  onAddWidget,
  dashboardType
}) => {
  const [selectedType, setSelectedType] = useState<WidgetType>('kpi');
  const [widgetTitle, setWidgetTitle] = useState('');

  const handleAddWidget = () => {
    const newWidget: Widget = {
      id: uuidv4(),
      title: widgetTitle || `New ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`,
      type: selectedType,
      category: dashboardType === 'general' ? 'performance' : dashboardType,
      data: [],
      columnSpan: selectedType === 'lineChart' || selectedType === 'table' ? 2 : 1,
      rowSpan: 1
    };
    
    onAddWidget(newWidget);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="widget-title">Widget Title</Label>
            <Input 
              id="widget-title"
              placeholder="Enter widget title"
              value={widgetTitle}
              onChange={(e) => setWidgetTitle(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
            </TabsList>
            
            <TabsContent value="charts" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card 
                  className={`cursor-pointer ${selectedType === 'lineChart' ? 'border-primary' : ''}`}
                  onClick={() => setSelectedType('lineChart')}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="h-20 w-full bg-muted rounded-lg mb-2 flex items-center justify-center">
                      <svg width="100" height="40" viewBox="0 0 100 40">
                        <polyline 
                          points="0,30 20,20 40,25 60,10 80,15 100,5" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Line Chart</span>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer ${selectedType === 'barChart' ? 'border-primary' : ''}`}
                  onClick={() => setSelectedType('barChart')}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="h-20 w-full bg-muted rounded-lg mb-2 flex items-center justify-center">
                      <svg width="100" height="40" viewBox="0 0 100 40">
                        <rect x="5" y="10" width="15" height="30" fill="currentColor" opacity="0.7" />
                        <rect x="25" y="15" width="15" height="25" fill="currentColor" opacity="0.7" />
                        <rect x="45" y="5" width="15" height="35" fill="currentColor" opacity="0.7" />
                        <rect x="65" y="20" width="15" height="20" fill="currentColor" opacity="0.7" />
                        <rect x="85" y="15" width="15" height="25" fill="currentColor" opacity="0.7" />
                      </svg>
                    </div>
                    <span className="font-medium">Bar Chart</span>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer ${selectedType === 'pieChart' ? 'border-primary' : ''}`}
                  onClick={() => setSelectedType('pieChart')}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="h-20 w-full bg-muted rounded-lg mb-2 flex items-center justify-center">
                      <svg width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="25" fill="transparent" stroke="currentColor" strokeWidth="30" strokeDasharray="75 100" />
                        <circle cx="30" cy="30" r="25" fill="transparent" stroke="currentColor" strokeWidth="30" strokeDasharray="40 100" strokeDashoffset="-75" opacity="0.7" />
                        <circle cx="30" cy="30" r="25" fill="transparent" stroke="currentColor" strokeWidth="30" strokeDasharray="25 100" strokeDashoffset="-115" opacity="0.4" />
                      </svg>
                    </div>
                    <span className="font-medium">Pie Chart</span>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="kpis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card 
                  className={`cursor-pointer ${selectedType === 'kpi' ? 'border-primary' : ''}`}
                  onClick={() => setSelectedType('kpi')}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="h-20 w-full bg-muted rounded-lg mb-2 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">$12,345</div>
                        <div className="text-sm text-green-500">↑ 12%</div>
                      </div>
                    </div>
                    <span className="font-medium">KPI Card</span>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer ${selectedType === 'gauge' ? 'border-primary' : ''}`}
                  onClick={() => setSelectedType('gauge')}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="h-20 w-full bg-muted rounded-lg mb-2 flex items-center justify-center">
                      <svg width="60" height="60" viewBox="0 0 120 120">
                        <path 
                          d="M10,60 A50,50 0 1,1 110,60" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="10" 
                          opacity="0.3"
                        />
                        <path 
                          d="M10,60 A50,50 0 0,1 80,20" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="10"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Gauge</span>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tables" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer ${selectedType === 'table' ? 'border-primary' : ''}`}
                  onClick={() => setSelectedType('table')}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="h-20 w-full bg-muted rounded-lg mb-2 flex items-center justify-center">
                      <div className="w-4/5">
                        <div className="h-4 bg-primary/20 rounded mb-2"></div>
                        <div className="h-3 bg-primary/10 rounded mb-1"></div>
                        <div className="h-3 bg-primary/10 rounded mb-1"></div>
                        <div className="h-3 bg-primary/10 rounded"></div>
                      </div>
                    </div>
                    <span className="font-medium">Data Table</span>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAddWidget}>Add Widget</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetModal;
