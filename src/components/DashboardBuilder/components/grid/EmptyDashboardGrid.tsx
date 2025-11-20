
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, LayoutDashboard } from "lucide-react";

interface EmptyDashboardGridProps {
  onCreateWidget?: () => void;
}

const EmptyDashboardGrid: React.FC<EmptyDashboardGridProps> = ({ onCreateWidget }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-muted rounded-lg bg-muted/20 min-h-[400px] text-center">
      <LayoutDashboard className="h-16 w-16 mb-4 text-muted-foreground/70" />
      <h3 className="text-xl font-medium mb-2">No widgets in this dashboard</h3>
      <p className="text-muted-foreground mb-6 max-w-lg">
        Add widgets to display data visualizations, KPIs, and other metrics in your dashboard.
      </p>
      <Button onClick={onCreateWidget}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Widget
      </Button>
    </div>
  );
};

export default EmptyDashboardGrid;
