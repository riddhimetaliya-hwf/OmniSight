
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserPrefs } from '../context/UserPrefsContext';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotificationChannel, NotificationPreference } from '../types';
import { Bell, Mail, Globe, MessageSquare, Smartphone, Calendar, ArrowDownToLine } from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const { updateNotifications } = useUserPrefs();
  const [notifications, setNotifications] = useState<NotificationPreference[]>([
    { channel: 'email', enabled: true, frequency: 'immediate', type: 'all' },
    { channel: 'browser', enabled: true, frequency: 'immediate', type: 'all' },
    { channel: 'mobile', enabled: false, frequency: 'daily', type: 'important' },
    { channel: 'digest', enabled: true, frequency: 'weekly', type: 'summary' },
    { channel: 'in-app', enabled: true, frequency: 'immediate', type: 'all' },
    { channel: 'slack', enabled: false, frequency: 'daily', type: 'important' },
    { channel: 'teams', enabled: false, frequency: 'daily', type: 'important' }
  ]);

  const handleToggleChannel = (channel: NotificationChannel, enabled: boolean) => {
    const updatedNotifications = notifications.map(notification => 
      notification.channel === channel ? { ...notification, enabled } : notification
    );
    setNotifications(updatedNotifications);
    updateNotifications(updatedNotifications);
  };

  const handleChangeFrequency = (channel: NotificationChannel, frequency: 'immediate' | 'daily' | 'weekly') => {
    const updatedNotifications = notifications.map(notification => 
      notification.channel === channel ? { ...notification, frequency } : notification
    );
    setNotifications(updatedNotifications);
    updateNotifications(updatedNotifications);
  };

  const getChannelIcon = (channel: NotificationChannel) => {
    switch(channel) {
      case 'email': return <Mail className="h-5 w-5" />;
      case 'browser': return <Globe className="h-5 w-5" />;
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'digest': return <Calendar className="h-5 w-5" />;
      case 'in-app': return <Bell className="h-5 w-5" />;
      case 'slack': return <MessageSquare className="h-5 w-5" />;
      case 'teams': return <MessageSquare className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getChannelLabel = (channel: NotificationChannel) => {
    switch(channel) {
      case 'email': return 'Email Notifications';
      case 'browser': return 'Browser Notifications';
      case 'mobile': return 'Mobile Push Notifications';
      case 'digest': return 'Weekly Digest';
      case 'in-app': return 'In-App Notifications';
      case 'slack': return 'Slack Notifications';
      case 'teams': return 'Teams Notifications';
      default: return 'Notifications';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-slate-500" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {notifications.map((notification) => (
          <div key={notification.channel} className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 py-2 border-b last:border-0">
            <div className="flex items-center gap-3">
              <div className="text-slate-500">
                {getChannelIcon(notification.channel)}
              </div>
              <div>
                <Label className="font-medium">{getChannelLabel(notification.channel)}</Label>
                <p className="text-sm text-muted-foreground">
                  {notification.channel === 'digest' 
                    ? 'Receive a summary of updates' 
                    : `Get notified about ${notification.type || 'all'} updates`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              {notification.channel !== 'digest' && (
                <Select 
                  value={notification.frequency} 
                  onValueChange={(value) => handleChangeFrequency(notification.channel, value as any)}
                  disabled={!notification.enabled}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <Switch
                checked={notification.enabled}
                onCheckedChange={(checked) => handleToggleChannel(notification.channel, checked)}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
