
import React, { createContext, useContext, useState, useEffect } from "react";
import { Opportunity, OpportunityAction, OpportunityFilter } from "../types";
import { mockOpportunities, mockActions } from "../mockData";

interface OpportunityContextType {
  opportunities: Opportunity[];
  actions: OpportunityAction[];
  filters: OpportunityFilter;
  isLoading: boolean;
  updateFilters: (newFilters: Partial<OpportunityFilter>) => void;
  respondToOpportunity: (opportunityId: string, response: string, actionType: string) => void;
  createTaskFromVoice: (voiceCommand: string) => void;
}

const OpportunityContext = createContext<OpportunityContextType | undefined>(undefined);

export const useOpportunity = () => {
  const context = useContext(OpportunityContext);
  if (!context) {
    throw new Error("useOpportunity must be used within OpportunityProvider");
  }
  return context;
};

export const OpportunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [actions, setActions] = useState<OpportunityAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<OpportunityFilter>({
    severity: "all",
    department: "all",
    status: "all",
    searchQuery: "",
  });

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setOpportunities(mockOpportunities);
      setActions(mockActions);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const updateFilters = (newFilters: Partial<OpportunityFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const respondToOpportunity = (opportunityId: string, response: string, actionType: string) => {
    // Update the opportunity status
    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === opportunityId ? { ...opp, status: "responded" } : opp
      )
    );

    // Add to action history
    const newAction: OpportunityAction = {
      id: `action-${Date.now()}`,
      opportunityId,
      actionType,
      response,
      timestamp: new Date(),
      user: "Current User",
      status: "completed",
    };

    setActions((prev) => [newAction, ...prev]);
  };

  const createTaskFromVoice = (voiceCommand: string) => {
    // Simple NLP simulation to extract information from voice command
    let department = "IT";
    let description = voiceCommand;

    if (voiceCommand.toLowerCase().includes("hr")) {
      department = "HR";
    } else if (voiceCommand.toLowerCase().includes("finance")) {
      department = "Finance";
    } else if (voiceCommand.toLowerCase().includes("sales")) {
      department = "Sales";
    }

    // Create a new opportunity from voice command
    const newOpportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      title: `Voice-generated task: ${description.substring(0, 50)}...`,
      description,
      timestamp: new Date(),
      severity: "medium",
      department,
      status: "new",
      source: "voice-command",
      assignedTo: null,
    };

    setOpportunities((prev) => [newOpportunity, ...prev]);

    // Create an action record
    const newAction: OpportunityAction = {
      id: `action-${Date.now()}`,
      opportunityId: newOpportunity.id,
      actionType: "create",
      response: "Created task from voice command",
      timestamp: new Date(),
      user: "Current User",
      status: "completed",
    };

    setActions((prev) => [newAction, ...prev]);

    return newOpportunity;
  };

  const value = {
    opportunities,
    actions,
    filters,
    isLoading,
    updateFilters,
    respondToOpportunity,
    createTaskFromVoice,
  };

  return <OpportunityContext.Provider value={value}>{children}</OpportunityContext.Provider>;
};
