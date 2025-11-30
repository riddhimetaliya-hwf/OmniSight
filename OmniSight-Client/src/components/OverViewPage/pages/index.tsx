import { useState, useEffect } from "react";
import { TabNavigation } from "@/components/OverViewPage/components/overview/TabNavigation ";
import { HistoryPanel } from "@/components/OverViewPage/components/overview/HistoryPanel";
import { LogsPanel } from "@/components/OverViewPage/components/overview/LogsPanel";
import { ActivityPanel } from "@/components/OverViewPage/components/overview/ActivityPanel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface OverviewStats {
  activeWorkflows: number;
  completedToday: number;
  pendingTasks: number;
  alerts: number;
}

interface Execution {
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

interface Activity {
  id: string;
  type: string;
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

interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  workflowName: string;
  executionId: string;
  details?: {
    stackTrace?: string;
    context?: Record<string, any>;
    metadata?: Record<string, any>;
  };
}

interface OverviewData {
  stats: OverviewStats;
  executions: Execution[];
  activities: Activity[];
  logs: LogEntry[];
}

import apiClient, { API_ENDPOINTS } from "@/services/api";

const Index = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [overviewData, setOverviewData] = useState<OverviewData>({
    stats: {
      activeWorkflows: 0,
      completedToday: 0,
      pendingTasks: 0,
      alerts: 0,
    },
    executions: [],
    activities: [],
    logs: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch all overview data from single API endpoint
  const fetchOverviewData = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get<OverviewData>(
        API_ENDPOINTS.OVERVIEW.ALL
      );

      if (response.success && response.data) {
        setOverviewData(response.data);
        toast.success("Overview data loaded successfully");
      } else {
        console.error("❌ Failed to fetch overview data:", response.error);
        toast.error("Failed to load overview data");
      }
    } catch (error) {
      console.error("❌ Error fetching overview data:", error);
      toast.error("Error fetching data - Check if API is running");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOverviewData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate execution stats for HistoryPanel
  const executionStats = {
    totalRuns: overviewData.executions.length,
    successRuns: overviewData.executions.filter((e) => e.status === "success")
      .length,
    failedRuns: overviewData.executions.filter((e) => e.status === "failed")
      .length,
    runningRuns: overviewData.executions.filter((e) => e.status === "running")
      .length,
  };

  // Stats cards data
  const statCards = [
    {
      label: "Active Workflows",
      value: loading ? "..." : overviewData.stats.activeWorkflows.toString(),
      icon: Activity,
      color: "text-blue-600",
    },
    {
      label: "Completed Today",
      value: loading ? "..." : overviewData.stats.completedToday.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Pending Tasks",
      value: loading ? "..." : overviewData.stats.pendingTasks.toString(),
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: "Alerts",
      value: loading ? "..." : overviewData.stats.alerts.toString(),
      icon: AlertCircle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Workflow Overview
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor executions, logs, and system activity
              </p>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              Live
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-sm bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="animate-in fade-in duration-300">
              {activeTab === "history" && (
                <HistoryPanel
                  executions={overviewData.executions}
                  stats={executionStats}
                  loading={loading}
                />
              )}
              {activeTab === "logs" && (
                <LogsPanel
                  logs={overviewData.logs}
                  loading={loading}
                  onRefresh={fetchOverviewData}
                />
              )}
              {activeTab === "activity" && (
                <ActivityPanel
                  activities={overviewData.activities}
                  loading={loading}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
