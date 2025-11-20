
import React from "react";
import { InsightData } from "./types";
import InsightCard from "./InsightCard";

interface InsightsListProps {
  insights: InsightData[];
}

const InsightsList: React.FC<InsightsListProps> = ({ insights }) => {
  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <h3 className="text-xl font-semibold mb-2">No insights found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters to see more insights
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
};

export default InsightsList;
