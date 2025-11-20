
import React from "react";
import { Card } from "@/components/ui/card";
import { Widget } from "../../types";
import WidgetHeader from "./WidgetHeader";
import WidgetContent from "./WidgetContent";
import WidgetDescription from "./WidgetDescription";

interface WidgetCardProps {
  widget: Widget;
  onEdit: (widget: Widget) => void;
  onDelete: (widgetId: string) => void;
  onToggleFavorite: (widgetId: string) => void;
  onExplainMetric: (widget: Widget) => void;
  preview?: boolean;
  dashboardType?: 'sales' | 'finance' | 'hr' | 'operations' | 'general';
}

const WidgetCard: React.FC<WidgetCardProps> = ({
  widget,
  onEdit,
  onDelete,
  onToggleFavorite,
  onExplainMetric,
  preview = false,
  dashboardType = 'general'
}) => {
  // Apply dashboard-specific styling if needed
  const getCardClassByType = () => {
    if (!dashboardType || dashboardType === 'general') return "";
    
    const typeStyles = {
      sales: "border-l-4 border-l-blue-500",
      finance: "border-l-4 border-l-green-500",
      hr: "border-l-4 border-l-purple-500",
      operations: "border-l-4 border-l-amber-500"
    };
    
    return typeStyles[dashboardType] || "";
  };
  
  return (
    <Card className={`h-full overflow-hidden hover:shadow-md transition-shadow ${getCardClassByType()}`}>
      <WidgetHeader
        widget={widget}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
        onExplainMetric={onExplainMetric}
        preview={preview}
      />
      <WidgetContent widget={widget} />
      {widget.description && <WidgetDescription description={widget.description} />}
    </Card>
  );
};

export default WidgetCard;
