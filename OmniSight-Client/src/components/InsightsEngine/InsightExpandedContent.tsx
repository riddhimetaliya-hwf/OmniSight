
import React from "react";
import { Badge } from "@/components/ui/badge";
import InsightChart from "./InsightChart";

interface InsightExpandedContentProps {
  expanded: boolean;
  chartData?: any;
  recommendations?: string[];
  relatedMetrics?: string[];
}

const InsightExpandedContent: React.FC<InsightExpandedContentProps> = ({
  expanded,
  chartData,
  recommendations,
  relatedMetrics
}) => {
  if (!expanded) return null;

  return (
    <>
      {recommendations && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Recommendations:</h4>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
      
      {relatedMetrics && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Related Metrics:</h4>
          <div className="flex flex-wrap gap-2">
            {relatedMetrics.map((metric, idx) => (
              <Badge key={idx} variant="outline">
                {metric}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default InsightExpandedContent;
