
import React from 'react';
import { BriefingSchedule } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Trash2, 
  Eye, 
  Bell, 
  Mic, 
  Users,
  BarChart, 
  DollarSign, 
  ShoppingCart, 
  LineChart, 
  PieChart,
} from 'lucide-react';

interface ScheduleListProps {
  schedules: BriefingSchedule[];
  onDelete: (id: string) => void;
  onPreview: (schedule: BriefingSchedule) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, onDelete, onPreview }) => {
  if (schedules.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-background">
        <p className="text-muted-foreground mb-4">No scheduled briefings yet.</p>
        <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-sm">Click "Schedule Briefing" to create your first data sync.</p>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'kpi':
        return <BarChart className="h-4 w-4" />;
      case 'finance':
        return <DollarSign className="h-4 w-4" />;
      case 'sales':
        return <ShoppingCart className="h-4 w-4" />;
      case 'marketing':
        return <LineChart className="h-4 w-4" />;
      case 'operations':
        return <PieChart className="h-4 w-4" />;
      default:
        return <BarChart className="h-4 w-4" />;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'bg-blue-100 text-blue-800';
      case 'weekly':
        return 'bg-green-100 text-green-800';
      case 'monthly':
        return 'bg-purple-100 text-purple-800';
      case 'quarterly':
        return 'bg-orange-100 text-orange-800';
      case 'one-time':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCalendarIcon = (calendar: string) => {
    switch (calendar) {
      case 'google':
        return "Google Calendar";
      case 'outlook':
        return "Outlook";
      case 'apple':
        return "Apple Calendar";
      default:
        return "No Calendar";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {schedules.map((schedule) => (
        <Card key={schedule.id} className="group">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-medium flex items-center">
                {getTypeIcon(schedule.type)}
                <span className="ml-2">{schedule.title}</span>
              </CardTitle>
              <Badge variant="outline" className={getFrequencyColor(schedule.frequency)}>
                {schedule.frequency}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {schedule.description && (
              <p className="text-sm text-muted-foreground">{schedule.description}</p>
            )}
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {schedule.time} {schedule.calendar !== 'none' && `(${getCalendarIcon(schedule.calendar)})`}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Next: {formatDistanceToNow(schedule.nextBriefing, { addSuffix: true })}</span>
              </div>
              
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{schedule.recipients.length} recipient{schedule.recipients.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div className="flex space-x-2">
                {schedule.notificationEnabled && (
                  <Badge variant="outline" className="bg-muted">
                    <Bell className="h-3 w-3 mr-1" />
                    Notify
                  </Badge>
                )}
                
                {schedule.voiceEnabled && (
                  <Badge variant="outline" className="bg-muted">
                    <Mic className="h-3 w-3 mr-1" />
                    Voice
                  </Badge>
                )}
              </div>
              
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onPreview(schedule)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDelete(schedule.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScheduleList;
