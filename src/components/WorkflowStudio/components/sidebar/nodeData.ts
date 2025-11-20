
import React from 'react';
import { Clock, Mail, Database, FileText, Zap, Bell, CheckCircle, Filter, GitBranch, Users, BrainCircuit } from 'lucide-react';

export interface NodeDefinition {
  type: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  category?: string;
}

export const triggerNodes: NodeDefinition[] = [
  { type: 'trigger', label: 'Schedule', icon: React.createElement(Clock, { className: "h-4 w-4" }), description: 'Run on a schedule' },
  { type: 'trigger', label: 'Email Received', icon: React.createElement(Mail, { className: "h-4 w-4" }), description: 'Trigger on email receipt' },
  { type: 'trigger', label: 'Data Change', icon: React.createElement(Database, { className: "h-4 w-4" }), description: 'React to data changes' },
  { type: 'trigger', label: 'Form Submission', icon: React.createElement(FileText, { className: "h-4 w-4" }), description: 'Process form submissions' },
  { type: 'trigger', label: 'API Webhook', icon: React.createElement(Zap, { className: "h-4 w-4" }), description: 'Receive webhook calls' },
];

export const actionNodes: NodeDefinition[] = [
  { type: 'action', label: 'Send Email', icon: React.createElement(Mail, { className: "h-4 w-4" }), description: 'Send emails' },
  { type: 'action', label: 'Send Notification', icon: React.createElement(Bell, { className: "h-4 w-4" }), description: 'Send system notifications' },
  { type: 'action', label: 'Update Database', icon: React.createElement(Database, { className: "h-4 w-4" }), description: 'Modify data records' },
  { type: 'action', label: 'Call API', icon: React.createElement(Zap, { className: "h-4 w-4" }), description: 'Make external API calls' },
  { type: 'action', label: 'Generate Document', icon: React.createElement(FileText, { className: "h-4 w-4" }), description: 'Create documents' },
  { type: 'action', label: 'Assign Task', icon: React.createElement(CheckCircle, { className: "h-4 w-4" }), description: 'Create and assign tasks' },
];

export const conditionNodes: NodeDefinition[] = [
  { type: 'condition', label: 'Filter', icon: React.createElement(Filter, { className: "h-4 w-4" }), description: 'Branch based on conditions' },
  { type: 'condition', label: 'Switch', icon: React.createElement(GitBranch, { className: "h-4 w-4" }), description: 'Multi-path routing' },
  { type: 'condition', label: 'Delay', icon: React.createElement(Clock, { className: "h-4 w-4" }), description: 'Add time delay' },
  { type: 'condition', label: 'Approval', icon: React.createElement(Users, { className: "h-4 w-4" }), description: 'Request human approval' },
];

export const aiNodes: NodeDefinition[] = [
  { type: 'action', label: 'Analyze Text', icon: React.createElement(BrainCircuit, { className: "h-4 w-4" }), category: 'AI' },
  { type: 'action', label: 'Summarize Data', icon: React.createElement(BrainCircuit, { className: "h-4 w-4" }), category: 'AI' },
  { type: 'action', label: 'Detect Sentiment', icon: React.createElement(BrainCircuit, { className: "h-4 w-4" }), category: 'AI' },
  { type: 'action', label: 'Generate Content', icon: React.createElement(BrainCircuit, { className: "h-4 w-4" }), category: 'AI' },
];

export const templateData = [
  'Approval Process', 
  'Data ETL Pipeline', 
  'Customer Onboarding', 
  'Document Review', 
  'Service Desk Flow'
];
