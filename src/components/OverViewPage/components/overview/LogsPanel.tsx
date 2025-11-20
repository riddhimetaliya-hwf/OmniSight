import { useState, useMemo } from "react";
import { LogEntryComponent, LogEntry, LogLevel } from "./LogEntry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Download, 
  AlertCircle, 
  AlertTriangle, 
  Calendar,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LogsPanelProps {
  logs: LogEntry[];
  loading: boolean;
  onRefresh?: () => void;
}

export const LogsPanel = ({ logs, loading, onRefresh }: LogsPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "errors" | "warnings" | "today">("all");
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto-refresh when enabled
  useMemo(() => {
    if (!autoRefresh || !onRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    // Apply filter
    switch (activeFilter) {
      case "errors":
        filtered = filtered.filter(log => log.level === "error");
        break;
      case "warnings":
        filtered = filtered.filter(log => log.level === "warning");
        break;
      case "today":
        const today = format(new Date(), "yyyy-MM-dd");
        filtered = filtered.filter(log => log.timestamp.startsWith(today));
        break;
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.executionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [logs, activeFilter, searchTerm]);

  const handleDownloadLogs = () => {
    const logText = filteredLogs
      .map(log => `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.workflowName}] ${log.message}`)
      .join("\n");

    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${format(new Date(), "yyyy-MM-dd-HHmmss")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Logs downloaded successfully");
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      toast.success("Refreshing logs...");
    }
  };

  const errorCount = logs.filter(l => l.level === "error").length;
  const warningCount = logs.filter(l => l.level === "warning").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-32 bg-muted rounded-md animate-pulse"></div>
            <div className="h-10 w-32 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Loading logs...
          </h3>
          <p className="text-sm text-muted-foreground">
            Fetching data from database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs by message, workflow, or execution ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-mono"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
              disabled={!onRefresh}
            />
            <Label htmlFor="auto-refresh" className="cursor-pointer flex items-center gap-2">
              <RefreshCw className={cn("w-4 h-4", autoRefresh && "animate-spin")} />
              Auto-refresh
            </Label>
          </div>

          {onRefresh && (
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleDownloadLogs}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          onClick={() => setActiveFilter("all")}
          size="sm"
          className="gap-2"
        >
          All Logs
          <Badge variant="secondary" className="ml-1">
            {logs.length}
          </Badge>
        </Button>

        <Button
          variant={activeFilter === "errors" ? "default" : "outline"}
          onClick={() => setActiveFilter("errors")}
          size="sm"
          className="gap-2"
        >
          <AlertCircle className="w-4 h-4 text-status-error" />
          Errors Only
          <Badge variant="secondary" className="ml-1">
            {errorCount}
          </Badge>
        </Button>

        <Button
          variant={activeFilter === "warnings" ? "default" : "outline"}
          onClick={() => setActiveFilter("warnings")}
          size="sm"
          className="gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-status-warning" />
          Warnings
          <Badge variant="secondary" className="ml-1">
            {warningCount}
          </Badge>
        </Button>

        <Button
          variant={activeFilter === "today" ? "default" : "outline"}
          onClick={() => setActiveFilter("today")}
          size="sm"
          className="gap-2"
        >
          <Calendar className="w-4 h-4" />
          Today's Logs
        </Button>

        {activeFilter !== "all" && (
          <Button
            variant="ghost"
            onClick={() => setActiveFilter("all")}
            size="sm"
          >
            Clear Filter
          </Button>
        )}
      </div>

      {/* Log Entries */}
      <div className="space-y-3">
        {filteredLogs.length > 0 ? (
          filteredLogs.map(log => (
            <LogEntryComponent
              key={log.id}
              log={log}
              searchTerm={searchTerm}
            />
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No logs found</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Try adjusting your search term or filter"
                : logs.length === 0
                ? "No logs available yet. Execute workflows to generate logs."
                : "No logs match the current filter"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};