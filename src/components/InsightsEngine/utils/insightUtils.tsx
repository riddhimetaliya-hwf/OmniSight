
import { InsightSeverity, InsightType } from "../types";
import { 
  AlertTriangle, 
  BarChart, 
  Clock, 
  LineChart, 
  Share2, 
  TrendingUp 
} from "lucide-react";

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, { 
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

export const getTypeIcon = (type: InsightType) => {
  switch (type) {
    case "anomaly":
      return <AlertTriangle className="h-4 w-4" />;
    case "trend":
      return <TrendingUp className="h-4 w-4" />;
    case "forecast":
      return <Clock className="h-4 w-4" />;
    case "root-cause":
      return <Share2 className="h-4 w-4" />;
    case "correlation":
      return <LineChart className="h-4 w-4" />;
    default:
      return <BarChart className="h-4 w-4" />;
  }
};

export const getSeverityColor = (severity: InsightSeverity): string => {
  switch (severity) {
    case "critical":
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    case "high":
      return "bg-orange-500 text-white hover:bg-orange-600";
    case "medium":
      return "bg-yellow-500 text-white hover:bg-yellow-600";
    case "low":
      return "bg-blue-500 text-white hover:bg-blue-600";
    case "info":
      return "bg-green-500 text-white hover:bg-green-600";
    default:
      return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
  }
};
