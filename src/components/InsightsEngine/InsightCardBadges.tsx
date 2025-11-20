
import React from "react";
import { Badge } from "@/components/ui/badge";
import { InsightSeverity, InsightType } from "./types";
import { getTypeIcon, getSeverityColor } from "./utils/insightUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Star } from "lucide-react";

interface InsightCardBadgesProps {
  type: InsightType;
  severity: InsightSeverity;
  department: string;
  confidence: number;
}

const InsightCardBadges: React.FC<InsightCardBadgesProps> = ({
  type,
  severity,
  department,
  confidence
}) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className="flex items-center gap-1">
          {getTypeIcon(type)}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
        
        <Badge className={getSeverityColor(severity)}>
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </Badge>
        
        <Badge variant="secondary">
          {department.charAt(0).toUpperCase() + department.slice(1)}
        </Badge>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium ml-1">{confidence}%</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Confidence level: {confidence}%</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default InsightCardBadges;
