
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOmniCommand } from '../context/OmniCommandContext';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, CheckCircle2, Clock, ListChecks, Lightbulb, HelpCircle, Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const SnapshotCardsGrid: React.FC = () => {
  const { snapshots, togglePinItem, settings } = useOmniCommand();
  
  const getSnapshotIcon = (type: string) => {
    switch (type) {
      case 'priorities':
        return <ListChecks className="h-4 w-4" />;
      case 'decisions':
        return <HelpCircle className="h-4 w-4" />;
      case 'insights':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <ListChecks className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 gap-1">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 gap-1">
            <Clock className="h-3 w-3" /> In Progress
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 gap-1">
            <CalendarClock className="h-3 w-3" /> Pending
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const isPinned = (id: string) => {
    return settings.pinnedItems.some(item => item.id === id && item.type === 'snapshot');
  };
  
  const handleTogglePin = (snapshot: typeof snapshots[0]) => {
    togglePinItem({
      id: snapshot.id,
      type: 'snapshot',
      position: {
        x: 0,
        y: 0,
        width: 1,
        height: 1
      }
    });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {snapshots.map((snapshot) => (
        <Card key={snapshot.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {getSnapshotIcon(snapshot.type)}
              {snapshot.title}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => handleTogglePin(snapshot)}
            >
              {isPinned(snapshot.id) ? (
                <PinOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Pin className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {snapshot.items.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <Separator className="my-2" />}
                  <div className="space-y-1">
                    <div className="text-sm">{item.text}</div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {getStatusBadge(item.status)}
                      {item.dueDate && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarClock className="h-3 w-3" />
                          {new Date(item.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SnapshotCardsGrid;
