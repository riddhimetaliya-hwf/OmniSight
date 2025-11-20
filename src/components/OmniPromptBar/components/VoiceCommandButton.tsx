
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommandButtonProps {
  onCommandReceived: (command: string) => void;
}

const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({ onCommandReceived }) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const toggleListening = async () => {
    if (isListening) {
      setIsListening(false);
      toast({
        title: "Voice input stopped",
        description: "Processing your command...",
      });
      
      // Simulate receiving a voice command after a short delay
      setTimeout(() => {
        const simulatedCommands = [
          "Show sales dashboard",
          "Export finance report",
          "What's my next meeting?"
        ];
        const randomCommand = simulatedCommands[Math.floor(Math.random() * simulatedCommands.length)];
        onCommandReceived(randomCommand);
      }, 1000);
    } else {
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak your command clearly",
        });
      } catch (error) {
        console.error("Microphone access error:", error);
        toast({
          title: "Microphone access denied",
          description: "Please enable microphone access to use voice commands",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button
      variant={isListening ? "default" : "ghost"}
      size="icon"
      onClick={toggleListening}
      className={isListening ? 'text-white bg-red-500 animate-pulse hover:bg-red-600' : ''}
      aria-label={isListening ? "Stop listening" : "Start voice command"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

export default VoiceCommandButton;
