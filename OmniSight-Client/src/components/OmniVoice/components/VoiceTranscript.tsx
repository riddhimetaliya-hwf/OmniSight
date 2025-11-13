
import React from 'react';
import { Card } from '@/components/ui/card';

interface VoiceTranscriptProps {
  transcript: string;
  response: string;
  isProcessing: boolean;
}

const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({ 
  transcript, 
  response, 
  isProcessing 
}) => {
  if (!transcript && !response) return null;
  
  return (
    <div className="space-y-4">
      {transcript && (
        <Card className="p-3 bg-muted/30">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-medium">You</span>
            </div>
            <div>
              <p className="text-sm">{transcript}</p>
            </div>
          </div>
        </Card>
      )}
      
      {(response || isProcessing) && (
        <Card className="p-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <span className="text-xs font-medium">AI</span>
            </div>
            <div>
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary mx-1"></span>
                    <span className="inline-block h-2 w-2 rounded-full bg-primary mx-1 animate-delay-100"></span>
                    <span className="inline-block h-2 w-2 rounded-full bg-primary mx-1 animate-delay-200"></span>
                  </div>
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              ) : (
                <p className="text-sm">{response}</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VoiceTranscript;
