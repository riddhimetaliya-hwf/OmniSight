
import { useState, useEffect, useMemo } from "react";
import { Dashboard, Widget, DashboardFilters } from "./types";
import { generateMockDashboards } from "./mockDashboardData";
import { toast } from "@/components/ui/use-toast";

export const useDashboards = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboards = async () => {
      // In a real app, this would be an API call
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockDashboards = generateMockDashboards();
        
        // Ensure all dashboards have their widgets populated
        const populatedDashboards = mockDashboards.map(dashboard => {
          if (dashboard.id === 'd1' && (!dashboard.widgets || dashboard.widgets.length === 0)) {
            return {
              ...dashboard,
              widgets: generateMockDashboards()[0].widgets
            };
          }
          return dashboard;
        });
        
        setDashboards(populatedDashboards);
        setCurrentDashboardId(populatedDashboards[0].id);
      } catch (error) {
        console.error("Error fetching dashboards:", error);
        toast({
          title: "Error loading dashboards",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboards();
  }, []);

  const currentDashboard = useMemo(() => {
    if (!currentDashboardId) return null;
    return dashboards.find(d => d.id === currentDashboardId) || null;
  }, [dashboards, currentDashboardId]);

  const setCurrentDashboard = (dashboard: Dashboard) => {
    setCurrentDashboardId(dashboard.id);
  };

  const saveDashboard = (updatedDashboard: Dashboard) => {
    setDashboards(prev => 
      prev.map(d => d.id === updatedDashboard.id ? 
        { ...updatedDashboard, updatedAt: new Date() } : d
      )
    );
    toast({
      title: "Dashboard saved",
      description: `${updatedDashboard.name} has been updated successfully.`,
    });
  };

  const duplicateDashboard = (dashboardId: string, newName: string) => {
    const original = dashboards.find(d => d.id === dashboardId);
    if (!original) return;

    const newDashboard: Dashboard = {
      ...original,
      id: `d${Date.now()}`,
      name: newName,
      createdAt: new Date(),
      updatedAt: new Date(),
      favorite: false
    };

    setDashboards(prev => [...prev, newDashboard]);
    toast({
      title: "Dashboard duplicated",
      description: `${original.name} has been duplicated as ${newName}.`,
    });
  };

  const exportDashboard = (dashboardId: string, format: 'pdf' | 'excel' | 'image') => {
    // In a real app, this would trigger an export process
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (!dashboard) return;

    toast({
      title: "Export started",
      description: `Exporting ${dashboard.name} as ${format.toUpperCase()}.`,
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `${dashboard.name} has been exported as ${format.toUpperCase()}.`,
      });
    }, 2000);
  };

  const updateDashboardFilters = (dashboardId: string, filters: DashboardFilters) => {
    setDashboards(prev => 
      prev.map(d => d.id === dashboardId ? 
        { ...d, filters, updatedAt: new Date() } : d
      )
    );
  };

  const createWidget = (dashboardId: string, widget: Omit<Widget, 'id'>) => {
    const newWidget: Widget = {
      ...widget,
      id: `w${Date.now()}`
    };

    setDashboards(prev => 
      prev.map(d => d.id === dashboardId ? 
        { 
          ...d, 
          widgets: [...d.widgets, newWidget],
          updatedAt: new Date() 
        } : d
      )
    );

    toast({
      title: "Widget added",
      description: `${widget.title} has been added to the dashboard.`,
    });
  };

  const updateWidget = (dashboardId: string, widget: Widget) => {
    setDashboards(prev => 
      prev.map(d => d.id === dashboardId ? 
        { 
          ...d, 
          widgets: d.widgets.map(w => w.id === widget.id ? widget : w),
          updatedAt: new Date() 
        } : d
      )
    );
  };

  const deleteWidget = (dashboardId: string, widgetId: string) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (!dashboard) return;

    const widgetToDelete = dashboard.widgets.find(w => w.id === widgetId);
    if (!widgetToDelete) return;

    setDashboards(prev => 
      prev.map(d => d.id === dashboardId ? 
        { 
          ...d, 
          widgets: d.widgets.filter(w => w.id !== widgetId),
          updatedAt: new Date() 
        } : d
      )
    );

    toast({
      title: "Widget removed",
      description: `${widgetToDelete.title} has been removed from the dashboard.`,
    });
  };

  const toggleWidgetFavorite = (dashboardId: string, widgetId: string) => {
    setDashboards(prev => 
      prev.map(d => d.id === dashboardId ? 
        { 
          ...d, 
          widgets: d.widgets.map(w => w.id === widgetId ? 
            { ...w, favorite: !w.favorite } : w
          ),
          updatedAt: new Date() 
        } : d
      )
    );
  };

  return {
    dashboards,
    currentDashboard,
    isLoading,
    setCurrentDashboard,
    saveDashboard,
    duplicateDashboard,
    exportDashboard,
    updateDashboardFilters,
    createWidget,
    updateWidget,
    deleteWidget,
    toggleWidgetFavorite
  };
};
