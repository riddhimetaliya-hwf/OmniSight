
import React from "react";
import { Widget } from "./types";
import { WidgetCard } from "./components/WidgetComponents";

interface DashboardWidgetProps {
  widget: Widget;
  onEdit: (widget: Widget) => void;
  onDelete: (widgetId: string) => void;
  onToggleFavorite: (widgetId: string) => void;
  onExplainMetric: (widget: Widget) => void;
  preview?: boolean;
  dashboardType?: 'sales' | 'finance' | 'hr' | 'operations' | 'general';
}

const DashboardWidget: React.FC<DashboardWidgetProps> = (props) => {
  // Apply dashboard-specific styling or behavior based on the dashboardType if needed
  return <WidgetCard {...props} />;
};

export default DashboardWidget;
