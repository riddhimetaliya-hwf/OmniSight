
import { Tour, UserRole } from '../types';

const workflowStudioTour: Tour = {
  id: 'workflow-studio-basics',
  title: 'Workflow Studio Basics',
  description: 'Learn how to create and manage workflows',
  module: 'workflow',
  role: ['analyst', 'admin'],
  autoStart: true,
  steps: [
    {
      id: 'intro',
      title: 'Welcome to Workflow Studio',
      description: 'This tour will guide you through the basics of creating workflows.',
      targetElement: '.workflow-canvas',
      placement: 'center',
    },
    {
      id: 'nodes-panel',
      title: 'Adding Workflow Nodes',
      description: 'This panel contains all the nodes you can add to your workflow. Click and drag them onto the canvas.',
      targetElement: '.workflow-sidebar',
      placement: 'right',
    },
    {
      id: 'canvas',
      title: 'Workflow Canvas',
      description: 'This is your main workspace. Connect nodes to create automated workflows.',
      targetElement: '.workflow-canvas',
      placement: 'bottom',
    },
    {
      id: 'node-inspector',
      title: 'Node Configuration',
      description: 'When you select a node, you can configure its properties here.',
      targetElement: '.node-config-panel',
      placement: 'left',
    },
    {
      id: 'workflow-controls',
      title: 'Workflow Controls',
      description: 'Use these controls to save, test, or publish your workflow.',
      targetElement: '.workflow-header',
      placement: 'bottom',
    }
  ]
};

const dashboardBuilderTour: Tour = {
  id: 'dashboard-builder-basics',
  title: 'Dashboard Builder Basics',
  description: 'Learn how to create custom dashboards',
  module: 'dashboard',
  role: ['analyst', 'exec', 'admin'],
  autoStart: true,
  steps: [
    {
      id: 'intro',
      title: 'Welcome to Dashboard Builder',
      description: 'This tour will show you how to create custom dashboards with your data.',
      targetElement: '.dashboard-grid',
      placement: 'center',
    },
    {
      id: 'add-widget',
      title: 'Adding Widgets',
      description: 'Click here to add visualizations and data widgets to your dashboard.',
      targetElement: '.dashboard-actions-bar',
      placement: 'bottom',
    },
    {
      id: 'widget-customize',
      title: 'Customizing Widgets',
      description: 'Each widget can be customized with different data sources and visualization options.',
      targetElement: '.dashboard-widget',
      placement: 'right',
    },
    {
      id: 'dashboard-filters',
      title: 'Dashboard Filters',
      description: 'Apply filters to see only the data you care about across all widgets.',
      targetElement: '.dashboard-filters',
      placement: 'bottom',
    }
  ]
};

const execCopilotTour: Tour = {
  id: 'exec-copilot-basics',
  title: 'Executive Copilot Basics',
  description: 'Learn how to use AI to assist with executive decisions',
  module: 'copilot',
  role: ['exec', 'admin'],
  autoStart: true,
  steps: [
    {
      id: 'intro',
      title: 'Welcome to Executive Copilot',
      description: 'Your AI assistant for strategic insights and decision support.',
      targetElement: '.copilot-header',
      placement: 'bottom',
    },
    {
      id: 'insights-tab',
      title: 'AI Insights',
      description: 'Browse AI-generated insights about your business performance.',
      targetElement: '.insights-tab',
      placement: 'right',
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      description: 'Review AI recommendations for improving your metrics and operations.',
      targetElement: '.recommendations-tab',
      placement: 'right',
    },
    {
      id: 'ask-question',
      title: 'Ask Questions',
      description: 'You can ask specific questions about your business data here.',
      targetElement: '.copilot-actions',
      placement: 'top',
    }
  ]
};

const commandCenterTour: Tour = {
  id: 'command-center-basics',
  title: 'Command Center Basics',
  description: 'Learn how to use the executive command center',
  module: 'command',
  role: ['exec', 'admin'],
  autoStart: true,
  steps: [
    {
      id: 'intro',
      title: 'Welcome to OmniCommand',
      description: 'Your executive command center for monitoring business performance at a glance.',
      targetElement: '.kpi-widgets-grid',
      placement: 'center',
    },
    {
      id: 'kpi-widgets',
      title: 'KPI Widgets',
      description: 'These widgets show your most important key performance indicators.',
      targetElement: '.kpi-widgets-grid',
      placement: 'bottom',
    },
    {
      id: 'snapshots',
      title: 'Business Snapshots',
      description: 'Quick highlights of critical information that needs your attention.',
      targetElement: '.snapshot-cards-grid',
      placement: 'right',
    },
    {
      id: 'alerts',
      title: 'Alerts Panel',
      description: 'Stay informed about important events and recommendations.',
      targetElement: '.alerts-panel',
      placement: 'left',
    },
    {
      id: 'customization',
      title: 'Role Customization',
      description: 'Customize this view based on your executive role.',
      targetElement: '.command-header',
      placement: 'bottom',
    }
  ]
};

// Export a function that returns tours filtered by user role
export const getDemoTours = (userRole: UserRole): Tour[] => {
  // All available tours
  const allTours = [
    workflowStudioTour,
    dashboardBuilderTour,
    execCopilotTour,
    commandCenterTour
  ];
  
  // Filter tours that are applicable to the user's role
  return allTours.filter(tour => tour.role.includes(userRole));
};
