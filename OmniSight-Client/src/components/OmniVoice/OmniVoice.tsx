
import React, { useState, useEffect, useCallback } from 'react';
import { useUserPrefs } from '@/components/UserPrefs';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Card } from '@/components/ui/card';
import VoiceCommandsList from './components/VoiceCommandsList';
import VoiceCommandPanel from './components/VoiceCommandPanel';
import { useOmniVoice } from './hooks/useOmniVoice';
import { Button } from '@/components/ui/button';
import VoiceTranscript from './components/VoiceTranscript';

const OmniVoice: React.FC = () => {
  const { preferences } = useUserPrefs();
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const { toast } = useToast();

  const isVoiceEnabledInPrefs = preferences?.voiceAssistant?.enabled ?? false;
  
  const {
    transcript,
    isWakeWordDetected,
    startListening,
    stopListening,
    executeCommand,
    isProcessing,
    lastResponse,
    isSpeaking,
    toggleMute
  } = useOmniVoice();

  useEffect(() => {
    // Only auto-enable voice if it's enabled in user preferences
    if (isVoiceEnabledInPrefs && !isActive) {
      setIsActive(true);
    }
  }, [isVoiceEnabledInPrefs, isActive]);

  const handleWakeWordDetection = useCallback(() => {
    if (isWakeWordDetected && !isListening) {
      setIsListening(true);
      setIsMinimized(false);
      toast({
        title: "Hey Omni detected!",
        description: "I'm listening. What can I help you with?",
      });
    }
  }, [isWakeWordDetected, isListening, toast]);

  useEffect(() => {
    handleWakeWordDetection();
  }, [isWakeWordDetected, handleWakeWordDetection]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsMinimized(false);
      setIsListening(true);
    }
  }, [isListening, startListening, stopListening]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // If voice isn't enabled in preferences, don't render
  if (!isVoiceEnabledInPrefs && !isActive) {
    return null;
  }

  return (
    <>
      {/* Floating Mic Button */}
      <Button
        onClick={toggleMinimize}
        size="icon"
        variant={isListening ? "destructive" : "secondary"}
        className={`fixed bottom-6 left-6 z-40 rounded-full shadow-lg p-3 ${
          isListening ? "animate-pulse" : ""
        }`}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </Button>

      {/* Voice Assistant Card */}
      {!isMinimized && (
        <Card className="fixed bottom-20 left-6 z-40 w-96 shadow-lg border-2 overflow-hidden">
          <div className="p-3 flex justify-between items-center border-b bg-muted/50">
            <div className="flex items-center space-x-2">
              <span className="font-medium">OmniVoice Assistant</span>
              {isProcessing && <span className="text-xs text-muted-foreground">Processing...</span>}
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" onClick={toggleMute} title={isSpeaking ? "Mute" : "Unmute"}>
                {isSpeaking ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleListening}>
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleMinimize}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-4">
            <VoiceTranscript 
              transcript={transcript} 
              response={lastResponse}
              isProcessing={isProcessing}
            />
            
            {!transcript && !lastResponse && (
              <VoiceCommandsList onSelectCommand={executeCommand} />
            )}
          </div>
        </Card>
      )}
      
      {/* Enhanced Voice Command Panel */}
      <VoiceCommandPanel />
    </>
  );
};

export default OmniVoice;
