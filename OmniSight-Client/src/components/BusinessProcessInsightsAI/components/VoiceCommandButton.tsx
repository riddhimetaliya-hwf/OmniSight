
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VoiceCommandButtonProps {
  onTranscript: (transcript: string) => void;
}

const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    // Create recognition instance
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognitionInstance.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      
      setTranscript(currentTranscript);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      if (transcript) {
        onTranscript(transcript);
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      
      toast({
        title: "Voice recognition error",
        description: `Error: ${event.error}`,
        variant: "destructive",
      });
    };

    setRecognition(recognitionInstance);

    // Cleanup on component unmount
    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Not supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        toast({
          title: "Listening",
          description: "Speak now to analyze business processes...",
        });
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  return (
    <>
      <Button
        variant={isListening ? "default" : "outline"}
        size="sm"
        onClick={toggleListening}
        className={`gap-1 ${isListening ? "bg-red-600 hover:bg-red-700" : ""}`}
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            <span>Voice Query</span>
          </>
        )}
      </Button>
      
      {isListening && transcript && (
        <div className="fixed bottom-20 right-20 p-4 bg-background/95 border rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm font-medium">Listening...</span>
          </div>
          <p className="text-sm">{transcript}</p>
        </div>
      )}
    </>
  );
};

export default VoiceCommandButton;
