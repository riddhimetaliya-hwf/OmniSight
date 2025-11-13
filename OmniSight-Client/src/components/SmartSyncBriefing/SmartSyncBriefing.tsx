
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, CalendarDays, BarChart3 } from 'lucide-react';

import ScheduleList from './ScheduleList';
import CreateBriefing from './CreateBriefing';
import BriefingCalendar from './BriefingCalendar';
import BriefingPreview from './BriefingPreview';
import { mockSchedules } from './mockData';
import { BriefingSchedule } from './types';

const SmartSyncBriefing: React.FC = () => {
  const [schedules, setSchedules] = useState<BriefingSchedule[]>(mockSchedules);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<BriefingSchedule | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleCreateBriefing = (newBriefing: BriefingSchedule) => {
    setSchedules([...schedules, newBriefing]);
    setShowCreateForm(false);
  };

  const handleDeleteBriefing = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  const handleOpenPreview = (schedule: BriefingSchedule) => {
    setSelectedSchedule(schedule);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Data Briefings</h1>
          <p className="text-muted-foreground">Schedule automated data syncs and briefings</p>
        </div>
        
        <Button 
          onClick={() => setShowCreateForm(true)} 
          disabled={showCreateForm}
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule Briefing
        </Button>
      </header>
      
      {showCreateForm ? (
        <CreateBriefing 
          onCancel={() => setShowCreateForm(false)} 
          onSave={handleCreateBriefing}
        />
      ) : (
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Briefings
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <ScheduleList 
              schedules={schedules} 
              onDelete={handleDeleteBriefing}
              onPreview={handleOpenPreview}
            />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <BriefingCalendar 
              schedules={schedules} 
              onBriefingClick={handleOpenPreview}
            />
          </TabsContent>
        </Tabs>
      )}
      
      {previewOpen && selectedSchedule && (
        <BriefingPreview 
          schedule={selectedSchedule} 
          open={previewOpen} 
          onClose={() => setPreviewOpen(false)} 
        />
      )}
    </div>
  );
};

export default SmartSyncBriefing;
