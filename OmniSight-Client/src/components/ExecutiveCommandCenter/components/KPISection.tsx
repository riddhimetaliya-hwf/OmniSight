
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Activity,
  Clock,
  Percent,
  BarChart,
  Server
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ExecutiveRole = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  target?: string;
  period?: string;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon,
  target,
  period = 'This Quarter'
}) => {
  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              <Badge 
                variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'outline'}
                className="flex items-center gap-1 mb-1"
              >
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : trend === 'down' ? (
                  <TrendingDown className="h-3 w-3" />
                ) : null}
                {change}
              </Badge>
            </div>
          </div>
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            {icon}
          </div>
        </div>
        
        {target && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress to Target: {target}</span>
              <span>75%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: '75%' }}
              />
            </div>
          </div>
        )}
        
        <p className="text-xs text-slate-500 mt-3">{period}</p>
      </CardContent>
    </Card>
  );
};

interface KPISectionProps {
  role: ExecutiveRole;
}

const KPISection: React.FC<KPISectionProps> = ({ role }) => {
  // Different KPIs based on executive role
  const kpisByRole = {
    'CEO': [
      { 
        title: 'Revenue', 
        value: '$4.2M', 
        change: '+12%', 
        trend: 'up' as const, 
        icon: <DollarSign className="h-5 w-5 text-green-500" />,
        target: '$5M'
      },
      { 
        title: 'New Customers', 
        value: '2,848', 
        change: '+8.5%', 
        trend: 'up' as const, 
        icon: <Users className="h-5 w-5 text-blue-500" />,
        target: '3,000'
      },
      { 
        title: 'Market Share', 
        value: '24.8%', 
        change: '+1.2%', 
        trend: 'up' as const, 
        icon: <Percent className="h-5 w-5 text-purple-500" />,
        target: '26%'
      },
      { 
        title: 'Profit Margin', 
        value: '18.3%', 
        change: '-0.5%', 
        trend: 'down' as const, 
        icon: <Activity className="h-5 w-5 text-red-500" />,
        target: '20%'
      }
    ],
    'CFO': [
      { 
        title: 'Revenue', 
        value: '$4.2M', 
        change: '+12%', 
        trend: 'up' as const, 
        icon: <DollarSign className="h-5 w-5 text-green-500" />,
        target: '$5M'
      },
      { 
        title: 'Operating Expenses', 
        value: '$1.8M', 
        change: '-3.2%', 
        trend: 'down' as const, 
        icon: <TrendingDown className="h-5 w-5 text-green-500" />,
        target: '$1.7M'
      },
      { 
        title: 'Cash Flow', 
        value: '$842K', 
        change: '+5.7%', 
        trend: 'up' as const, 
        icon: <Activity className="h-5 w-5 text-blue-500" />,
        target: '$900K'
      },
      { 
        title: 'Debt-to-Equity', 
        value: '0.38', 
        change: '-0.05', 
        trend: 'down' as const, 
        icon: <BarChart className="h-5 w-5 text-purple-500" />,
        target: '0.35'
      }
    ],
    'COO': [
      { 
        title: 'Production Output', 
        value: '12,530', 
        change: '+8.2%', 
        trend: 'up' as const, 
        icon: <ShoppingBag className="h-5 w-5 text-green-500" />,
        target: '13,000'
      },
      { 
        title: 'Defect Rate', 
        value: '0.8%', 
        change: '-0.3%', 
        trend: 'down' as const, 
        icon: <TrendingDown className="h-5 w-5 text-green-500" />,
        target: '0.5%'
      },
      { 
        title: 'Cycle Time', 
        value: '4.2 days', 
        change: '-0.5 days', 
        trend: 'down' as const, 
        icon: <Clock className="h-5 w-5 text-blue-500" />,
        target: '4.0 days'
      },
      { 
        title: 'Supply Chain Efficiency', 
        value: '94.2%', 
        change: '+2.3%', 
        trend: 'up' as const, 
        icon: <Activity className="h-5 w-5 text-purple-500" />,
        target: '96%'
      }
    ],
    'CTO': [
      { 
        title: 'System Uptime', 
        value: '99.98%', 
        change: '+0.05%', 
        trend: 'up' as const, 
        icon: <Server className="h-5 w-5 text-green-500" />,
        target: '99.99%'
      },
      { 
        title: 'Dev Velocity', 
        value: '89 SP', 
        change: '+12 SP', 
        trend: 'up' as const, 
        icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
        target: '95 SP'
      },
      { 
        title: 'Technical Debt', 
        value: '14.3%', 
        change: '-2.1%', 
        trend: 'down' as const, 
        icon: <TrendingDown className="h-5 w-5 text-green-500" />,
        target: '10%'
      },
      { 
        title: 'Security Incidents', 
        value: '2', 
        change: '-4', 
        trend: 'down' as const, 
        icon: <Activity className="h-5 w-5 text-green-500" />,
        target: '0'
      }
    ],
    'CMO': [
      { 
        title: 'Marketing ROI', 
        value: '287%', 
        change: '+24%', 
        trend: 'up' as const, 
        icon: <DollarSign className="h-5 w-5 text-green-500" />,
        target: '300%'
      },
      { 
        title: 'Customer Acquisition', 
        value: '$42.10', 
        change: '-$3.50', 
        trend: 'down' as const, 
        icon: <TrendingDown className="h-5 w-5 text-green-500" />,
        target: '$40.00'
      },
      { 
        title: 'Conversion Rate', 
        value: '3.8%', 
        change: '+0.4%', 
        trend: 'up' as const, 
        icon: <Percent className="h-5 w-5 text-blue-500" />,
        target: '4.0%'
      },
      { 
        title: 'Brand Awareness', 
        value: '68%', 
        change: '+5%', 
        trend: 'up' as const, 
        icon: <Activity className="h-5 w-5 text-purple-500" />,
        target: '75%'
      }
    ]
  };

  const kpis = kpisByRole[role] || kpisByRole['CEO'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          trend={kpi.trend}
          icon={kpi.icon}
          target={kpi.target}
        />
      ))}
    </div>
  );
};

export default KPISection;
