import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface InsightsHeaderProps {
  onRefresh: () => void;
}

const InsightsHeader: React.FC<InsightsHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insights Engine</h1>
        <p className="text-muted-foreground text-sm">
          AI-powered analysis and recommendations based on your business data
        </p>
      </div>
    </div>
  );
};

export default InsightsHeader;
