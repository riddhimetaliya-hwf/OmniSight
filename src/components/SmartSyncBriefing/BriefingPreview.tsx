
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { BriefingSchedule } from './types';
import { mockBriefingSummary } from './mockData';
import { 
  Download, 
  Calendar, 
  Mail, 
  Share2, 
  Clock, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp,
  BarChart, 
  Check, 
  Zap
} from 'lucide-react';

interface BriefingPreviewProps {
  schedule: BriefingSchedule;
  open: boolean;
  onClose: () => void;
}

const BriefingPreview: React.FC<BriefingPreviewProps> = ({ schedule, open, onClose }) => {
  const [playing, setPlaying] = useState(false);
  
  // Mock function to simulate starting voice readout
  const startVoiceReadout = () => {
    setPlaying(true);
    // In a real implementation, this would connect to a text-to-speech service
    setTimeout(() => setPlaying(false), 5000);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{schedule.title}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="summary" className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center">
              <Zap className="mr-2 h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Recommendations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockBriefingSummary.metrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">{metric.name}</div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      {metric.trend && (
                        <div className={`flex items-center ${
                          metric.trend === 'up' 
                            ? 'text-green-600' 
                            : metric.trend === 'down' 
                              ? 'text-red-600' 
                              : 'text-gray-600'
                        }`}>
                          {metric.trend === 'up' ? (
                            <ArrowUp className="h-4 w-4 mr-1" />
                          ) : metric.trend === 'down' ? (
                            <ArrowDown className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowRight className="h-4 w-4 mr-1" />
                          )}
                          <span>{metric.changePercent ? `${Math.abs(metric.changePercent)}%` : ''}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-4">
            <div className="space-y-3">
              {mockBriefingSummary.insights.map((insight, index) => (
                <div key={index} className="p-3 border rounded-md bg-muted/50">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p>{insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="mt-4">
            <div className="space-y-3">
              {mockBriefingSummary.recommendations.map((recommendation, index) => (
                <div key={index} className="p-3 border rounded-md bg-muted/50">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p>{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="mr-4">Next: {schedule.nextBriefing.toLocaleDateString()}</span>
          
          <Clock className="h-4 w-4 mr-1" />
          <span>{schedule.time}</span>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2">
            {schedule.voiceEnabled && (
              <Button 
                variant="outline"
                onClick={startVoiceReadout}
                disabled={playing}
              >
                {playing ? "Playing..." : "Play Voice Summary"}
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" title="Send via Email">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Add to Calendar">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Download">
              <Download className="h-4 w-4" />
            </Button>
            
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BriefingPreview;
