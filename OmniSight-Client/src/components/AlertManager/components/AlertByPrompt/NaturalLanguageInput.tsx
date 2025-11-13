
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, ArrowRight, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AlertExamples from './AlertExamples';

interface NaturalLanguageInputProps {
  initialPrompt: string;
  onSubmit: (prompt: string) => void;
}

const NaturalLanguageInput: React.FC<NaturalLanguageInputProps> = ({ 
  initialPrompt,
  onSubmit 
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter or speak your alert condition",
        variant: "destructive"
      });
      return;
    }
    onSubmit(prompt);
  };

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Processing your command...",
      });
      
      // Simulate voice processing delay
      setTimeout(() => {
        // Don't overwrite existing text if there's already input
        if (!prompt.trim()) {
          const simulatedCommands = [
            "Alert me if revenue drops below $100K for 3 consecutive days",
            "Notify sales manager if any lead hasn't been contacted in 7 days",
            "Send alert if system uptime falls below 98%"
          ];
          setPrompt(simulatedCommands[Math.floor(Math.random() * simulatedCommands.length)]);
        }
      }, 1500);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecording(true);
        toast({
          title: "Voice recording started",
          description: "Speak your alert condition clearly",
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Create Alert with Natural Language
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Describe the condition when you want to be alerted using plain language
          </p>
          
          <div className="relative">
            <Textarea
              placeholder="Example: Alert me if revenue drops below $100K for 3 consecutive days"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] pr-10"
              disabled={isRecording}
            />
            <Button
              size="icon"
              variant={isRecording ? "default" : "ghost"}
              className={`absolute right-2 top-2 ${isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : ""}`}
              onClick={toggleVoiceRecording}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <AlertExamples onSelectExample={(example) => setPrompt(example)} />
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSubmit} disabled={!prompt.trim()} className="gap-2">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NaturalLanguageInput;
