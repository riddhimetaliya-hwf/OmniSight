import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InsightData } from "./types";
import InsightsList from "./InsightsList";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightsTabsProps {
  insights: InsightData[];
  isLoading: boolean;
  insightsByCategory: {
    critical: InsightData[];
    anomalies: InsightData[];
    forecasts: InsightData[];
    trends: InsightData[];
    other: InsightData[];
  };
  viewMode: "card" | "list"; // Added viewMode prop
}

const InsightsTabs: React.FC<InsightsTabsProps> = ({
  insights,
  isLoading,
  insightsByCategory,
  viewMode
}) => {
  const getInsightCount = () => {
    if (isLoading) return "...";
    return insights.length;
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="flex gap-2 bg-white/70 dark:bg-card/70 rounded-full shadow-lg p-1 w-fit">
        <TabsTrigger 
          value="all"
          className="px-6 py-2 rounded-full font-semibold text-base transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          All Insights
          <Badge variant="secondary" className="ml-2">{getInsightCount()}</Badge>
        </TabsTrigger>
        <TabsTrigger 
          value="critical"
          className="px-6 py-2 rounded-full font-semibold text-base transition-all data-[state=active]:bg-destructive data-[state=active]:text-white data-[state=active]:shadow-md focus:outline-none focus:ring-2 focus:ring-destructive/40"
        >
          Critical
          <Badge variant="destructive" className="ml-2">
            {isLoading ? "..." : insightsByCategory.critical.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger 
          value="anomalies"
          className="px-6 py-2 rounded-full font-semibold text-base transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          Anomalies
          <Badge variant="secondary" className="ml-2">
            {isLoading ? "..." : insightsByCategory.anomalies.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger 
          value="forecasts"
          className="px-6 py-2 rounded-full font-semibold text-base transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          Forecasts
          <Badge variant="secondary" className="ml-2">
            {isLoading ? "..." : insightsByCategory.forecasts.length}
          </Badge>
        </TabsTrigger>
      </TabsList>
      
      <div className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-36 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="all">
              <InsightsList insights={insights} />
            </TabsContent>
            <TabsContent value="critical">
              <InsightsList insights={insightsByCategory.critical} />
            </TabsContent>
            <TabsContent value="anomalies">
              <InsightsList insights={insightsByCategory.anomalies} />
            </TabsContent>
            <TabsContent value="forecasts">
              <InsightsList insights={insightsByCategory.forecasts} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default InsightsTabs;
