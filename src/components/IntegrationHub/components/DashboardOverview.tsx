
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Database,
  Zap,
  Clock,
  Users
} from 'lucide-react';

interface DashboardOverviewProps {
  integrations: Array<{
    name: string;
    status: 'active' | 'syncing' | 'failed' | 'inactive';
    dataPoints?: number;
    lastSync?: string;
  }>;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ integrations }) => {
  const totalIntegrations = integrations.length;
  const activeIntegrations = integrations.filter(i => i.status === 'active').length;
  const failedIntegrations = integrations.filter(i => i.status === 'failed').length;
  const totalDataPoints = integrations.reduce((sum, i) => sum + (i.dataPoints || 0), 0);
  const healthScore = totalIntegrations > 0 ? Math.round((activeIntegrations / totalIntegrations) * 100) : 0;

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="grid gap-6 md:grid-cols-4 mb-8">
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Integration Health</CardTitle>
          <Activity className={`h-4 w-4 ${getHealthColor(healthScore)}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{healthScore}%</div>
          <Progress value={healthScore} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {activeIntegrations} of {totalIntegrations} active
          </p>
        </CardContent>
        <div className={`absolute top-0 right-0 w-2 h-full ${getHealthBgColor(healthScore)}`} />
      </Card>

      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeIntegrations}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            +2 from last week
          </p>
        </CardContent>
        <div className="absolute top-0 right-0 w-2 h-full bg-green-100" />
      </Card>

      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Data Points</CardTitle>
          <Database className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(totalDataPoints / 1000000).toFixed(1)}M</div>
          <p className="text-xs text-muted-foreground">
            <Clock className="inline h-3 w-3 mr-1" />
            Last sync: 2 min ago
          </p>
        </CardContent>
        <div className="absolute top-0 right-0 w-2 h-full bg-blue-100" />
      </Card>

      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Issues</CardTitle>
          <AlertTriangle className={`h-4 w-4 ${failedIntegrations > 0 ? 'text-red-600' : 'text-gray-400'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{failedIntegrations}</div>
          {failedIntegrations > 0 ? (
            <Badge variant="destructive" className="text-xs mt-2">
              Requires attention
            </Badge>
          ) : (
            <p className="text-xs text-muted-foreground mt-2">All systems operational</p>
          )}
        </CardContent>
        <div className={`absolute top-0 right-0 w-2 h-full ${failedIntegrations > 0 ? 'bg-red-100' : 'bg-gray-100'}`} />
      </Card>
    </div>
  );
};

export default DashboardOverview;
