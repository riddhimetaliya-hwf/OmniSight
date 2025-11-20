
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Filter, RefreshCw } from "lucide-react";
import { useOpportunity } from "../context/OpportunityContext";
import OpportunityFilters from "./OpportunityFilters";
import { useToast } from "@/hooks/use-toast";

const OpportunityHeader: React.FC = () => {
  const { filters, updateFilters, isLoading } = useOpportunity();
  const { toast } = useToast();
  const [showFilters, setShowFilters] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchQuery: e.target.value });
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshing data",
      description: "Fetching the latest opportunities...",
    });
    // In a real app, this would trigger a data refresh
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-purple-500" />
          <h1 className="text-2xl font-bold">Opportunity Responder</h1>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            disabled={isLoading}
            onClick={handleRefresh}
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            variant={showFilters ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/2">
          <Input
            placeholder="Search opportunities..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2 items-center ml-auto">
          <p className="text-sm text-muted-foreground">
            Respond to critical issues in real-time and track actions
          </p>
        </div>
      </div>
      
      {showFilters && <OpportunityFilters />}
    </div>
  );
};

export default OpportunityHeader;
