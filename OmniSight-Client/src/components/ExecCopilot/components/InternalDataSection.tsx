
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DollarSign, BarChart3, Users } from 'lucide-react';
import MetricItem from './MetricItem';

const InternalDataSection: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Financial KPIs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <MetricItem 
            label="Quarterly Revenue" 
            value="$28.5M" 
            change="+8.2%" 
            trend="up" 
            progress={92}
            target="$31M"
          />
          <Separator />
          <MetricItem 
            label="Operating Margin" 
            value="24.8%" 
            change="+1.5%" 
            trend="up" 
            progress={88}
            target="28%"
          />
          <Separator />
          <MetricItem 
            label="Cash on Hand" 
            value="$12.4M" 
            change="-3.1%" 
            trend="down" 
            progress={75}
            target="$16M"
          />
        </CardContent>
      </Card>
      
      {/* Sales & Marketing */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
            Sales & Marketing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <MetricItem 
            label="Pipeline Value" 
            value="$42.7M" 
            change="+12.8%" 
            trend="up" 
            progress={85}
            target="$50M"
          />
          <Separator />
          <MetricItem 
            label="Customer Acquisition Cost" 
            value="$1,250" 
            change="-8.4%" 
            trend="down" 
            progress={92}
            target="$1,150"
            invertProgress
          />
          <Separator />
          <MetricItem 
            label="Win Rate" 
            value="32.5%" 
            change="+2.8%" 
            trend="up" 
            progress={81}
            target="40%"
          />
        </CardContent>
      </Card>
      
      {/* Operations & HR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="h-4 w-4 mr-2 text-purple-500" />
            Operations & HR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <MetricItem 
            label="Employee Retention" 
            value="93.7%" 
            change="+1.2%" 
            trend="up" 
            progress={94}
            target="95%"
          />
          <Separator />
          <MetricItem 
            label="Production Output" 
            value="14,250 units" 
            change="+5.3%" 
            trend="up" 
            progress={89}
            target="16,000 units"
          />
          <Separator />
          <MetricItem 
            label="Unfilled Positions" 
            value="12" 
            change="-4" 
            trend="down" 
            progress={80}
            target="8"
            invertProgress
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InternalDataSection;
