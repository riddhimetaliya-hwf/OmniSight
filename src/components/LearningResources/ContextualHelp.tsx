
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, BookOpen, Video, Check } from 'lucide-react';

interface ContextualHelpProps {
  topic: string;
  sections?: {
    id: string;
    title: string;
    content: React.ReactNode;
  }[];
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({ 
  topic, 
  sections = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="space-y-4">
          <p>This is the overview section for {topic}.</p>
          <p>Here you would find a basic introduction to the feature and its main capabilities.</p>
        </div>
      )
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: (
        <div className="space-y-4">
          <p>Getting started with {topic} is easy:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Configure your initial settings</li>
            <li>Set up the required parameters</li>
            <li>Start using the feature</li>
          </ol>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'FAQ',
      content: (
        <div className="space-y-4">
          <div>
            <p className="font-medium">How do I customize {topic}?</p>
            <p className="text-sm text-muted-foreground">You can customize settings in the configuration panel.</p>
          </div>
          <div>
            <p className="font-medium">Can I export data from {topic}?</p>
            <p className="text-sm text-muted-foreground">Yes, use the export button in the top right corner.</p>
          </div>
          <div>
            <p className="font-medium">Is there a limit to how many {topic} I can create?</p>
            <p className="text-sm text-muted-foreground">No, you can create as many as you need within your plan limits.</p>
          </div>
        </div>
      )
    }
  ]
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setOpen(true)}
        aria-label={`Help for ${topic}`}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              <span>Help: {topic}</span>
            </DialogTitle>
          </DialogHeader>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-4"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            {sections.map(section => (
              <TabsContent key={section.id} value={section.id} className="mt-4">
                {section.content}
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="flex justify-between mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm">View full documentation</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" />
              <span className="text-sm">Watch tutorial</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-md text-sm flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <div>
              <p>Found what you were looking for?</p>
              <p className="text-muted-foreground">Help us improve by providing feedback on this help content.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContextualHelp;
