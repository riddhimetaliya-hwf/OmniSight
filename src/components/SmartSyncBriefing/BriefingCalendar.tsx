
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { BriefingSchedule } from './types';
import { format, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface BriefingCalendarProps {
  schedules: BriefingSchedule[];
  onBriefingClick: (schedule: BriefingSchedule) => void;
}

const BriefingCalendar: React.FC<BriefingCalendarProps> = ({ schedules, onBriefingClick }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Function to get schedules for a specific date
  const getSchedulesForDate = (date: Date) => {
    return schedules.filter(schedule => isSameDay(schedule.nextBriefing, date));
  };
  
  // Render schedule badges for a specific date
  const renderDateContent = (date: Date) => {
    const dateSchedules = getSchedulesForDate(date);
    
    if (dateSchedules.length === 0) return null;
    
    return (
      <div className="flex justify-center mt-1">
        <Badge className="h-1.5 w-1.5 rounded-full p-0 bg-primary" />
      </div>
    );
  };
  
  // Get all schedules for the selected date
  const selectedDateSchedules = date ? getSchedulesForDate(date) : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="col-span-1 md:col-span-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="border rounded-md p-3"
          components={{
            DayContent: (props) => (
              <div className="relative">
                {props.date.getDate()}
                {renderDateContent(props.date)}
              </div>
            ),
          }}
        />
      </div>
      
      <div className="col-span-1">
        <div className="border rounded-md h-full p-4 bg-card">
          <h3 className="font-medium mb-3 flex items-center">
            {date ? format(date, 'PPPP') : 'Select a date'}
          </h3>
          
          {selectedDateSchedules.length > 0 ? (
            <div className="space-y-3">
              {selectedDateSchedules.map((schedule) => (
                <div 
                  key={schedule.id} 
                  className="p-3 border rounded-md bg-background cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onBriefingClick(schedule)}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm">{schedule.title}</div>
                    <Badge variant="outline" className="text-xs">
                      {schedule.time}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {schedule.description}
                  </p>
                  <p className="text-xs mt-2">
                    {schedule.recipients.length} recipient{schedule.recipients.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No briefings scheduled for this date.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BriefingCalendar;
