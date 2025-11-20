
import { Opportunity, OpportunityAction } from "./types";

// Mock data for opportunities
export const mockOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    title: "Spike in IT ticket volume detected",
    description: "There's been a 35% increase in IT support tickets in the last 24 hours, primarily related to network connectivity issues.",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    severity: "high",
    department: "IT",
    status: "new",
    source: "system",
    assignedTo: null,
  },
  {
    id: "opp-2",
    title: "Drop in onboarding completion rate",
    description: "The average time to complete new employee onboarding has increased by 2 days over the past week. HR processes may need review.",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    severity: "medium",
    department: "HR",
    status: "new",
    source: "system",
    assignedTo: null,
  },
  {
    id: "opp-3",
    title: "SLA breach in client response time",
    description: "3 high-priority client tickets have exceeded the 4-hour SLA response window. Immediate attention required.",
    timestamp: new Date(Date.now() - 10800000), // 3 hours ago
    severity: "critical",
    department: "Support",
    status: "escalated",
    source: "system",
    assignedTo: "support-lead",
  },
  {
    id: "opp-4",
    title: "Unusual system login patterns detected",
    description: "Multiple failed login attempts detected from unusual locations. Security investigation recommended.",
    timestamp: new Date(Date.now() - 14400000), // 4 hours ago
    severity: "high",
    department: "IT",
    status: "responded",
    source: "system",
    assignedTo: "security-team",
  },
  {
    id: "opp-5",
    title: "Quarterly financial report processing delay",
    description: "The automated quarterly financial report generation is running 2 hours behind schedule. May impact executive meeting preparations.",
    timestamp: new Date(Date.now() - 18000000), // 5 hours ago
    severity: "medium",
    department: "Finance",
    status: "new",
    source: "system",
    assignedTo: null,
  }
];

// Mock data for actions history
export const mockActions: OpportunityAction[] = [
  {
    id: "action-1",
    opportunityId: "opp-4",
    actionType: "assign",
    response: "Assigned to Security Team for investigation",
    timestamp: new Date(Date.now() - 12600000), // 3.5 hours ago
    user: "System Admin",
    status: "completed",
  },
  {
    id: "action-2",
    opportunityId: "opp-3",
    actionType: "escalate",
    response: "Escalated to Support Lead for immediate attention",
    timestamp: new Date(Date.now() - 10440000), // 2.9 hours ago
    user: "Support Manager",
    status: "completed",
  },
  {
    id: "action-3",
    opportunityId: "opp-3",
    actionType: "workflow",
    response: "Triggered emergency response workflow",
    timestamp: new Date(Date.now() - 10200000), // 2.83 hours ago
    user: "System",
    status: "completed",
  }
];

export const mockWorkflows = [
  { id: "workflow-1", name: "IT Incident Response", description: "Standard protocol for IT incidents" },
  { id: "workflow-2", name: "HR Issue Resolution", description: "Process for handling HR-related issues" },
  { id: "workflow-3", name: "Client Escalation", description: "Escalation path for client-facing issues" },
  { id: "workflow-4", name: "Security Incident Response", description: "Protocol for security incidents" },
  { id: "workflow-5", name: "Executive Notification", description: "Notify executive team of critical issues" }
];
