import { useState, useMemo } from "react";
import { ActivityItem, Activity, ActivityType } from "./ActivityItem";
import { ActivityStats } from "./ActivityStats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Edit, LogIn, Settings } from "lucide-react";

interface ActivityPanelProps {
  activities: Activity[];
  loading: boolean;
}

export const ActivityPanel = ({ activities, loading }: ActivityPanelProps) => {
  const [activeFilter, setActiveFilter] = useState<"all" | "workflows" | "users" | "system">("all");

  // Filter activities
  const filteredActivities = useMemo(() => {
    switch (activeFilter) {
      case "workflows":
        return activities.filter(a => 
          a.type.includes("workflow")
        );
      case "users":
        return activities.filter(a => 
          a.type === "user_login" || a.type === "user_signup"
        );
      case "system":
        return activities.filter(a => 
          a.type === "settings_changed" || a.type === "credential_added"
        );
      default:
        return activities;
    }
  }, [activities, activeFilter]);

  // Group activities by time
  const { thisMorning, yesterday, lastWeek } = useMemo(() => {
    const morning: Activity[] = [];
    const yest: Activity[] = [];
    const week: Activity[] = [];

    filteredActivities.forEach(activity => {
      const timestamp = activity.timestamp.toLowerCase();
      
      if (timestamp.includes("am") || timestamp.includes("pm")) {
        if (morning.length < 3) {
          morning.push(activity);
        } else if (yest.length < 3) {
          yest.push(activity);
        } else {
          week.push(activity);
        }
      } else {
        week.push(activity);
      }
    });

    return {
      thisMorning: morning,
      yesterday: yest,
      lastWeek: week
    };
  }, [filteredActivities]);

  // Calculate stats
  const stats = useMemo(() => {
    const workflowCounts: Record<string, number> = {};
    const userCounts: Record<string, { name: string; initials: string; color: string; count: number }> = {};

    activities.forEach(activity => {
      if (activity.target) {
        workflowCounts[activity.target] = (workflowCounts[activity.target] || 0) + 1;
      }
      
      const userName = activity.user.name;
      if (!userCounts[userName]) {
        userCounts[userName] = {
          name: activity.user.name,
          initials: activity.user.initials,
          color: activity.user.color,
          count: 0
        };
      }
      userCounts[userName].count++;
    });

    const mostActive = Object.entries(workflowCounts)
      .map(([name, count]) => ({
        name,
        count,
        trend: (Math.random() > 0.5 ? "up" : "stable") as "up" | "down" | "stable"
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentUsers = Object.values(userCounts)
      .map(user => ({
        name: user.name,
        initials: user.initials,
        color: user.color,
        actions: user.count
      }))
      .sort((a, b) => b.actions - a.actions)
      .slice(0, 5);

    return {
      mostActiveWorkflows: mostActive,
      recentUsers,
      totalActions: activities.length
    };
  }, [activities]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            {["All Activity", "Workflow Changes", "User Actions", "System Events"].map((text) => (
              <Button key={text} variant="outline" size="sm" disabled>
                {text}
              </Button>
            ))}
          </div>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Loading activities...
            </h3>
            <p className="text-sm text-muted-foreground">
              Fetching data from database...
            </p>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-4">
          <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Activity Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            size="sm"
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            All Activity
            <Badge variant="secondary" className="ml-1">
              {activities.length}
            </Badge>
          </Button>

          <Button
            variant={activeFilter === "workflows" ? "default" : "outline"}
            onClick={() => setActiveFilter("workflows")}
            size="sm"
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Workflow Changes
            <Badge variant="secondary" className="ml-1">
              {activities.filter(a => a.type.includes("workflow")).length}
            </Badge>
          </Button>

          <Button
            variant={activeFilter === "users" ? "default" : "outline"}
            onClick={() => setActiveFilter("users")}
            size="sm"
            className="gap-2"
          >
            <LogIn className="w-4 h-4" />
            User Actions
            <Badge variant="secondary" className="ml-1">
              {activities.filter(a => a.type === "user_login" || a.type === "user_signup").length}
            </Badge>
          </Button>

          <Button
            variant={activeFilter === "system" ? "default" : "outline"}
            onClick={() => setActiveFilter("system")}
            size="sm"
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            System Events
            <Badge variant="secondary" className="ml-1">
              {activities.filter(a => a.type === "settings_changed" || a.type === "credential_added").length}
            </Badge>
          </Button>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-8">
          {/* This Morning */}
          {thisMorning.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">This Morning</h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-3">
                {thisMorning.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          )}

          {/* Yesterday */}
          {yesterday.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Yesterday</h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-3">
                {yesterday.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          )}

          {/* Last Week */}
          {lastWeek.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Last Week</h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-3">
                {lastWeek.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredActivities.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No activities found</h3>
              <p className="text-muted-foreground">
                {activities.length === 0
                  ? "No activities recorded yet. Start using workflows to see activity here."
                  : "Try selecting a different filter"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Sidebar */}
      <div className="lg:col-span-1">
        <ActivityStats
          mostActiveWorkflows={stats.mostActiveWorkflows}
          recentUsers={stats.recentUsers}
          totalActions={stats.totalActions}
        />
      </div>
    </div>
  );
};