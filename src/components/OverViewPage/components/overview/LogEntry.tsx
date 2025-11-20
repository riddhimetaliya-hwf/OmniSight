import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type LogLevel = "error" | "warning" | "info" | "debug";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  workflowName: string;
  executionId: string;
  details?: {
    stackTrace?: string;
    context?: Record<string, any>;
    metadata?: Record<string, any>;
  };
}

interface LogEntryProps {
  log: LogEntry;
  searchTerm?: string;
}

export const LogEntryComponent = ({ log, searchTerm }: LogEntryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLevelConfig = (level: LogLevel) => {
    switch (level) {
      case "error":
        return {
          icon: AlertCircle,
          color: "text-status-error",
          bgColor: "bg-status-error-bg",
          borderColor: "border-status-error/30",
          label: "ERROR",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-status-warning",
          bgColor: "bg-status-warning-bg",
          borderColor: "border-status-warning/30",
          label: "WARN",
        };
      case "info":
        return {
          icon: Info,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          borderColor: "border-border",
          label: "INFO",
        };
      case "debug":
        return {
          icon: CheckCircle,
          color: "text-status-success",
          bgColor: "bg-status-success-bg",
          borderColor: "border-status-success/30",
          label: "DEBUG",
        };
      default:
        return {
          icon: Info,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          borderColor: "border-border",
          label: "LOG",
        };
    }
  };

  const levelConfig = getLevelConfig(log.level);
  const LevelIcon = levelConfig.icon;

  const handleCopy = () => {
    const copyText = `[${log.timestamp}] [${log.level.toUpperCase()}] [${
      log.workflowName
    }]\n${log.message}${
      log.details?.stackTrace
        ? `\n\nStack Trace:\n${log.details.stackTrace}`
        : ""
    }`;
    navigator.clipboard.writeText(copyText);
    toast.success("Log entry copied to clipboard");
  };

  const highlightText = (text: string, search?: string) => {
    if (!search) return text;

    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Card
      className={cn(
        "border-l-4 transition-all duration-200",
        levelConfig.borderColor
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Level Icon */}
          <div className={cn("p-1.5 rounded-md shrink-0", levelConfig.bgColor)}>
            <LevelIcon className={cn("w-4 h-4", levelConfig.color)} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn("font-mono text-xs", levelConfig.color)}
                >
                  {levelConfig.label}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {log.timestamp}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-medium text-foreground">
                  {log.workflowName}
                </span>
                <Badge variant="secondary" className="text-xs font-mono">
                  {log.executionId.slice(0, 8)}
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                {log.details && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-7 px-2"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Log Message */}
            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-words">
              {highlightText(log.message, searchTerm)}
            </pre>

            {/* Expanded Details */}
            {isExpanded && log.details && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                {log.details.stackTrace && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      STACK TRACE:
                    </p>
                    <pre className="text-xs font-mono text-foreground bg-muted p-3 rounded-md overflow-x-auto">
                      {log.details.stackTrace}
                    </pre>
                  </div>
                )}

                {log.details.context && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      CONTEXT:
                    </p>
                    <pre className="text-xs font-mono text-foreground bg-muted p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(log.details.context, null, 2)}
                    </pre>
                  </div>
                )}

                {log.details.metadata && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      METADATA:
                    </p>
                    <pre className="text-xs font-mono text-foreground bg-muted p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(log.details.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
