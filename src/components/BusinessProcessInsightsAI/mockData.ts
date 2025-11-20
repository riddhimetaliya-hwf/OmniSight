
import { ProcessInsight } from './types';

export const mockProcessInsights: ProcessInsight[] = [
  {
    id: 'insight-1',
    title: 'Order approval bottlenecks detected',
    description: 'Orders are taking 37% longer to move through the approval stage compared to previous month, primarily affecting enterprise customers.',
    type: 'anomaly',
    processArea: 'order-flow',
    importance: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isPinned: true,
    analysis: 'The bottleneck appears to coincide with the implementation of the new multi-step approval process. Three specific managers are handling 62% of stalled approvals. Orders over $50k are most affected.',
    recommendations: [
      'Implement parallel approval workflows for orders under $100k',
      'Add temporary approvers during peak periods',
      'Consider auto-approval for repeat orders under $25k'
    ],
    relatedMetrics: ['Order Cycle Time', 'Approval Wait Time', 'Customer Satisfaction'],
    trend: 'down'
  },
  {
    id: 'insight-2',
    title: 'IT provisioning delays affecting onboarding',
    description: 'New hire laptop and system access setup is taking 5.2 days on average, up from 2.8 days last quarter.',
    type: 'trend',
    processArea: 'talent-onboard',
    importance: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    isPinned: false,
    analysis: 'Analysis shows the delay is concentrated in the laptop configuration stage, which coincides with reduced IT staffing and increased new hire volume. Engineering department onboarding is most affected.',
    recommendations: [
      'Pre-configure standard laptop images for common role types',
      'Implement temporary IT support from contractor resources',
      'Prioritize access provisioning for revenue-generating roles'
    ],
    relatedMetrics: ['Time to Productivity', 'Onboarding Satisfaction', 'IT Request Backlog'],
    trend: 'down'
  },
  {
    id: 'insight-3',
    title: 'Client response time improvements',
    description: 'First response time to client inquiries has decreased by 24% this month, exceeding the quarterly goal of 15% improvement.',
    type: 'trend',
    processArea: 'client-care',
    importance: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    isPinned: true,
    analysis: 'The improvement correlates strongly with the implementation of the new routing algorithm and pre-written response templates. Chat-based inquiries show the most significant gains.',
    recommendations: [
      'Expand template library to cover additional common scenarios',
      'Apply similar routing logic to email support channels',
      'Document approach as best practice for other service teams'
    ],
    relatedMetrics: ['First Response Time', 'Client Satisfaction Score', 'Resolution Rate'],
    trend: 'up'
  },
  {
    id: 'insight-4',
    title: 'Order cancellation rate increased',
    description: 'Order cancellations have increased by 18% in the past two weeks, primarily affecting orders that remain in processing for >3 days.',
    type: 'explanation',
    processArea: 'order-flow',
    importance: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isPinned: false,
    analysis: 'Data suggests that customers are cancelling orders that take longer than expected to process. The likelihood of cancellation increases by 12% for each additional day in processing beyond customer expectation.',
    recommendations: [
      'Implement proactive communication for orders approaching delay thresholds',
      'Add expedited processing option for at-risk orders',
      'Review and optimize approval workflows for high-value orders'
    ],
    relatedMetrics: ['Cancellation Rate', 'Processing Time', 'Customer Retention'],
    trend: 'down'
  },
  {
    id: 'insight-5',
    title: 'Onboarding satisfaction score declining',
    description: 'New hire satisfaction with the onboarding process has decreased from 4.6/5 to 3.8/5 in the past quarter.',
    type: 'recommendation',
    processArea: 'talent-onboard',
    importance: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isPinned: false,
    analysis: 'Survey feedback indicates dissatisfaction specifically with the training schedule organization and IT setup process. Remote employees report significantly lower satisfaction than in-office hires.',
    recommendations: [
      'Create specialized onboarding track for remote employees',
      'Redesign training schedule to allow more flexibility',
      'Implement pre-arrival IT setup process to reduce day-one issues'
    ],
    relatedMetrics: ['Onboarding Satisfaction', 'Time to Productivity', 'Early Turnover Rate'],
    trend: 'down'
  },
  {
    id: 'insight-6',
    title: 'Customer support ticket reopen rate improvement',
    description: 'Ticket reopen rate has decreased from 15.3% to 8.7%, indicating improved first-time resolution.',
    type: 'trend',
    processArea: 'client-care',
    importance: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    isPinned: false,
    analysis: 'The improvement correlates with the new comprehensive solution checklist implemented last month and enhanced agent training on common issue diagnosis.',
    recommendations: [
      'Extend solution checklist approach to all support categories',
      'Document successful resolution patterns for knowledge base',
      'Recognize top-performing agents with lowest reopen rates'
    ],
    relatedMetrics: ['Ticket Reopen Rate', 'First Contact Resolution', 'Customer Effort Score'],
    trend: 'up'
  }
];
