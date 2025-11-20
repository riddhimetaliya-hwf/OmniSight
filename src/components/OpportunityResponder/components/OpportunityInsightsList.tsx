
import React from "react";
import { useOpportunity } from "../context/OpportunityContext";
import OpportunityCard from "./OpportunityCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";

const OpportunityInsightsList: React.FC = () => {
  const { opportunities, filters, isLoading } = useOpportunity();

  // Filter opportunities based on current filters
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSeverity = filters.severity === "all" || opp.severity === filters.severity;
    const matchesDepartment = filters.department === "all" || opp.department === filters.department;
    const matchesStatus = filters.status === "all" || opp.status === filters.status;
    const matchesSearch = !filters.searchQuery || 
      opp.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesSeverity && matchesDepartment && matchesStatus && matchesSearch;
  });

  const pendingOpportunities = filteredOpportunities.filter(
    (opp) => opp.status === "new" || opp.status === "escalated"
  );
  
  const respondedOpportunities = filteredOpportunities.filter(
    (opp) => opp.status === "responded" || opp.status === "resolved"
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-lg border animate-pulse">
            <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
            <div className="w-full h-20 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredOpportunities.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No opportunities match your filters</h3>
        <p className="text-muted-foreground">Try adjusting your filter criteria or search query.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="pending">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Pending ({pendingOpportunities.length})</span>
          </TabsTrigger>
          <TabsTrigger value="responded" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Responded ({respondedOpportunities.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-4">
          {pendingOpportunities.length === 0 ? (
            <div className="bg-muted/30 rounded-lg p-6 text-center">
              <p className="text-muted-foreground">No pending opportunities</p>
            </div>
          ) : (
            pendingOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))
          )}
        </TabsContent>

        <TabsContent value="responded" className="mt-4 space-y-4">
          {respondedOpportunities.length === 0 ? (
            <div className="bg-muted/30 rounded-lg p-6 text-center">
              <p className="text-muted-foreground">No responded opportunities</p>
            </div>
          ) : (
            respondedOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OpportunityInsightsList;
