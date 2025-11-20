import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { InsightData } from "./types";
import InsightChart from "./InsightChart";
import { formatTimestamp } from "./utils/insightUtils";
import InsightCardBadges from "./InsightCardBadges";
import InsightExpandedContent from "./InsightExpandedContent";
import InsightCardActions from "./InsightCardActions";

interface InsightCardProps {
  insight: InsightData;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <InsightCardBadges 
          type={insight.type}
          severity={insight.severity}
          department={insight.department}
          confidence={insight.confidence}
        />
        
        <CardTitle className="text-lg mt-2">{insight.title}</CardTitle>
        <p className="text-xs text-muted-foreground">
          Detected {formatTimestamp(insight.timestamp)}
        </p>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {insight.description}
        </p>
        
        {insight.chartData && (
          <div className="h-48 w-full mt-4" id={`insight-chart-${insight.id}`}>
            <InsightChart type={insight.chartData.type} data={insight.chartData.data} />
          </div>
        )}
        
        <InsightExpandedContent
          expanded={expanded}
          chartData={insight.chartData}
          recommendations={insight.recommendations}
          relatedMetrics={insight.relatedMetrics}
        />
      </CardContent>
      
      <CardFooter>
        <InsightCardActions
          expanded={expanded}
          insightTitle={insight.title}
          onToggleExpand={() => setExpanded(!expanded)}
        />
      </CardFooter>
    </Card>
  );
};

export default InsightCard;
