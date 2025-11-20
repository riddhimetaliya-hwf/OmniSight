
import React from "react";
import { Widget } from "../../types";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Star, Info, Mic, MessageSquare, FileText, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface WidgetHeaderProps {
  widget: Widget;
  onEdit: (widget: Widget) => void;
  onDelete: (widgetId: string) => void;
  onToggleFavorite: (widgetId: string) => void;
  onExplainMetric: (widget: Widget) => void;
  preview?: boolean;
}

const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  widget,
  onEdit,
  onDelete,
  onToggleFavorite,
  onExplainMetric,
  preview = false
}) => {
  const navigate = useNavigate();
  
  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <CardTitle className="text-lg">{widget.title}</CardTitle>
          <div className="flex flex-wrap gap-1">
            {widget.category && (
              <Badge variant="outline" className="text-xs">
                {widget.category}
              </Badge>
            )}
            {widget.favorite && (
              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                Favorite
              </Badge>
            )}
          </div>
        </div>
        
        {!preview && (
          <div className="flex items-center">
            {/* Advanced Features Access Button - Redesigned with wow factor */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 mr-1 relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Zap className="h-4 w-4 relative z-10 group-hover:text-white transition-colors duration-300" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 backdrop-blur-sm bg-white/95 dark:bg-slate-950/95 border border-purple-200 dark:border-purple-900 shadow-lg shadow-purple-100/30 dark:shadow-purple-900/30"
              >
                <div className="py-2 px-3 border-b border-purple-100 dark:border-purple-800">
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Advanced Features</p>
                </div>
                
                <DropdownMenuItem 
                  onClick={() => navigate('/prompt-to-app')} 
                  className="group focus:bg-gradient-to-r focus:from-indigo-500/10 focus:to-purple-500/10"
                >
                  <MessageSquare className="h-4 w-4 mr-2 text-indigo-500 group-hover:text-indigo-600" />
                  <span>Prompt to App Builder</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => navigate('/voice-dashboard')} 
                  className="group focus:bg-gradient-to-r focus:from-indigo-500/10 focus:to-purple-500/10"
                >
                  <Mic className="h-4 w-4 mr-2 text-purple-500 group-hover:text-purple-600" />
                  <span>Voice Dashboard</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => navigate('/user-feedback')} 
                  className="group focus:bg-gradient-to-r focus:from-indigo-500/10 focus:to-purple-500/10"
                >
                  <FileText className="h-4 w-4 mr-2 text-pink-500 group-hover:text-pink-600" />
                  <span>User Feedback</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => navigate('/learning-resources')} 
                  className="group focus:bg-gradient-to-r focus:from-indigo-500/10 focus:to-purple-500/10"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-amber-500 group-hover:text-amber-600" />
                  <span>Learning Resources</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Original Widget Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(widget)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleFavorite(widget.id)}>
                  <Star className="h-4 w-4 mr-2" fill={widget.favorite ? "currentColor" : "none"} />
                  {widget.favorite ? "Remove from Favorites" : "Add to Favorites"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExplainMetric(widget)}>
                  <Info className="h-4 w-4 mr-2" />
                  Explain this Metric
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(widget.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </CardHeader>
  );
};

export default WidgetHeader;
