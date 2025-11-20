
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOpportunity } from "../context/OpportunityContext";
import { format, formatDistanceToNow } from "date-fns";
import { User, GitBranch, Bell, AlertTriangle, Users, CheckCircle, MessageSquare } from "lucide-react";

const OpportunityActionHistory: React.FC = () => {
  const { actions, isLoading } = useOpportunity();

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "assign":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "notify":
        return <Bell className="h-4 w-4 text-purple-500" />;
      case "escalate":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "workflow":
        return <GitBranch className="h-4 w-4 text-amber-500" />;
      case "resolve":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "create":
        return <MessageSquare className="h-4 w-4 text-teal-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Action History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Action History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {actions.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>No actions recorded yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-0">
              {actions.map((action, index) => (
                <React.Fragment key={action.id}>
                  <div className="py-3">
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {getActionIcon(action.actionType)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-sm font-medium">
                              {action.user}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {action.actionType}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(action.timestamp, { addSuffix: true })}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {action.response}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {format(action.timestamp, "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < actions.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default OpportunityActionHistory;
