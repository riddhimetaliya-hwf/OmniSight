
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Target,
  Briefcase,
  Activity,
  Zap
} from 'lucide-react';

const ExecutiveContextSidebar: React.FC = () => {
  const currentTime = new Date();
  const upcomingMeetings = [
    { id: '1', title: 'Board Review', time: '10:00 AM', attendees: 8, priority: 'high' },
    { id: '2', title: 'Team Standup', time: '2:00 PM', attendees: 12, priority: 'medium' },
    { id: '3', title: 'Investor Call', time: '4:30 PM', attendees: 4, priority: 'high' }
  ];

  const keyMetrics = [
    { id: '1', name: 'Revenue', value: '$2.4M', change: '+12%', trend: 'up', target: 85 },
    { id: '2', name: 'Team Performance', value: '94%', change: '+8%', trend: 'up', target: 94 },
    { id: '3', name: 'Customer Sat.', value: '4.8/5', change: '+0.2', trend: 'up', target: 96 },
    { id: '4', name: 'Operating Costs', value: '$180K', change: '-5%', trend: 'up', target: 75 }
  ];

  const criticalAlerts = [
    { id: '1', title: 'Q4 Budget Review Due', type: 'urgent', time: '2 hours' },
    { id: '2', title: 'Server Capacity at 85%', type: 'warning', time: '4 hours' },
    { id: '3', title: 'New Partnership Proposal', type: 'info', time: '1 day' }
  ];

  const quickActions = [
    { id: '1', title: 'Morning Brief', icon: Briefcase, action: 'Generate daily briefing' },
    { id: '2', title: 'Team Check-in', icon: Users, action: 'Schedule team reviews' },
    { id: '3', title: 'Financial Summary', icon: DollarSign, action: 'Create financial report' },
    { id: '4', title: 'Strategic Goals', icon: Target, action: 'Review quarterly targets' }
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Executive Summary */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            Executive Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {currentTime.toLocaleDateString()}
            </p>
            <p className="text-sm text-slate-500 font-medium">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200/50">
              <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">On Track</p>
              <p className="text-xl font-bold text-emerald-800">8/10</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
              <AlertTriangle className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">Attention</p>
              <p className="text-xl font-bold text-amber-800">3</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingMeetings.map((meeting) => (
            <div key={meeting.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl hover:from-slate-100 hover:to-slate-200/50 transition-all duration-200 cursor-pointer border border-slate-200/30">
              <div className="flex-1">
                <p className="font-semibold text-sm text-slate-800">{meeting.title}</p>
                <p className="text-xs text-slate-600 mt-1">{meeting.time} • {meeting.attendees} attendees</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant="outline" 
                  className={`text-xs font-semibold px-3 py-1 ${
                    meeting.priority === 'high' 
                      ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-300' 
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-300'
                  }`}
                >
                  {meeting.priority}
                </Badge>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {keyMetrics.map((metric) => (
            <div key={metric.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">{metric.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-800">{metric.value}</span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    metric.trend === 'up' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {metric.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {metric.change}
                  </div>
                </div>
              </div>
              <Progress value={metric.target} className="h-2 bg-slate-200" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            Critical Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {criticalAlerts.map((alert) => (
            <div key={alert.id} className="p-4 rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50/80 to-orange-50/80 hover:from-amber-100/80 hover:to-orange-100/80 transition-all duration-200 cursor-pointer">
              <p className="font-semibold text-sm text-slate-800">{alert.title}</p>
              <p className="text-xs text-slate-600 mt-1">Due in {alert.time}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action) => (
            <Button 
              key={action.id} 
              variant="outline" 
              size="sm" 
              className="w-full justify-start gap-3 h-12 bg-white/50 hover:bg-white/80 border-slate-200/50 hover:border-slate-300/50 transition-all duration-200"
            >
              <action.icon className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">{action.title}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveContextSidebar;
