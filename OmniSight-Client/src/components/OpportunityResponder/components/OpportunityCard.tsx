
import React, { useState } from "react";
import { Opportunity } from "../types";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ZapOff, Zap, Users, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import OpportunityResponsePanel from "./OpportunityResponsePanel";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const [showResponsePanel, setShowResponsePanel] = useState(false);

  const getSeverityBadge = () => {
    switch (opportunity.severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (opportunity.status) {
      case "new":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">New</Badge>;
      case "responded":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Responded</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Resolved</Badge>;
      case "escalated":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Escalated</Badge>;
      default:
        return null;
    }
  };

  const getSourceIcon = () => {
    switch (opportunity.source) {
      case "system":
        return <Zap className="h-4 w-4 text-purple-500" />;
      case "manual":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "voice-command":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "workflow":
        return <Zap className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-2 mb-1">
          {getSeverityBadge()}
          {getStatusBadge()}
          <Badge variant="outline">{opportunity.department}</Badge>
        </div>
        
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-medium">{opportunity.title}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDistanceToNow(opportunity.timestamp, { addSuffix: true })}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground">{opportunity.description}</p>
        
        {opportunity.assignedTo && (
          <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
            <span>Assigned to: </span>
            <Badge variant="outline" className="text-xs">
              {opportunity.assignedTo}
            </Badge>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {getSourceIcon()}
          <span>
            {opportunity.source === "system" ? "System detected" :
             opportunity.source === "manual" ? "Manually created" :
             opportunity.source === "voice-command" ? "Voice created" :
             "Workflow triggered"}
          </span>
        </div>
        
        <Button 
          variant={opportunity.status === "new" || opportunity.status === "escalated" ? "default" : "outline"}
          size="sm"
          onClick={() => setShowResponsePanel(!showResponsePanel)}
          className="gap-2"
        >
          {showResponsePanel ? <ZapOff className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
          {showResponsePanel ? "Cancel" : "Respond"}
        </Button>
      </CardFooter>
      
      {showResponsePanel && (
        <OpportunityResponsePanel 
          opportunity={opportunity}
          onClose={() => setShowResponsePanel(false)}
        />
      )}
    </Card>
  );
};

export default OpportunityCard;
