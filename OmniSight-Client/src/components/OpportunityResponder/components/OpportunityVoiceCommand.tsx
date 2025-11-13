
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOpportunity } from "../context/OpportunityContext";
import { Mic, MicOff, Send, CornerDownLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OpportunityVoiceCommand: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [command, setCommand] = useState("");
  const { createTaskFromVoice } = useOpportunity();
  const { toast } = useToast();

  const handleStartRecording = () => {
    // In a real app, this would trigger voice recognition
    setIsRecording(true);
    
    toast({
      title: "Voice recognition active",
      description: "Speak your command clearly...",
    });
    
    // Simulate voice recognition after a delay
    setTimeout(() => {
      setIsRecording(false);
      
      // Example recognized text
      const recognizedText = "Create task for IT to investigate latency in Region A servers";
      setCommand(recognizedText);
      
      toast({
        title: "Voice recognition complete",
        description: "Review and send your command",
      });
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Voice recognition stopped",
      description: "Edit your command manually if needed",
    });
  };

  const handleSendCommand = () => {
    if (!command.trim()) {
      toast({
        title: "Command required",
        description: "Please enter a command or use voice recognition",
        variant: "destructive",
      });
      return;
    }

    const newOpportunity = createTaskFromVoice(command);
    
    toast({
      title: "Task created",
      description: "New task created from voice command",
    });
    
    setCommand("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCommand();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Voice Command</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use your voice or type a command to create a new task or trigger an action
          </p>
          
          <div className="relative">
            <Textarea
              placeholder="Example: Create task for IT to investigate latency in Region A"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="pr-10 resize-none"
              rows={3}
              onKeyDown={handleKeyDown}
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 bottom-2 h-7 w-7 p-0"
              onClick={handleSendCommand}
              disabled={!command.trim() || isRecording}
            >
              <CornerDownLeft className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4 text-red-500" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Voice Command
                </>
              )}
            </Button>
            
            <Button 
              size="sm"
              disabled={!command.trim() || isRecording}
              onClick={handleSendCommand}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Send Command
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>Try saying:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Create task for IT to investigate network issues</li>
              <li>Notify HR about onboarding delays</li>
              <li>Escalate client support tickets in Region B</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityVoiceCommand;
