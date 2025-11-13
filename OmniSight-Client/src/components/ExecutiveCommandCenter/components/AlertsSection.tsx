
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  AlertTriangle, 
  Bell, 
  ExternalLink,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type ExecutiveRole = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO';
type AlertPriority = 'critical' | 'high' | 'medium' | 'low';

interface AlertCardProps {
  title: string;
  description: string;
  priority: AlertPriority;
  time: string;
  action?: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ 
  title, 
  description, 
  priority, 
  time,
  action
}) => {
  const getPriorityStyles = () => {
    switch (priority) {
      case 'critical':
        return { 
          icon: <AlertCircle className="h-5 w-5" />, 
          color: 'text-red-500 dark:text-red-400',
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800'
        };
      case 'high':
        return { 
          icon: <AlertTriangle className="h-5 w-5" />, 
          color: 'text-amber-500 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800'
        };
      case 'medium':
        return { 
          icon: <Bell className="h-5 w-5" />, 
          color: 'text-blue-500 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800'
        };
      case 'low':
        return { 
          icon: <Bell className="h-5 w-5" />, 
          color: 'text-green-500 dark:text-green-400',
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800'
        };
      default:
        return { 
          icon: <Bell className="h-5 w-5" />, 
          color: 'text-slate-500 dark:text-slate-400',
          bg: 'bg-slate-50 dark:bg-slate-900/20',
          border: 'border-slate-200 dark:border-slate-800'
        };
    }
  };

  const { icon, color, bg, border } = getPriorityStyles();

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-all duration-200 ${border}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${bg} ${color} flex-shrink-0 mt-1`}>
            {icon}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-base">{title}</h3>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                <span>{time}</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{description}</p>
            
            {action && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-xs"
              >
                {action}
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface AlertsSectionProps {
  role: ExecutiveRole;
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ role }) => {
  // Role-specific alerts
  const alertsByRole = {
    'CEO': [
      {
        title: 'Quarterly Revenue at Risk',
        description: 'Current projections show Q4 revenue may fall 8% below target based on current pipeline and closure rates.',
        priority: 'high' as AlertPriority,
        time: '2 hours ago',
        action: 'View Revenue Forecast'
      },
      {
        title: 'Executive Leadership Vacancy',
        description: 'VP of Product has submitted resignation with 30-day notice period. Succession plan needed.',
        priority: 'high' as AlertPriority,
        time: '1 day ago',
        action: 'View Succession Plans'
      },
      {
        title: 'Competitor Acquisition Activity',
        description: 'Main competitor has announced acquisition of TechCorp, expanding their market capabilities.',
        priority: 'medium' as AlertPriority,
        time: '3 days ago',
        action: 'View Competitor Analysis'
      }
    ],
    'CFO': [
      {
        title: 'Cash Flow Warning',
        description: 'Operating cash flow dropped 18% below forecast due to delays in customer payments.',
        priority: 'critical' as AlertPriority,
        time: '3 hours ago',
        action: 'View Cash Position'
      },
      {
        title: 'Audit Finding',
        description: 'External auditors flagged inconsistencies in revenue recognition practices for subscription services.',
        priority: 'high' as AlertPriority,
        time: '1 day ago',
        action: 'View Audit Report'
      },
      {
        title: 'Budget Variance',
        description: 'R&D department has exceeded quarterly budget allocation by 12%, requiring approval for continuation.',
        priority: 'medium' as AlertPriority,
        time: '2 days ago',
        action: 'Review Budget'
      }
    ],
    'COO': [
      {
        title: 'Supply Chain Disruption',
        description: 'Key supplier has declared force majeure due to factory fire, affecting 15% of our component supply.',
        priority: 'critical' as AlertPriority,
        time: '5 hours ago',
        action: 'View Contingency Plan'
      },
      {
        title: 'Production Quality Alert',
        description: 'Defect rate in latest production batch exceeds threshold at 3.2% vs 1% target.',
        priority: 'high' as AlertPriority,
        time: '1 day ago',
        action: 'View Quality Report'
      },
      {
        title: 'Fulfillment Delay Risk',
        description: 'Current order processing times 35% above standard, risking on-time delivery SLAs.',
        priority: 'medium' as AlertPriority,
        time: '2 days ago',
        action: 'View Operations Dashboard'
      }
    ],
    'CTO': [
      {
        title: 'Security Breach Detected',
        description: 'Unauthorized access attempt detected on customer database. Security team investigating.',
        priority: 'critical' as AlertPriority,
        time: '1 hour ago',
        action: 'View Security Report'
      },
      {
        title: 'System Performance Degradation',
        description: 'Main application response time increased by 45% in the last 24 hours.',
        priority: 'high' as AlertPriority,
        time: '6 hours ago',
        action: 'View System Metrics'
      },
      {
        title: 'Cloud Cost Anomaly',
        description: 'Cloud infrastructure spending is 32% above forecast for this month.',
        priority: 'medium' as AlertPriority,
        time: '2 days ago',
        action: 'View Cost Analysis'
      }
    ],
    'CMO': [
      {
        title: 'Campaign Performance Drop',
        description: 'Primary digital campaign showing 28% decrease in conversion rate over the past 48 hours.',
        priority: 'high' as AlertPriority,
        time: '4 hours ago',
        action: 'View Campaign Analytics'
      },
      {
        title: 'Social Media Crisis Risk',
        description: 'Negative sentiment about recent product launch increasing on social platforms by 45%.',
        priority: 'high' as AlertPriority,
        time: '1 day ago',
        action: 'View Sentiment Analysis'
      },
      {
        title: 'Marketing Budget Utilization',
        description: 'Q4 marketing budget utilization at 35% with 75% of quarter elapsed.',
        priority: 'medium' as AlertPriority,
        time: '3 days ago',
        action: 'View Budget Details'
      }
    ]
  };

  const alerts = alertsByRole[role] || alertsByRole['CEO'];

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <AlertCard
          key={index}
          title={alert.title}
          description={alert.description}
          priority={alert.priority}
          time={alert.time}
          action={alert.action}
        />
      ))}
    </div>
  );
};

export default AlertsSection;
