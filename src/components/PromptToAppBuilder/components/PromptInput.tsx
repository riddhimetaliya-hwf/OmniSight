
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, MicOff, ChevronLeft, ChevronRight, Code, Layout } from 'lucide-react';
import { usePromptToApp } from '../context/PromptToAppContext';
import { useAppGenerator } from '../hooks/useAppGenerator';
import { useToast } from '@/hooks/use-toast';

interface PromptInputProps {
  onToggleSidebar: () => void;
  isOpen: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onToggleSidebar, isOpen }) => {
  const { prompt, setPrompt, isRecording, setIsRecording, showCode, setShowCode } = usePromptToApp();
  const { generateApp } = useAppGenerator();
  const { toast } = useToast();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    generateApp(prompt);
  };

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      toast({
        title: "Voice recording started",
        description: "Speak clearly to create your app",
      });
      
      // Simulate voice recognition after a short delay
      setTimeout(() => {
        const suggestions = [
          "Create a CRM-style interface that shows all customer details and lets me update status",
          "Build a leave request form for HR with manager approval flow",
          "Create a sales dashboard showing regional performance"
        ];
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        setPrompt(randomSuggestion);
        stopRecording();
      }, 3000);
    } catch (error) {
      console.error("Microphone access error:", error);
      toast({
        title: "Microphone access denied",
        description: "Please enable microphone access to use voice input",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Voice recording stopped",
      description: "Processing your app request...",
    });
  };
  
  const toggleCodeView = () => {
    setShowCode(!showCode);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium">Create with natural language</h2>
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Describe the app you want to create
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <div 
          className={`relative rounded-md border ${isFocused ? 'ring-2 ring-ring ring-offset-1' : ''}`}
        >
          <Textarea
            placeholder="E.g., Create a CRM-style interface for customer management"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24 resize-none pr-20"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isRecording}
          />
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "default" : "outline"}
              onClick={toggleVoiceRecording}
              className={isRecording ? "text-white bg-red-500 animate-pulse hover:bg-red-600" : ""}
              aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button 
              type="submit" 
              size="icon" 
              disabled={!prompt.trim() || isRecording}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
      
      <div className="flex space-x-2">
        <Button
          onClick={toggleVoiceRecording}
          variant={isRecording ? "destructive" : "default"}
          className={`flex-1 flex items-center justify-center gap-2 ${isRecording ? "animate-pulse" : ""}`}
        >
          {isRecording ? (
            <>
              <MicOff className="h-5 w-5" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              Use Voice Input
            </>
          )}
        </Button>
        
        <Button
          onClick={toggleCodeView}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          {showCode ? (
            <>
              <Layout className="h-5 w-5" />
              View Preview
            </>
          ) : (
            <>
              <Code className="h-5 w-5" />
              View Code
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PromptInput;
