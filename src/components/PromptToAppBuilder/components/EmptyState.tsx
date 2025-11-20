
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquarePlus } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center text-center p-8 h-[600px]">
        <div className="rounded-full bg-muted p-3 mb-4">
          <MessageSquarePlus className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Create Your App</h2>
        <p className="text-muted-foreground mb-4 max-w-md">
          Describe the app you want to build using natural language or voice commands. 
          Our AI will convert your description into a functional application.
        </p>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Try saying:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-left">
            <li>"Create a CRM interface that shows customer details"</li>
            <li>"Build a leave request form for HR with manager approval"</li>
            <li>"Create a sales dashboard with regional performance metrics"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
