import React from "react";
import { Widget } from "../../types";
import DashboardWidget from "../../DashboardWidget";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DraggableGridProps {
  widgets: Widget[];
  onWidgetsUpdate: (widgets: Widget[]) => void;
  onEdit: (widget: Widget) => void;
  onDelete: (widgetId: string) => void;
  onToggleFavorite: (widgetId: string) => void;
  onExplainMetric: (widget: Widget) => void;
  isDragEnabled: boolean;
  onAddWidget?: () => void;
}

const DraggableGrid: React.FC<DraggableGridProps> = ({
  widgets,
  onWidgetsUpdate,
  onEdit,
  onDelete,
  onToggleFavorite,
  onExplainMetric,
  isDragEnabled,
  onAddWidget
}) => {
  // In a real implementation, this would use a drag-and-drop library
  // For simplicity, we're just rendering the widgets in a grid
  
  return (
    <div className="relative">
      {isDragEnabled && (
        <div className="bg-muted/20 absolute inset-0 rounded-lg pointer-events-none border border-dashed border-muted-foreground/30"></div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {widgets.map((widget) => (
          <div 
            key={widget.id} 
            className={`
              ${widget.columnSpan === 2 ? 'md:col-span-2' : ''} 
              ${widget.columnSpan === 3 ? 'md:col-span-3' : ''}
              ${widget.rowSpan === 2 ? 'row-span-2' : ''}
            `}
          >
            <DashboardWidget
              widget={widget}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onExplainMetric={onExplainMetric}
            />
          </div>
        ))}
        
        {/* Add Widget button when in customize mode */}
        {isDragEnabled && onAddWidget && (
          <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-lg flex items-center justify-center p-6 min-h-[200px]">
            <Button onClick={onAddWidget} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Widget
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableGrid;
