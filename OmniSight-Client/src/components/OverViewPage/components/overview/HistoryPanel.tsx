import { useState, useMemo } from "react";
import { StatsHeader } from "./StatsHeader";
import { ExecutionCard, Execution } from "./ExecutionCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface HistoryPanelProps {
  executions: Execution[];
  stats: {
    totalRuns: number;
    successRuns: number;
    failedRuns: number;
    runningRuns: number;
  };
  loading: boolean;
}

export const HistoryPanel = ({ executions, stats, loading }: HistoryPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // Filter and group executions
  const { today, yesterday, thisWeek } = useMemo(() => {
    const filtered = executions.filter((execution) => {
      const matchesSearch = execution.workflowName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    const todayExecs: Execution[] = [];
    const yesterdayExecs: Execution[] = [];
    const thisWeekExecs: Execution[] = [];

    filtered.forEach((exec) => {
      // Simple grouping based on timestamp text
      const timestamp = exec.timestamp.toLowerCase();
      
      if (timestamp.includes("today") || timestamp.includes(new Date().getDate().toString())) {
        todayExecs.push(exec);
      } else if (timestamp.includes("yesterday")) {
        yesterdayExecs.push(exec);
      } else {
        thisWeekExecs.push(exec);
      }
    });

    return {
      today: todayExecs,
      yesterday: yesterdayExecs,
      thisWeek: thisWeekExecs,
    };
  }, [executions, searchQuery]);

  const handleRerun = (id: string) => {
    toast.success(`Rerunning workflow ${id}`);
  };

  const handleViewDetails = (id: string) => {
    toast.info(`Viewing details for execution ${id}`);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDateRange({});
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <StatsHeader
          totalRuns={0}
          successRuns={0}
          failedRuns={0}
          runningRuns={0}
        />
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Loading executions...
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
      {/* Stats Header */}
      <StatsHeader
        totalRuns={stats.totalRuns}
        successRuns={stats.successRuns}
        failedRuns={stats.failedRuns}
        runningRuns={stats.runningRuns}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="w-4 h-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM dd")} -{" "}
                    {format(dateRange.to, "MMM dd")}
                  </>
                ) : (
                  format(dateRange.from, "MMM dd, yyyy")
                )
              ) : (
                "Select date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) =>
                setDateRange({ from: range?.from, to: range?.to })
              }
              numberOfMonths={2}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {(searchQuery || dateRange.from) && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {/* Today */}
        {today.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-foreground">Today</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="space-y-3">
              {today.map((execution) => (
                <ExecutionCard
                  key={execution.id}
                  execution={execution}
                  onRerun={handleRerun}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* Yesterday */}
        {yesterday.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-foreground">
                Yesterday
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="space-y-3">
              {yesterday.map((execution) => (
                <ExecutionCard
                  key={execution.id}
                  execution={execution}
                  onRerun={handleRerun}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* This Week */}
        {thisWeek.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-foreground">
                This Week
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="space-y-3">
              {thisWeek.map((execution) => (
                <ExecutionCard
                  key={execution.id}
                  execution={execution}
                  onRerun={handleRerun}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {today.length === 0 &&
          yesterday.length === 0 &&
          thisWeek.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No executions found
              </h3>
              <p className="text-muted-foreground">
                {executions.length === 0
                  ? "No executions have been recorded yet. Create and run a workflow to see execution history."
                  : "Try adjusting your search or date filters"}
              </p>
            </div>
          )}
      </div>
    </div>
  );
};