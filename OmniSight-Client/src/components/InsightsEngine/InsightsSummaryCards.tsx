
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BarChart, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightsSummaryCardsProps {
  isLoading: boolean;
  criticalCount: number;
  trendsCount: number;
  totalCount: number;
}

const InsightsSummaryCards: React.FC<InsightsSummaryCardsProps> = ({
  isLoading,
  criticalCount,
  trendsCount,
  totalCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
            Critical Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">
                {criticalCount}
              </span>
              <Badge variant="destructive" className="ml-2">
                Urgent
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            Active Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">
                {trendsCount}
              </span>
              <span className="text-muted-foreground ml-2">trends detected</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BarChart className="h-5 w-5 text-green-500 mr-2" />
            Total Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{totalCount}</span>
              <span className="text-muted-foreground ml-2">across all categories</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsSummaryCards;
