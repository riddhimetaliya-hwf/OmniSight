
import React from 'react';
import { Widget, WidgetPriority } from '../types';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star, Trash2, Edit, Download, BarChart2, MessageSquare } from 'lucide-react';
import { DataQualityIndicator } from '@/components/DataQuality/DataQualityIndicator';
import { useToast } from '@/hooks/use-toast';

interface WidgetHeaderProps {
  widget: Widget;
  onEdit: (widget: Widget) => void;
  onDelete: (widgetId: string) => void;
  onToggleFavorite: (widgetId: string) => void;
  onExplainMetric: (widget: Widget) => void;
}

const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  widget,
  onEdit,
  onDelete,
  onToggleFavorite,
  onExplainMetric
}) => {
  const { toast } = useToast();

  const handleExportWidget = () => {
    toast({
      title: "Widget exported",
      description: `${widget.title} has been exported successfully.`
    });
  };

  const getPriorityColor = (priority?: WidgetPriority) => {
    if (!priority) return '';
    
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <CardHeader className="flex flex-row items-start justify-between p-4 pb-0 space-y-0">
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center gap-2">
          <CardTitle>{widget.title}</CardTitle>
          {widget.priority && (
            <div className={`px-1.5 py-0.5 rounded-sm text-xs font-medium ${getPriorityColor(widget.priority)}`}>
              {widget.priority.charAt(0).toUpperCase() + widget.priority.slice(1)}
            </div>
          )}
          
          {widget.dataQuality && (
            <DataQualityIndicator 
              qualityScore={{
                overall: widget.dataQuality.score,
                completeness: widget.dataQuality.completeness,
                accuracy: widget.dataQuality.accuracy,
                consistency: widget.dataQuality.consistency,
                timeliness: widget.dataQuality.timeliness
              }}
              size="small"
            />
          )}
        </div>
      </div>
      <div className="flex gap-1">
        {widget.config?.showAnnotations !== false && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              toast({
                title: "Annotations",
                description: "Annotation feature opened for this widget."
              });
            }}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onExplainMetric(widget)}
        >
          <BarChart2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${widget.favorite ? 'text-yellow-500' : ''}`}
          onClick={() => onToggleFavorite(widget.id)}
        >
          <Star className="h-4 w-4" fill={widget.favorite ? "currentColor" : "none"} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(widget)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleFavorite(widget.id)}>
              <Star className="mr-2 h-4 w-4" />
              {widget.favorite ? 'Remove from favorites' : 'Add to favorites'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportWidget}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(widget.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
  );
};

export default WidgetHeader;
