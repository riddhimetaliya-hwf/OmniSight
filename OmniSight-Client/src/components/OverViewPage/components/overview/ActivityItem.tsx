import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Plus,
  Trash2,
  LogIn,
  Play,
  Settings,
  UserPlus,
  Key,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityType =
  | "workflow_created"
  | "workflow_updated"
  | "workflow_deleted"
  | "workflow_executed"
  | "user_login"
  | "user_signup"
  | "settings_changed"
  | "credential_added";

export interface Activity {
  id: string;
  type: ActivityType;
  timestamp: string;
  user: {
    name: string;
    initials: string;
    color: string;
  };
  description: string;
  target?: string;
  changes?: {
    before: string;
    after: string;
  };
}

interface ActivityItemProps {
  activity: Activity;
}

export const ActivityItem = ({ activity }: ActivityItemProps) => {
  const [showChanges, setShowChanges] = useState(false);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "workflow_created":
        return {
          icon: Plus,
          color: "text-status-success",
          bg: "bg-status-success-bg",
        };
      case "workflow_updated":
        return { icon: Edit, color: "text-primary", bg: "bg-primary/10" };
      case "workflow_deleted":
        return {
          icon: Trash2,
          color: "text-status-error",
          bg: "bg-status-error-bg",
        };
      case "workflow_executed":
        return { icon: Play, color: "text-accent", bg: "bg-accent/10" };
      case "user_login":
        return { icon: LogIn, color: "text-muted-foreground", bg: "bg-muted" };
      case "user_signup":
        return {
          icon: UserPlus,
          color: "text-status-success",
          bg: "bg-status-success-bg",
        };
      case "settings_changed":
        return {
          icon: Settings,
          color: "text-status-warning",
          bg: "bg-status-warning-bg",
        };
      case "credential_added":
        return { icon: Key, color: "text-primary", bg: "bg-primary/10" };
      default:
        return { icon: Edit, color: "text-muted-foreground", bg: "bg-muted" };
    }
  };

  const iconConfig = getActivityIcon(activity.type);
  const Icon = iconConfig.icon;

  return (
    <Card
      className={cn(
        "group hover:shadow-md transition-all duration-200 cursor-pointer",
        activity.changes && "hover:border-primary/50"
      )}
      onMouseEnter={() => activity.changes && setShowChanges(true)}
      onMouseLeave={() => setShowChanges(false)}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <Avatar className={cn("w-10 h-10 shrink-0", activity.user.color)}>
            <AvatarFallback className="font-semibold">
              {activity.user.initials}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <div className={cn("p-1.5 rounded-md shrink-0", iconConfig.bg)}>
                  <Icon className={cn("w-3.5 h-3.5", iconConfig.color)} />
                </div>
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{activity.user.name}</span>{" "}
                  {activity.description}
                  {activity.target && (
                    <>
                      {" "}
                      <span className="font-semibold text-primary">
                        "{activity.target}"
                      </span>
                    </>
                  )}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.timestamp}
              </span>
            </div>

            {/* Before/After Changes */}
            {activity.changes && showChanges && (
              <div className="mt-3 p-3 bg-muted rounded-lg animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex-1">
                    <p className="text-muted-foreground mb-1 font-medium">
                      Before:
                    </p>
                    <code className="text-foreground bg-background px-2 py-1 rounded border border-border block">
                      {activity.changes.before}
                    </code>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <p className="text-muted-foreground mb-1 font-medium">
                      After:
                    </p>
                    <code className="text-foreground bg-background px-2 py-1 rounded border border-border block">
                      {activity.changes.after}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
