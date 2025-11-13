import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

interface StatsHeaderProps {
  totalRuns: number;
  successRuns: number;
  failedRuns: number;
  runningRuns: number;
}

export const StatsHeader = ({
  totalRuns,
  successRuns,
  failedRuns,
  runningRuns,
}: StatsHeaderProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-6 border-border bg-card hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Runs</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {totalRuns}
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border bg-card hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Successful</p>
            <p className="text-3xl font-bold text-status-success mt-1">
              {successRuns}
            </p>
          </div>
          <div className="p-3 bg-status-success-bg rounded-lg">
            <CheckCircle className="w-6 h-6 text-status-success" />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border bg-card hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-3xl font-bold text-status-error mt-1">
              {failedRuns}
            </p>
          </div>
          <div className="p-3 bg-status-error-bg rounded-lg">
            <XCircle className="w-6 h-6 text-status-error" />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border bg-card hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Running</p>
            <p className="text-3xl font-bold text-status-running mt-1">
              {runningRuns}
            </p>
          </div>
          <div className="p-3 bg-status-running-bg rounded-lg">
            <Clock className="w-6 h-6 text-status-running animate-pulse" />
          </div>
        </div>
      </Card>
    </div>
  );
};
