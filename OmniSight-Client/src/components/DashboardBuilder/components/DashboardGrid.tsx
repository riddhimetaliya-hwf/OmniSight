
import React from 'react';
import { Widget, DashboardType } from '../types';
import DraggableGrid from './grid/DraggableGrid';

interface DashboardGridProps {
  widgets: Widget[];
  sectionMode: boolean;
  onEdit: (widget: Widget) => void;
  onDelete: (widgetId: string) => void;
  onToggleFavorite: (widgetId: string) => void;
  onExplainMetric: (widget: Widget) => void;
  onCreateWidget?: () => void;
  onUpdateWidgets: (widgets: Widget[]) => void;
  isCustomizing: boolean;
  dashboardType: DashboardType;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets,
  sectionMode,
  onEdit,
  onDelete,
  onToggleFavorite,
  onExplainMetric,
  onCreateWidget,
  onUpdateWidgets,
  isCustomizing,
  dashboardType
}) => {
  return (
    <DraggableGrid
      widgets={widgets}
      onWidgetsUpdate={onUpdateWidgets}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleFavorite={onToggleFavorite}
      onExplainMetric={onExplainMetric}
      isDragEnabled={isCustomizing}
      onAddWidget={onCreateWidget}
    />
  );
};

export default DashboardGrid;
