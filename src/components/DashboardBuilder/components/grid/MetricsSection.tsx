
import React from "react";
import { Widget } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import DashboardWidget from "../../DashboardWidget";
import { SmartTooltip } from "@/components/OmniGuide";

interface MetricsSectionProps {
  title: string;
  tooltipId: string;
  tooltipContent: string;
  widgets: Widget[];
  expandedSection: string | null;
  toggleSection: (section: string) => void;
  sectionKey: string;
  onEdit: (widget: Widget) => void;
  onDelete: (widgetId: string) => void;
  onToggleFavorite: (widgetId: string) => void;
  onExplainMetric: (widget: Widget) => void;
  getWidgetSizeClass: (widget: Widget) => string;
  isCustomizing?: boolean;
  onAddWidget?: () => void;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({
  title,
  tooltipId,
  tooltipContent,
  widgets,
  expandedSection,
  toggleSection,
  sectionKey,
  onEdit,
  onDelete,
  onToggleFavorite,
  onExplainMetric,
  getWidgetSizeClass,
  isCustomizing = false,
  onAddWidget
}) => {
  const isExpanded = expandedSection === sectionKey;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center">
          <CardTitle className="text-lg">
            <SmartTooltip
              tooltipId={tooltipId}
              title={title}
              content={tooltipContent}
              placement="top"
            >
              <span>{title}</span>
            </SmartTooltip>
          </CardTitle>
          <span className="ml-2 text-muted-foreground text-sm">
            ({widgets.length})
          </span>
        </div>
        
        <div className="flex gap-2">
          {isCustomizing && onAddWidget && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddWidget();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Here
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleSection(sectionKey)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map((widget) => (
              <div key={widget.id} className={getWidgetSizeClass(widget)}>
                <DashboardWidget
                  widget={widget}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                  onExplainMetric={onExplainMetric}
                />
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default MetricsSection;
