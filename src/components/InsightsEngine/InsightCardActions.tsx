
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface InsightCardActionsProps {
  expanded: boolean;
  insightTitle: string;
  onToggleExpand: () => void;
}

const InsightCardActions: React.FC<InsightCardActionsProps> = ({
  expanded,
  insightTitle,
  onToggleExpand
}) => {
  const { toast } = useToast();

  const handleCreateTask = () => {
    toast({
      title: "Task Created",
      description: `New task created for: ${insightTitle}`,
    });
  };

  const handleCreateAlert = () => {
    toast({
      title: "Alert Set",
      description: `You'll be alerted about changes to: ${insightTitle}`,
    });
  };

  const handleShareInsight = () => {
    toast({
      title: "Insight Shared",
      description: "Link copied to clipboard",
    });
  };

  const handleCreateReport = () => {
    toast({
      title: "Report Scheduled",
      description: "Detailed report will be delivered to your email",
    });
  };

  return (
    <div className="flex justify-between pt-0">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onToggleExpand}
      >
        {expanded ? "Show Less" : "Show More"}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Insight Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCreateTask}>Create Task</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCreateAlert}>Set Alert</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCreateReport}>Generate Report</DropdownMenuItem>
          <DropdownMenuItem onClick={handleShareInsight}>Share Insight</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default InsightCardActions;
