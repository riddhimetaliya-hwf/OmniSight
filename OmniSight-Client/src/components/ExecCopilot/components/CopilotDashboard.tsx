
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart2, User, AreaChart, Search, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

interface AlertCardProps {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  time: string;
}

interface DetailedMetricCardProps extends MetricCardProps {
  target: string;
  progress: number;
  period: string;
}

interface OpportunityCardProps {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: string;
}

const CopilotDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('insights');
  
  return (
    <div className="flex flex-col h-full p-4 overflow-auto">
      <h3 className="text-lg font-semibold mb-4">Executive Dashboard</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="insights" className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            <span>Key Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span>Opportunities</span>
          </TabsTrigger>
          <TabsTrigger value="targets" className="flex items-center gap-1.5">
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Performance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="mt-0 flex-1">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {keyMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Active Alerts</h4>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <AlertCard key={index} {...alert} />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="targets" className="mt-0 flex-1">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <DetailedMetricCard 
                title="Revenue Target" 
                value="$2.4M" 
                change="+8.5%" 
                trend="up" 
                target="$2.2M"
                progress={92}
                period="This quarter" 
              />
              
              <DetailedMetricCard 
                title="Customer Acquisition" 
                value="1,240" 
                change="+12%" 
                trend="up" 
                target="1,000"
                progress={124}
                period="This quarter" 
              />
              
              <DetailedMetricCard 
                title="Operating Margin" 
                value="24.5%" 
                change="-2.1%" 
                trend="down" 
                target="28%"
                progress={87}
                period="Year to date" 
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="opportunities" className="mt-0 flex-1">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-medium">Opportunities</h4>
              <Badge variant="outline" className="font-normal text-xs">7 total</Badge>
            </div>
            
            {opportunities.map((opportunity, index) => (
              <OpportunityCard key={index} {...opportunity} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend }) => {
  return (
    <Card className="overflow-hidden shadow-none">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          {trend === 'up' ? (
            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
          ) : trend === 'down' ? (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          ) : (
            <div className="h-3.5 w-3.5 flex items-center justify-center">
              <div className="w-3 h-0.5 bg-gray-400"></div>
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-semibold">{value}</span>
          <span className={`text-xs font-medium ${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const AlertCard: React.FC<AlertCardProps> = ({ title, description, severity, time }) => {
  return (
    <Card className="overflow-hidden shadow-none border-l-4 border-l-red-500">
      <CardContent className="p-3">
        <div className="flex justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className={`h-3.5 w-3.5 ${
              severity === 'high' ? 'text-red-500' : 
              severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
            }`} />
            <span className="text-xs font-medium">{title}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const DetailedMetricCard: React.FC<DetailedMetricCardProps> = ({ 
  title, value, change, trend, target, progress, period 
}) => {
  return (
    <Card className="overflow-hidden shadow-none">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-1">
          <p className="text-xs font-medium">{title}</p>
          <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
            {period}
          </Badge>
        </div>
        
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-xl font-semibold">{value}</span>
          <span className={`text-xs font-medium ${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {change}
          </span>
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Target: {target}</span>
          <span>{progress}%</span>
        </div>
        
        <Progress
          value={progress} 
          max={100}
          className={`h-1.5 ${
            trend === 'up' ? 'bg-muted text-green-500' : 
            trend === 'down' ? 'bg-muted text-red-500' : 'bg-muted text-blue-500'
          }`}
        />
      </CardContent>
    </Card>
  );
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({ title, description, impact, effort }) => {
  return (
    <Card className="overflow-hidden shadow-none border-l-4 border-l-green-500">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-1">
          <p className="text-xs font-medium">{title}</p>
          <Badge 
            className={`text-[10px] font-normal ${
              impact === 'high' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : impact === 'medium' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {impact} impact
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground">{effort}</span>
          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
        </div>
      </CardContent>
    </Card>
  );
};

// Sample data with correct type annotations
const keyMetrics = [
  { title: "Revenue", value: "$2.4M", change: "+15%", trend: "up" as const },
  { title: "Customers", value: "1,240", change: "+12%", trend: "up" as const },
  { title: "Avg. Order", value: "$1,280", change: "+8%", trend: "up" as const },
  { title: "CAC", value: "$420", change: "-12%", trend: "down" as const }
];

const alerts = [
  { 
    title: "Revenue Alert", 
    description: "Q3 projections are 8% below target. Requires attention.", 
    severity: "high" as const, 
    time: "2h ago" 
  },
  { 
    title: "Customer Retention", 
    description: "Enterprise segment showing higher than usual churn rates.", 
    severity: "medium" as const, 
    time: "6h ago" 
  }
];

const opportunities = [
  { 
    title: "Cross-sell opportunity", 
    description: "250 customers likely to upgrade to premium plan based on usage patterns.", 
    impact: "high" as const, 
    effort: "Medium effort" 
  },
  { 
    title: "Process automation", 
    description: "Automating approval workflow could save 240 person-hours per month.", 
    impact: "medium" as const, 
    effort: "Low effort" 
  },
  { 
    title: "Inventory optimization", 
    description: "Reducing safety stock could free up $240K in working capital.", 
    impact: "high" as const, 
    effort: "High effort" 
  }
];

export default CopilotDashboard;
