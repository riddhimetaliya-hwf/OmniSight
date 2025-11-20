
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Globe, Activity, AlertTriangle } from 'lucide-react';
import MetricItem from './MetricItem';

const ExternalDataSection: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Market Trends */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Globe className="h-4 w-4 mr-2 text-blue-500" />
            Market Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <MetricItem 
            label="Industry Growth Rate" 
            value="6.8%" 
            change="+0.5%" 
            trend="up" 
            progress={78}
            target="Your Growth: 8.2%"
            comparison
          />
          <Separator />
          <MetricItem 
            label="Market Share" 
            value="18.5%" 
            change="+1.2%" 
            trend="up" 
            progress={82}
            target="Leader: 22.3%"
            comparison
          />
          <Separator />
          <MetricItem 
            label="Average Deal Size" 
            value="$285K" 
            change="+15.2%" 
            trend="up" 
            progress={95}
            target="Industry: $240K"
            comparison
          />
        </CardContent>
      </Card>
      
      {/* Competitive Intelligence */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Activity className="h-4 w-4 mr-2 text-amber-500" />
            Competitive Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <MetricItem 
            label="Main Competitor Growth" 
            value="10.2%" 
            change="+1.8%" 
            trend="up" 
            progress={72}
            target="Your Growth: 8.2%"
            comparison
            invertProgress
          />
          <Separator />
          <MetricItem 
            label="Product Launch Activity" 
            value="14 launches" 
            change="+3" 
            trend="up" 
            progress={84}
            target="Your Launches: 6"
            comparison
            invertProgress
          />
          <Separator />
          <MetricItem 
            label="Customer Satisfaction" 
            value="72 NPS" 
            change="+4" 
            trend="up" 
            progress={92}
            target="Industry Avg: 65"
            comparison
          />
        </CardContent>
      </Card>
      
      {/* Risk & Compliance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            Risk & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <MetricItem 
            label="New Regulations Impact" 
            value="Medium" 
            change="Stable" 
            trend="neutral" 
            progress={65}
            target="Industry: High"
            comparison
          />
          <Separator />
          <MetricItem 
            label="Supply Chain Risk" 
            value="Elevated" 
            change="Increasing" 
            trend="up" 
            progress={58}
            target="Industry: Moderate"
            comparison
            invertProgress
          />
          <Separator />
          <MetricItem 
            label="Cybersecurity Threats" 
            value="12 attempts" 
            change="+3" 
            trend="up" 
            progress={70}
            target="Industry: 18"
            comparison
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExternalDataSection;
