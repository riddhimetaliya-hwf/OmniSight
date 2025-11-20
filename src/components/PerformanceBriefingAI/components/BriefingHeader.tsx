
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePerformanceBriefing } from '../context/PerformanceBriefingContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DownloadCloud, Mail, Share2, RefreshCw, Calendar } from 'lucide-react';

const BriefingHeader: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    generateBriefing, 
    exportBriefing, 
    isLoading 
  } = usePerformanceBriefing();

  const handleTimeframeChange = (value: string) => {
    updateSettings({ timeframe: value as any });
    generateBriefing({ timeframe: value as any });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {settings.role} Performance Briefing
            </h2>
            <p className="text-sm text-muted-foreground">
              AI-powered insights for {settings.timeframe} performance review
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => generateBriefing()} 
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => exportBriefing('pdf')}
              disabled={isLoading}
              className="gap-2"
            >
              <DownloadCloud className="h-4 w-4" />
              Export
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => exportBriefing('email')}
              disabled={isLoading}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isLoading}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            
            <Button 
              variant={settings.isScheduled ? "success" : "outline"}
              size="sm" 
              disabled={isLoading}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              {settings.isScheduled ? "Scheduled" : "Schedule"}
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Tabs 
            defaultValue={settings.timeframe} 
            onValueChange={handleTimeframeChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default BriefingHeader;
