
import { Node, Edge } from '@xyflow/react';
import { WorkflowTemplate } from '../types';

export const prebuiltTemplates: WorkflowTemplate[] = [
  {
    id: 'finance-invoice-reminder',
    name: 'Invoice Overdue Reminder',
    description: 'Automatically notify accounting head when invoices are overdue',
    category: 'finance',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 250, y: 100 },
        data: { 
          label: 'Data Change', 
          icon: 'database',
          description: 'When invoice status changes',
          config: {
            source: 'invoices',
            condition: 'changed'
          }
        }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 250, y: 250 },
        data: { 
          label: 'Filter', 
          icon: 'filter',
          description: 'Check if invoice is overdue',
          config: {
            field: 'invoice.status',
            operator: 'equals',
            value: 'overdue'
          }
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 250, y: 400 },
        data: { 
          label: 'Send Email', 
          icon: 'mail',
          description: 'Notify accounting head',
          config: {
            to: 'accounting@company.com',
            subject: 'Invoice Overdue Alert',
            body: 'Invoice #{invoice.number} for {invoice.amount} is now overdue by {invoice.days_overdue} days.'
          }
        }
      }
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'trigger-1',
        target: 'condition-1',
        sourceHandle: 'a',
        targetHandle: 'b'
      },
      {
        id: 'edge-2',
        source: 'condition-1',
        target: 'action-1',
        sourceHandle: 'true',
        targetHandle: 'c'
      }
    ]
  },
  {
    id: 'sales-deal-closed',
    name: 'Deal Closed Workflow',
    description: 'Auto-email onboarding team when a sales deal is closed',
    category: 'sales',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 250, y: 100 },
        data: { 
          label: 'Event', 
          icon: 'zap',
          description: 'When deal is closed',
          config: {
            eventType: 'deal_closed'
          }
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 250, y: 250 },
        data: { 
          label: 'Send Email', 
          icon: 'mail',
          description: 'Notify onboarding team',
          config: {
            to: 'onboarding@company.com',
            subject: 'New Client Onboarding: {deal.company_name}',
            body: 'A new deal has been closed by {deal.sales_rep}. Please begin the onboarding process for {deal.company_name}.'
          }
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 250, y: 400 },
        data: { 
          label: 'Create Record', 
          icon: 'plus',
          description: 'Create onboarding task',
          config: {
            entity: 'tasks',
            fields: {
              title: 'Onboard {deal.company_name}',
              assignee: 'onboarding_team',
              due_date: '{deal.close_date+7d}'
            }
          }
        }
      }
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'trigger-1',
        target: 'action-1',
        sourceHandle: 'a',
        targetHandle: 'c'
      },
      {
        id: 'edge-2',
        source: 'action-1',
        target: 'action-2',
        sourceHandle: 'd',
        targetHandle: 'c'
      }
    ]
  },
  {
    id: 'hr-pto-request',
    name: 'PTO Request Handler',
    description: 'When PTO is submitted, notify manager and update calendar',
    category: 'hr',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 250, y: 100 },
        data: { 
          label: 'Event', 
          icon: 'zap',
          description: 'When PTO is submitted',
          config: {
            eventType: 'pto_submitted'
          }
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 250, y: 250 },
        data: { 
          label: 'Send Notification', 
          icon: 'bell',
          description: 'Notify manager',
          config: {
            title: 'PTO Request Pending',
            content: '{employee.name} has requested PTO from {pto.start_date} to {pto.end_date}',
            type: 'info'
          }
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 100, y: 400 },
        data: { 
          label: 'Create Record', 
          icon: 'plus',
          description: 'Add to calendar',
          config: {
            entity: 'calendar_events',
            fields: {
              title: '{employee.name} - PTO',
              start: '{pto.start_date}',
              end: '{pto.end_date}'
            }
          }
        }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 400, y: 400 },
        data: { 
          label: 'Send Email', 
          icon: 'mail',
          description: 'Email to employee',
          config: {
            to: '{employee.email}',
            subject: 'PTO Request Submitted',
            body: 'Your PTO request from {pto.start_date} to {pto.end_date} has been submitted for approval.'
          }
        }
      }
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'trigger-1',
        target: 'action-1',
        sourceHandle: 'a',
        targetHandle: 'c'
      },
      {
        id: 'edge-2',
        source: 'action-1',
        target: 'action-2',
        sourceHandle: 'd',
        targetHandle: 'c'
      },
      {
        id: 'edge-3',
        source: 'action-1',
        target: 'action-3',
        sourceHandle: 'd',
        targetHandle: 'c'
      }
    ]
  }
];
