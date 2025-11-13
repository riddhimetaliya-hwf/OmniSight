
export type OpportunitySeverity = "critical" | "high" | "medium" | "low";
export type OpportunityStatus = "new" | "responded" | "resolved" | "escalated";
export type OpportunitySource = "system" | "manual" | "voice-command" | "workflow";
export type OpportunityDepartment = "IT" | "HR" | "Finance" | "Sales" | "Operations" | "Support";
export type OpportunityActionType = "assign" | "notify" | "escalate" | "create" | "workflow" | "resolve";

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  severity: OpportunitySeverity;
  department: OpportunityDepartment | string;
  status: OpportunityStatus;
  source: OpportunitySource;
  assignedTo: string | null;
}

export interface OpportunityAction {
  id: string;
  opportunityId: string;
  actionType: string;
  response: string;
  timestamp: Date;
  user: string;
  status: "pending" | "completed" | "failed";
}

export interface OpportunityFilter {
  severity: OpportunitySeverity | "all";
  department: OpportunityDepartment | "all" | string;
  status: OpportunityStatus | "all";
  searchQuery: string;
}
