
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserPrefs } from '../context/UserPrefsContext';
import { WidgetType } from '@/components/DashboardBuilder/types';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LayoutDashboard, Plus, BarChart3, LineChart, PieChart, Table } from "lucide-react";

// Define our dashboard template type
type DashboardTemplateType = 'sales' | 'finance' | 'hr' | 'operations' | 'custom';

// Mock data - in a real app, this would come from an API
const availableDashboards = [
  { id: 'dash1', name: 'Executive Dashboard', template: 'sales' as DashboardTemplateType },
  { id: 'dash2', name: 'Sales Overview', template: 'sales' as DashboardTemplateType },
  { id: 'dash3', name: 'Marketing Performance', template: 'custom' as DashboardTemplateType },
  { id: 'dash4', name: 'Operations Status', template: 'operations' as DashboardTemplateType },
  { id: 'dash5', name: 'Financial Summary', template: 'finance' as DashboardTemplateType },
  { id: 'dash6', name: 'HR Analytics', template: 'hr' as DashboardTemplateType },
];

const availableWidgets = [
  { id: 'widget1', name: 'Revenue Trend', type: 'lineChart' as WidgetType },
  { id: 'widget2', name: 'Sales by Region', type: 'barChart' as WidgetType },
  { id: 'widget3', name: 'Customer Segments', type: 'pieChart' as WidgetType },
  { id: 'widget4', name: 'Top Products', type: 'table' as WidgetType },
  { id: 'widget5', name: 'Marketing ROI', type: 'barChart' as WidgetType },
  { id: 'widget6', name: 'Conversion Rate', type: 'lineChart' as WidgetType },
];

const DASHBOARD_TEMPLATES: Record<DashboardTemplateType, { name: string, icon: React.ReactNode }> = {
  'sales': { name: 'Sales', icon: <BarChart3 className="h-4 w-4" /> },
  'finance': { name: 'Finance', icon: <LineChart className="h-4 w-4" /> },
  'hr': { name: 'HR', icon: <PieChart className="h-4 w-4" /> },
  'operations': { name: 'Operations', icon: <Table className="h-4 w-4" /> },
  'custom': { name: 'Custom', icon: <LayoutDashboard className="h-4 w-4" /> },
};

// Define the widget types that we currently support in our application
const WIDGET_TYPES: Record<Extract<WidgetType, 'lineChart' | 'barChart' | 'pieChart' | 'table' | 'kpi' | 'gauge'>, { name: string, icon: React.ReactNode }> = {
  'lineChart': { name: 'Line Chart', icon: <LineChart className="h-4 w-4" /> },
  'barChart': { name: 'Bar Chart', icon: <BarChart3 className="h-4 w-4" /> },
  'pieChart': { name: 'Pie Chart', icon: <PieChart className="h-4 w-4" /> },
  'table': { name: 'Table', icon: <Table className="h-4 w-4" /> },
  'gauge': { name: 'Gauge', icon: <LayoutDashboard className="h-4 w-4" /> },
  'kpi': { name: 'KPI', icon: <LayoutDashboard className="h-4 w-4" /> },
};

const DashboardSettings: React.FC = () => {
  const { preferences, updateDefaultDashboards, updateDefaultWidgets } = useUserPrefs();
  const [selectedDashboards, setSelectedDashboards] = useState<string[]>(preferences.defaultDashboards);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(preferences.defaultWidgets);
  const [dashboardDialogOpen, setDashboardDialogOpen] = useState(false);
  const [widgetDialogOpen, setWidgetDialogOpen] = useState(false);
  
  const handleSaveDashboards = () => {
    updateDefaultDashboards(selectedDashboards);
    setDashboardDialogOpen(false);
  };

  const handleSaveWidgets = () => {
    updateDefaultWidgets(selectedWidgets);
    setWidgetDialogOpen(false);
  };

  const toggleDashboard = (dashboardId: string) => {
    setSelectedDashboards(prev => 
      prev.includes(dashboardId)
        ? prev.filter(id => id !== dashboardId)
        : [...prev, dashboardId]
    );
  };

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const filterSelectedDashboards = availableDashboards.filter(
    dashboard => selectedDashboards.includes(dashboard.id)
  );

  const filterSelectedWidgets = availableWidgets.filter(
    widget => selectedWidgets.includes(widget.id)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Default Dashboards</span>
            <Dialog open={dashboardDialogOpen} onOpenChange={setDashboardDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Select Dashboards
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Select Default Dashboards</DialogTitle>
                  <DialogDescription>
                    Choose the dashboards that should appear in your home screen.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] mt-4">
                  <div className="grid gap-3">
                    {availableDashboards.map(dashboard => (
                      <div key={dashboard.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={`dashboard-${dashboard.id}`}
                          checked={selectedDashboards.includes(dashboard.id)}
                          onCheckedChange={() => toggleDashboard(dashboard.id)}
                        />
                        <div className="grid gap-1">
                          <Label
                            htmlFor={`dashboard-${dashboard.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {dashboard.name}
                          </Label>
                          <div className="text-sm text-muted-foreground flex items-center">
                            {DASHBOARD_TEMPLATES[dashboard.template].icon}
                            <span className="ml-1">{DASHBOARD_TEMPLATES[dashboard.template].name} template</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <DialogFooter className="mt-4">
                  <Button variant="ghost" onClick={() => setDashboardDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveDashboards}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filterSelectedDashboards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filterSelectedDashboards.map(dashboard => (
                <Card key={dashboard.id} className="p-4 border border-muted">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 rounded-full bg-muted">
                      {DASHBOARD_TEMPLATES[dashboard.template].icon}
                    </div>
                    <div>
                      <div className="font-medium">{dashboard.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {DASHBOARD_TEMPLATES[dashboard.template].name}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No default dashboards selected
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Default Widgets</span>
            <Dialog open={widgetDialogOpen} onOpenChange={setWidgetDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Select Widgets
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Select Default Widgets</DialogTitle>
                  <DialogDescription>
                    Choose the widgets that should be available for quick addition to dashboards.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] mt-4">
                  <div className="grid gap-3">
                    {availableWidgets.map(widget => {
                      // Only show widgets that we have type icons for
                      const widgetType = widget.type as Extract<WidgetType, keyof typeof WIDGET_TYPES>;
                      if (!WIDGET_TYPES[widgetType]) return null;
                      
                      return (
                        <div key={widget.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={`widget-${widget.id}`}
                            checked={selectedWidgets.includes(widget.id)}
                            onCheckedChange={() => toggleWidget(widget.id)}
                          />
                          <div className="grid gap-1">
                            <Label
                              htmlFor={`widget-${widget.id}`}
                              className="font-medium cursor-pointer"
                            >
                              {widget.name}
                            </Label>
                            <div className="text-sm text-muted-foreground flex items-center">
                              {WIDGET_TYPES[widgetType].icon}
                              <span className="ml-1">{WIDGET_TYPES[widgetType].name}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                <DialogFooter className="mt-4">
                  <Button variant="ghost" onClick={() => setWidgetDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveWidgets}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filterSelectedWidgets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filterSelectedWidgets.map(widget => {
                const widgetType = widget.type as Extract<WidgetType, keyof typeof WIDGET_TYPES>;
                if (!WIDGET_TYPES[widgetType]) return null;
                
                return (
                  <Card key={widget.id} className="p-4 border border-muted">
                    <div className="flex items-center">
                      <div className="mr-3 p-2 rounded-full bg-muted">
                        {WIDGET_TYPES[widgetType].icon}
                      </div>
                      <div>
                        <div className="font-medium">{widget.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {WIDGET_TYPES[widgetType].name}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No default widgets selected
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
