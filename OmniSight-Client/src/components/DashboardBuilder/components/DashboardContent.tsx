
import React, { useState } from "react";
import { Dashboard, Widget, DashboardType } from "../types";
import DashboardGrid from "./DashboardGrid";
import AIExplainDialog from "./AIExplainDialog";
import WidgetConfigPreview from "./WidgetConfigPreview";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import AddWidgetModal from "./AddWidgetModal";

interface DashboardContentProps {
  dashboard: Dashboard;
  dashboardType: DashboardType;
  onUpdateDashboard: (dashboard: Dashboard) => void;
  isCustomizing?: boolean;
  onCreateWidget?: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  dashboard,
  dashboardType,
  onUpdateDashboard,
  isCustomizing = false,
  onCreateWidget
}) => {
  const [explainMetricOpen, setExplainMetricOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [sectionMode, setSectionMode] = useState(true);
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  if (!dashboard || !dashboard.widgets) {
    return <div>No dashboard data available</div>;
  }

  // Filter widgets based on dashboard type if not in customizing mode
  const filteredWidgets = isCustomizing 
    ? dashboard.widgets
    : dashboardType === 'general'
      ? dashboard.widgets
      : dashboard.widgets.filter(widget => 
          widget.category === dashboardType || 
          widget.favorite === true || 
          widget.pinnedToAll === true
        );

  const handleDeleteWidget = (widgetId: string) => {
    const updatedWidgets = dashboard.widgets.filter(
      (widget) => widget.id !== widgetId
    );
    
    onUpdateDashboard({
      ...dashboard,
      widgets: updatedWidgets,
    });

    toast({
      title: "Widget removed",
      description: "The widget has been removed from your dashboard",
    });
  };

  const handleToggleFavorite = (widgetId: string) => {
    const updatedWidgets = dashboard.widgets.map((widget) => {
      if (widget.id === widgetId) {
        return {
          ...widget,
          favorite: !widget.favorite,
        };
      }
      return widget;
    });

    onUpdateDashboard({
      ...dashboard,
      widgets: updatedWidgets,
    });

    toast({
      title: "Widget updated",
      description: "Widget favorite status has been updated",
    });
  };

  const handleEditWidget = (widget: Widget) => {
    setEditingWidget(widget);
  };

  const handleExplainMetric = (widget: Widget) => {
    setSelectedWidget(widget);
    setExplainMetricOpen(true);
  };

  const handleUpdateWidgets = (widgets: Widget[]) => {
    onUpdateDashboard({
      ...dashboard,
      widgets,
    });

    toast({
      title: "Dashboard updated",
      description: "Your dashboard layout has been updated",
    });
  };

  const handleSaveWidgetConfig = (widget: Widget) => {
    const updatedWidgets = dashboard.widgets.map((w) => {
      if (w.id === widget.id) {
        return widget;
      }
      return w;
    });

    onUpdateDashboard({
      ...dashboard,
      widgets: updatedWidgets,
    });

    setEditingWidget(null);

    toast({
      title: "Widget updated",
      description: "Your widget has been updated successfully",
    });
  };

  const handleOpenAddWidgetModal = () => {
    setShowAddWidgetModal(true);
  };

  const handleAddWidget = (newWidget: Widget) => {
    const updatedWidgets = [...dashboard.widgets, newWidget];
    
    onUpdateDashboard({
      ...dashboard,
      widgets: updatedWidgets,
    });
    
    setShowAddWidgetModal(false);
    
    toast({
      title: "Widget added",
      description: "The new widget has been added to your dashboard",
    });
  };

  return (
    <div className="space-y-6">
      <DashboardGrid
        widgets={filteredWidgets}
        sectionMode={isMobile ? false : sectionMode}
        onEdit={handleEditWidget}
        onDelete={handleDeleteWidget}
        onToggleFavorite={handleToggleFavorite}
        onExplainMetric={handleExplainMetric}
        onCreateWidget={handleOpenAddWidgetModal}
        onUpdateWidgets={handleUpdateWidgets}
        isCustomizing={isCustomizing}
        dashboardType={dashboardType}
      />

      {/* AI Explain Dialog */}
      <AIExplainDialog
        open={explainMetricOpen}
        onClose={() => setExplainMetricOpen(false)}
        metricId={selectedWidget?.id}
        metricName={selectedWidget?.title}
      />

      {/* Widget Config Dialog */}
      <Dialog open={!!editingWidget} onOpenChange={(open) => !open && setEditingWidget(null)}>
        <DialogContent className="max-w-5xl p-6 sm:p-8">
          {editingWidget && (
            <WidgetConfigPreview
              widget={editingWidget}
              onSave={handleSaveWidgetConfig}
              onCancel={() => setEditingWidget(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Widget Modal */}
      <AddWidgetModal
        open={showAddWidgetModal}
        onClose={() => setShowAddWidgetModal(false)}
        onAddWidget={handleAddWidget}
        dashboardType={dashboardType}
      />
    </div>
  );
};

export default DashboardContent;
