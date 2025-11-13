
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Smartphone,
  Filter,
  Settings,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import { ExecutiveRole } from '@/types/executive-roles';

interface SmartNotification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'performance' | 'risk' | 'opportunity' | 'operational';
  title: string;
  message: string;
  priority: number;
  contextualAction?: string;
  timestamp: Date;
  isRead: boolean;
  isMobileEnabled: boolean;
  source: string;
}

interface SmartNotificationsProps {
  role: ExecutiveRole;
}

const SmartNotifications: React.FC<SmartNotificationsProps> = ({ role }) => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [mobileNotifications, setMobileNotifications] = useState(true);
  const [proactiveAlerts, setProactiveAlerts] = useState(true);

  const mockNotifications: Record<ExecutiveRole, SmartNotification[]> = {
    CEO: [
      {
        id: '1',
        type: 'critical',
        category: 'risk',
        title: 'Market Share Decline Alert',
        message: 'Market share dropped 2.3% this week. Competitor XYZ launched aggressive pricing campaign.',
        priority: 95,
        contextualAction: 'Review competitive response strategy',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        isMobileEnabled: true,
        source: 'Market Intelligence AI'
      },
      {
        id: '2',
        type: 'warning',
        category: 'opportunity',
        title: 'M&A Opportunity Identified',
        message: 'AI detected potential acquisition target: TechStartup Inc. Valuation appears 15% below market.',
        priority: 78,
        contextualAction: 'Schedule due diligence review',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        isMobileEnabled: true,
        source: 'Strategic AI Engine'
      }
    ],
    CFO: [
      {
        id: '3',
        type: 'critical',
        category: 'risk',
        title: 'Cash Flow Warning',
        message: 'Predictive model shows potential cash flow shortage in 6 weeks if current burn rate continues.',
        priority: 92,
        contextualAction: 'Review budget allocation and credit facilities',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isRead: false,
        isMobileEnabled: true,
        source: 'Financial Forecasting AI'
      },
      {
        id: '4',
        type: 'info',
        category: 'opportunity',
        title: 'Tax Optimization Opportunity',
        message: 'New regulations allow for $2.3M additional tax savings through R&D credit restructuring.',
        priority: 65,
        contextualAction: 'Consult with tax advisory team',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isRead: true,
        isMobileEnabled: false,
        source: 'Regulatory Monitor'
      }
    ],
    COO: [
      {
        id: '5',
        type: 'warning',
        category: 'operational',
        title: 'Supply Chain Disruption Risk',
        message: 'Weather patterns indicate 73% probability of shipping delays from Port of Shanghai next week.',
        priority: 84,
        contextualAction: 'Activate alternative shipping routes',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        isRead: false,
        isMobileEnabled: true,
        source: 'Supply Chain AI'
      }
    ],
    CTO: [
      {
        id: '6',
        type: 'critical',
        category: 'risk',
        title: 'Security Threat Detected',
        message: 'Anomalous login patterns detected. Potential credential compromise in development environment.',
        priority: 98,
        contextualAction: 'Initiate incident response protocol',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        isRead: false,
        isMobileEnabled: true,
        source: 'Security AI Monitor'
      }
    ],
    CMO: [
      {
        id: '7',
        type: 'success',
        category: 'performance',
        title: 'Campaign Performance Spike',
        message: 'Video campaign ROI exceeded target by 45%. Consider scaling budget allocation.',
        priority: 72,
        contextualAction: 'Increase campaign budget',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        isRead: false,
        isMobileEnabled: true,
        source: 'Marketing Analytics AI'
      }
    ]
  };

  useEffect(() => {
    setNotifications(mockNotifications[role] || []);
  }, [role]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'warning';
      case 'success': return 'success';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <TrendingUp className="h-3 w-3" />;
      case 'risk': return <AlertTriangle className="h-3 w-3" />;
      case 'opportunity': return <CheckCircle className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  const filteredNotifications = notifications
    .filter(n => {
      if (filter === 'unread') return !n.isRead;
      if (filter === 'critical') return n.type === 'critical';
      return true;
    })
    .sort((a, b) => b.priority - a.priority);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const criticalCount = notifications.filter(n => n.type === 'critical' && !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 relative">
            <Bell className="h-5 w-5 text-orange-600" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Smart Notifications & Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Priority-based alerts with contextual recommendations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span className="text-sm">Mobile Alerts</span>
            <Switch 
              checked={mobileNotifications} 
              onCheckedChange={setMobileNotifications} 
            />
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
              </div>
              <Info className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Priority</p>
                <p className="text-2xl font-bold">
                  {Math.round(notifications.reduce((acc, n) => acc + n.priority, 0) / notifications.length)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        {['all', 'unread', 'critical'].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterType as any)}
            className="capitalize"
          >
            {filterType}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`${!notification.isRead ? 'border-l-4 border-l-primary' : ''} hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getTypeIcon(notification.type)}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{notification.title}</h4>
                      <Badge variant={getTypeColor(notification.type)} size="sm">
                        {notification.type}
                      </Badge>
                      <Badge variant="outline" size="sm" className="gap-1">
                        {getCategoryIcon(notification.category)}
                        {notification.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {notification.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    {notification.contextualAction && (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          {notification.contextualAction}
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          Source: {notification.source}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" size="sm">
                    P{notification.priority}
                  </Badge>
                  {!notification.isRead && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SmartNotifications;
