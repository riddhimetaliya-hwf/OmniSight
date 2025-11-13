import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  Eye,
  Zap,
  Timer,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Execution {
  id: string;
  workflowName: string;
  status: "success" | "failed" | "running";
  timestamp: string;
  duration: string;
  triggerType: string;
  errorMessage?: string;
  nodesPassed?: number;
  totalNodes?: number;
}

interface ExecutionCardProps {
  execution: Execution;
  onRerun: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export const ExecutionCard = ({
  execution,
  onRerun,
  onViewDetails,
}: ExecutionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "success":
        return {
          icon: CheckCircle,
          color: "text-status-success",
          bgColor: "bg-status-success-bg",
          borderColor: "border-status-success/20",
          label: "Success",
        };
      case "failed":
        return {
          icon: XCircle,
          color: "text-status-error",
          bgColor: "bg-status-error-bg",
          borderColor: "border-status-error/20",
          label: "Failed",
        };
      case "running":
        return {
          icon: Clock,
          color: "text-status-running",
          bgColor: "bg-status-running-bg",
          borderColor: "border-status-running/20",
          label: "Running",
        };
      default:
        return {
          icon: Clock,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          borderColor: "border-border",
          label: "Unknown",
        };
    }
  };

  const statusConfig = getStatusConfig(execution.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card
      className={cn(
        "border-l-4 transition-all duration-200 hover:shadow-md",
        statusConfig.borderColor
      )}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left section - Status and Info */}
          <div className="flex items-start gap-4 flex-1">
            <div className={cn("p-2 rounded-lg", statusConfig.bgColor)}>
              <StatusIcon
                className={cn(
                  "w-5 h-5",
                  statusConfig.color,
                  execution.status === "running" && "animate-pulse"
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  {execution.workflowName}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {statusConfig.label}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{execution.timestamp}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" />
                  <span>{execution.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{execution.triggerType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRerun(execution.id)}
              disabled={execution.status === "running"}
              className="gap-1"
            >
              <Play className="w-3.5 h-3.5" />
              Re-run
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(execution.id)}
              className="gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-9 px-0"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            {execution.nodesPassed && execution.totalNodes && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium text-foreground">
                  {execution.nodesPassed} / {execution.totalNodes} nodes
                  completed
                </span>
              </div>
            )}

            {execution.errorMessage && (
              <div className="bg-status-error-bg border border-status-error/20 rounded-lg p-3">
                <p className="text-sm text-status-error font-medium mb-1">
                  Error Message:
                </p>
                <p className="text-sm text-foreground">
                  {execution.errorMessage}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Execution ID:</span>
              <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                {execution.id}
              </code>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
