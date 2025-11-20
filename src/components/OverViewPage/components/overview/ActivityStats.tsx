import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Zap } from "lucide-react";

interface WorkflowStat {
  name: string;
  count: number;
  trend: "up" | "down" | "stable";
}

interface UserStat {
  name: string;
  initials: string;
  color: string;
  actions: number;
}

interface ActivityStatsProps {
  mostActiveWorkflows: WorkflowStat[];
  recentUsers: UserStat[];
  totalActions: number;
}

export const ActivityStats = ({
  mostActiveWorkflows,
  recentUsers,
  totalActions,
}: ActivityStatsProps) => {
  return (
    <div className="space-y-4">
      {/* Total Actions */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Actions</p>
            <p className="text-3xl font-bold text-foreground">{totalActions}</p>
          </div>
          <div className="p-3 bg-primary/20 rounded-lg">
            <Zap className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      {/* Most Active Workflows */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            Most Active Workflows
          </h3>
        </div>
        <div className="space-y-3">
          {mostActiveWorkflows.map((workflow, index) => (
            <div
              key={workflow.name}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {workflow.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {workflow.count} actions
                  </p>
                </div>
              </div>
              <Badge
                variant={workflow.trend === "up" ? "default" : "secondary"}
                className="text-xs"
              >
                {workflow.trend === "up"
                  ? "↑"
                  : workflow.trend === "down"
                  ? "↓"
                  : "→"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Users */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Recent Users</h3>
        </div>
        <div className="space-y-3">
          {recentUsers.map((user) => (
            <div
              key={user.name}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={
                    user.color +
                    " w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  }
                >
                  {user.initials}
                </div>
                <p className="text-sm font-medium text-foreground">
                  {user.name}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {user.actions} actions
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
