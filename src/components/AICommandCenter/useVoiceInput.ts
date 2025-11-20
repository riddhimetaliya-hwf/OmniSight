
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useVoiceInput(onInputReceived: (input: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Processing your query...",
      });
      
      // Simulate processing voice to text
      setTimeout(() => {
        onInputReceived("What are the sales figures for Q1?");
      }, 1000);
    } else {
      // Request microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          toast({
            title: "Listening...",
            description: "Speak your query clearly",
          });
        })
        .catch(() => {
          toast({
            title: "Microphone access denied",
            description: "Please enable microphone access to use voice input",
            variant: "destructive",
          });
        });
    }
  };

  return {
    isRecording,
    toggleRecording
  };
}
