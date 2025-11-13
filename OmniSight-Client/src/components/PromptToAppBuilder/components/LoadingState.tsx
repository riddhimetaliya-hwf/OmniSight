
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center text-center p-8 h-[600px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Building Your App</h2>
        <p className="text-muted-foreground mb-4 max-w-md">
          Our AI is translating your description into a functional application.
          This may take a few moments...
        </p>
        <div className="w-full max-w-xs bg-muted rounded-full h-2.5 mt-4">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{
              width: '70%',
              animation: 'progress 2s ease-in-out infinite'
            }}
          />
        </div>
        <style>
          {`
            @keyframes progress {
              0% { width: 20%; }
              50% { width: 75%; }
              100% { width: 20%; }
            }
          `}
        </style>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
