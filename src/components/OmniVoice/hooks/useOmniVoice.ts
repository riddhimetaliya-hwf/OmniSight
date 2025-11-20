
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useOmniPromptBar } from '../context/OmniVoiceContext';

export function useOmniVoice() {
  const [transcript, setTranscript] = useState('');
  const [isWakeWordDetected, setIsWakeWordDetected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Reference to Web Speech API
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize Web Speech API
  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition. Try using Chrome.",
        variant: "destructive",
      });
      return;
    }

    // Set up speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    // Set up speech synthesis
    speechSynthesisRef.current = window.speechSynthesis;
    
    // Clean up
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current && utteranceRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, [toast]);

  // Start listening for wake word
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.start();
      
      recognitionRef.current.onstart = () => {
        setTranscript('');
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        
        // Check for wake word "Hey Omni"
        if (fullTranscript.toLowerCase().includes('hey omni')) {
          setIsWakeWordDetected(true);
          
          // Remove the wake word from transcript
          const cleanTranscript = fullTranscript.toLowerCase().replace('hey omni', '').trim();
          setTranscript(cleanTranscript);
          
          // If there's a command after the wake word, process it
          if (cleanTranscript.length > 0) {
            executeCommand(cleanTranscript);
          }
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice commands.",
            variant: "destructive",
          });
        }
      };
      
      recognitionRef.current.onend = () => {
        // Auto restart if not manually stopped
        recognitionRef.current.start();
      };
      
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  }, [toast]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsWakeWordDetected(false);
  }, []);

  // Process commands
  const executeCommand = useCallback((command: string) => {
    setIsProcessing(true);
    
    // Here we would normally send the command to an AI service
    // For now, we'll simulate some basic commands
    
    const lowerCommand = command.toLowerCase();
    
    // Simple command handling logic
    setTimeout(() => {
      let response = '';
      
      if (lowerCommand.includes('dashboard') || lowerCommand.includes('show sales')) {
        response = "Opening the sales dashboard for you.";
        navigate('/voice-dashboard');
      } else if (lowerCommand.includes('workflow') || lowerCommand.includes('create workflow')) {
        response = "Opening workflow studio.";
        navigate('/workflow-studio');
      } else if (lowerCommand.includes('report') || lowerCommand.includes('generate report')) {
        response = "Opening report generator.";
        navigate('/reports');
      } else if (lowerCommand.includes('alert') || lowerCommand.includes('show alerts')) {
        response = "Showing recent alerts.";
        navigate('/alerts');
      } else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
        response = "I can help you navigate the system, show dashboards, create workflows, generate reports, and more. Just say 'Hey Omni' followed by your request.";
      } else {
        response = "I'm not sure how to help with that yet. Try asking for a dashboard, workflow, or report.";
      }
      
      setLastResponse(response);
      setIsProcessing(false);
      
      // Speak the response if speech synthesis is enabled
      speakResponse(response);
      
      // Reset after a delay
      setTimeout(() => {
        setTranscript('');
        setIsWakeWordDetected(false);
      }, 5000);
      
    }, 1500);
  }, [navigate]);

  // Speech synthesis
  const speakResponse = useCallback((text: string) => {
    if (!speechSynthesisRef.current || !isSpeaking) return;
    
    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();
    
    // Create new utterance
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.rate = 1.0;
    utteranceRef.current.pitch = 1.0;
    
    // Get voices and set a good one if available
    const voices = speechSynthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || voice.name.includes('Female') || voice.name.includes('Samantha')
    );
    
    if (preferredVoice) {
      utteranceRef.current.voice = preferredVoice;
    }
    
    // Speak
    speechSynthesisRef.current.speak(utteranceRef.current);
  }, [isSpeaking]);

  // Toggle mute for speech synthesis
  const toggleMute = useCallback(() => {
    setIsSpeaking(prev => !prev);
    
    if (isSpeaking && speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
  }, [isSpeaking]);

  return {
    transcript,
    isWakeWordDetected,
    startListening,
    stopListening,
    executeCommand,
    isProcessing,
    lastResponse,
    isSpeaking,
    toggleMute
  };
}
