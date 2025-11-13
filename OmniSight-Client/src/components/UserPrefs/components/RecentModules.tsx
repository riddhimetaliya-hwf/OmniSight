
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserPrefs } from '../context/UserPrefsContext';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

const RecentModules: React.FC = () => {
  const { preferences } = useUserPrefs();
  const navigate = useNavigate();

  const formatAccessTime = (accessedAt: string) => {
    const date = new Date(accessedAt);
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE');
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  const navigateToModule = (path: string) => {
    navigate(path);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-500" /> 
          Recently Visited
        </CardTitle>
      </CardHeader>
      <CardContent>
        {preferences.recentModules && preferences.recentModules.length > 0 ? (
          <div className="space-y-3">
            {preferences.recentModules.map((module) => (
              <div 
                key={module.id} 
                className="flex items-center justify-between p-3 rounded-md border border-muted hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigateToModule(module.path)}
              >
                <div>
                  <div className="font-medium">{module.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatAccessTime(module.accessedAt)}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No recent activity</p>
            <p className="text-sm">Your recently visited sections will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentModules;
