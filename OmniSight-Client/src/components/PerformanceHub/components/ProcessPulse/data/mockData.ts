
import { ProcessMetric, ProcessDetail, ProcessAlert } from '../types';

export const mockOrderManagementProcesses: ProcessMetric[] = [
  {
    id: "om-1001",
    name: "Enterprise Hardware Order #45782",
    status: "on-track",
    cycleTime: 3.2,
    expectedCycleTime: 5,
    satisfactionScore: 4.2,
    currentStep: "Shipping",
    blockers: [],
    owner: "Sarah Johnson",
    lastUpdated: "2023-06-15T14:30:00Z",
    category: "order-management"
  },
  {
    id: "om-1002",
    name: "Software License Renewal #8976",
    status: "delayed",
    cycleTime: 8.5,
    expectedCycleTime: 3,
    satisfactionScore: 2.8,
    currentStep: "Finance Approval",
    blockers: ["Budget verification", "Vendor negotiation"],
    owner: "Mark Wilson",
    lastUpdated: "2023-06-14T10:15:00Z",
    category: "order-management"
  },
  {
    id: "om-1003",
    name: "Datacenter Equipment #3321",
    status: "at-risk",
    cycleTime: 12.1,
    expectedCycleTime: 7,
    satisfactionScore: 2.1,
    currentStep: "Procurement",
    blockers: ["Supply chain delay", "Compliance review"],
    owner: "Lisa Chen",
    lastUpdated: "2023-06-13T16:45:00Z",
    category: "order-management"
  }
];

export const mockTalentOnboardingProcesses: ProcessMetric[] = [
  {
    id: "to-2001",
    name: "Senior Developer Onboarding - John Smith",
    status: "on-track",
    cycleTime: 7.8,
    expectedCycleTime: 10,
    satisfactionScore: 4.5,
    currentStep: "Technical Training",
    blockers: [],
    owner: "Maria Rodriguez",
    lastUpdated: "2023-06-15T11:20:00Z",
    category: "talent-onboarding"
  },
  {
    id: "to-2002",
    name: "Product Manager Onboarding - Alice Wong",
    status: "delayed",
    cycleTime: 15.3,
    expectedCycleTime: 12,
    satisfactionScore: 3.2,
    currentStep: "Background Check",
    blockers: ["International verification"],
    owner: "David Park",
    lastUpdated: "2023-06-12T09:30:00Z",
    category: "talent-onboarding"
  },
  {
    id: "to-2003",
    name: "IT Support Specialist Onboarding - Mike Johnson",
    status: "at-risk",
    cycleTime: 18.2,
    expectedCycleTime: 10,
    satisfactionScore: 2.7,
    currentStep: "Equipment Setup",
    blockers: ["Hardware unavailable", "Software licensing issue"],
    owner: "Taylor Swift",
    lastUpdated: "2023-06-10T15:45:00Z",
    category: "talent-onboarding"
  }
];

export const mockClientServicesProcesses: ProcessMetric[] = [
  {
    id: "cs-3001",
    name: "Integration Support - Acme Corp",
    status: "on-track",
    cycleTime: 2.1,
    expectedCycleTime: 3,
    satisfactionScore: 4.8,
    currentStep: "Solution Implementation",
    blockers: [],
    owner: "James Brown",
    lastUpdated: "2023-06-15T13:10:00Z",
    category: "client-services"
  },
  {
    id: "cs-3002",
    name: "Service Escalation - XYZ Industries",
    status: "delayed",
    cycleTime: 5.4,
    expectedCycleTime: 2,
    satisfactionScore: 1.9,
    currentStep: "Technical Review",
    blockers: ["Awaiting engineering input", "Version compatibility"],
    owner: "Emma Davis",
    lastUpdated: "2023-06-14T17:25:00Z",
    category: "client-services"
  },
  {
    id: "cs-3003",
    name: "Implementation Project - Global Bank",
    status: "on-track",
    cycleTime: 21.5,
    expectedCycleTime: 30,
    satisfactionScore: 4.1,
    currentStep: "User Acceptance Testing",
    blockers: [],
    owner: "Robert Kim",
    lastUpdated: "2023-06-13T14:30:00Z",
    category: "client-services"
  }
];

export const mockProcessDetails: Record<string, ProcessDetail> = {
  "om-1002": {
    id: "om-1002",
    name: "Software License Renewal #8976",
    steps: [
      {
        id: "step-1",
        name: "Request Submission",
        status: "completed",
        startTime: "2023-06-01T09:00:00Z",
        endTime: "2023-06-01T10:30:00Z",
        owner: "Mark Wilson"
      },
      {
        id: "step-2",
        name: "Initial Review",
        status: "completed",
        startTime: "2023-06-01T11:00:00Z",
        endTime: "2023-06-02T14:00:00Z",
        owner: "Procurement Team"
      },
      {
        id: "step-3",
        name: "Vendor Negotiation",
        status: "completed",
        startTime: "2023-06-03T09:00:00Z",
        endTime: "2023-06-10T16:00:00Z",
        owner: "Nancy Miller",
        notes: ["Vendor requested additional terms", "Price negotiation extended timeline"]
      },
      {
        id: "step-4",
        name: "Finance Approval",
        status: "blocked",
        startTime: "2023-06-11T09:00:00Z",
        owner: "Finance Department",
        notes: ["Budget exceeds allocated amount", "Waiting for executive approval"]
      },
      {
        id: "step-5",
        name: "License Activation",
        status: "pending",
        dependencies: ["Finance Approval"]
      },
      {
        id: "step-6",
        name: "Deployment & Verification",
        status: "pending",
        dependencies: ["License Activation"]
      }
    ],
    timeline: [
      { date: "2023-06-01T09:00:00Z", event: "Request submitted by Mark Wilson" },
      { date: "2023-06-01T11:00:00Z", event: "Initial review started" },
      { date: "2023-06-02T14:00:00Z", event: "Initial review completed" },
      { date: "2023-06-03T09:00:00Z", event: "Vendor negotiation initiated" },
      { date: "2023-06-05T11:30:00Z", event: "Vendor countered with higher price" },
      { date: "2023-06-08T15:45:00Z", event: "Escalated to procurement manager" },
      { date: "2023-06-10T16:00:00Z", event: "Vendor negotiation completed" },
      { date: "2023-06-11T09:00:00Z", event: "Sent to finance for approval" },
      { date: "2023-06-13T10:15:00Z", event: "Finance flagged budget issue" }
    ],
    metrics: {
      avgCycleTime: 7.5,
      blockerFrequency: {
        "Budget verification": 5,
        "Vendor negotiation": 8,
        "Approval delay": 12
      },
      satisfactionTrend: [
        { date: "2023-05-01", score: 4.2 },
        { date: "2023-05-15", score: 3.9 },
        { date: "2023-06-01", score: 3.5 },
        { date: "2023-06-14", score: 2.8 }
      ]
    },
    predictedCompletion: "2023-06-20T17:00:00Z",
    suggestedImprovements: [
      "Pre-approve budget for recurring license renewals",
      "Establish standard pricing agreements with this vendor",
      "Create fast-track approval for renewals under $10,000"
    ]
  }
};

export const mockProcessAlerts: ProcessAlert[] = [
  {
    id: "alert-1",
    processId: "om-1002",
    type: "delay",
    message: "Software License Renewal has exceeded expected cycle time by 5.5 days",
    severity: "high",
    timestamp: "2023-06-14T09:00:00Z",
    actionRequired: true
  },
  {
    id: "alert-2",
    processId: "to-2002",
    type: "blocker",
    message: "Background check verification causing significant delay",
    severity: "medium",
    timestamp: "2023-06-14T10:30:00Z",
    actionRequired: true
  },
  {
    id: "alert-3",
    processId: "cs-3002",
    type: "satisfaction-drop",
    message: "Client satisfaction dropped from 3.5 to 1.9 in the last 24 hours",
    severity: "high",
    timestamp: "2023-06-14T14:15:00Z",
    actionRequired: true
  },
  {
    id: "alert-4",
    processId: "to-2003",
    type: "prediction",
    message: "Current trend indicates onboarding will miss target by 10+ days",
    severity: "medium",
    timestamp: "2023-06-14T16:30:00Z",
    actionRequired: false
  }
];

export const allProcesses = [
  ...mockOrderManagementProcesses,
  ...mockTalentOnboardingProcesses,
  ...mockClientServicesProcesses
];
