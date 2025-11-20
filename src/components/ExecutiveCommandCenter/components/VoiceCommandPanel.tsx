
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  Zap,
  MessageSquare,
  Activity,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Command,
  RotateCcw
} from 'lucide-react';
import { ExecutiveRole } from '@/types/executive-roles';
import { useToast } from '@/hooks/use-toast';
import { voiceCommandService, VoiceCommand } from '@/services/voiceCommandService';

interface VoiceCommandPanelProps {
  role: ExecutiveRole;
  onRoleSwitch?: (newRole: ExecutiveRole) => void;
}

const VoiceCommandPanel: React.FC<VoiceCommandPanelProps> = ({ role, onRoleSwitch }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isSupported, setIsSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [timeoutCountdown, setTimeoutCountdown] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Get voice commands from service
  const voiceCommands = voiceCommandService.getRoleSpecificCommands();

  // Process voice command - now using a ref to avoid stale closures
  const processVoiceCommand = useCallback((command: string) => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Use the voice command service to process the command (now synchronous)
      const result = voiceCommandService.processCommand(command, role);
      
      setCommandHistory(prev => [command, ...prev.slice(0, 4)]);
      
      if (result.success) {
        toast({
          title: "Voice Command Executed",
          description: result.message,
        });
        
        // Handle role switching
        if (result.action === 'role_switch' && result.data?.targetRole) {
          // This would typically trigger a role change in the parent component
          console.log(`Switching to ${result.data.targetRole} view`);
          // Call the callback if provided
          if (onRoleSwitch && result.data.targetRole) {
            onRoleSwitch(result.data.targetRole as ExecutiveRole);
          }
        }
      } else {
        toast({
          title: "Command Not Recognized",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast({
        title: "Command Error",
        description: "An error occurred while processing the command. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setTranscript('');
      finalTranscriptRef.current = '';
    }
  }, [role, toast, onRoleSwitch]);

  // Start timeout for command execution
  const startCommandTimeout = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Clear any existing countdown
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    // Set countdown to 5 seconds
    setTimeoutCountdown(5);
    
    // Start countdown timer
    countdownRef.current = setInterval(() => {
      setTimeoutCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Set new timeout for 5 seconds
    timeoutRef.current = setTimeout(() => {
      if (finalTranscriptRef.current && finalTranscriptRef.current.trim()) {
        console.log('Executing command after 5 seconds of silence:', finalTranscriptRef.current);
        processVoiceCommand(finalTranscriptRef.current);
      }
    }, 5000);
  }, [processVoiceCommand]);

  // Clear timeout
  const clearCommandTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setTimeoutCountdown(0);
  }, []);

  // Initialize speech recognition - fixed dependency array
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please use Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setConfidence(0);
      finalTranscriptRef.current = '';
      toast({
        title: "Voice Recognition Active",
        description: "Listening for voice commands...",
      });
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
        
        maxConfidence = Math.max(maxConfidence, confidence);
      }

      // Update the ref for final transcript
      if (finalTranscript) {
        finalTranscriptRef.current = finalTranscript;
        // Clear timeout when user speaks
        clearCommandTimeout();
      }

      setTranscript(finalTranscript || interimTranscript);
      setConfidence(maxConfidence * 100);

      // Start timeout when there's interim speech (user is speaking)
      if (interimTranscript && !finalTranscript) {
        startCommandTimeout();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      // Don't show toast for expected errors like 'aborted' during cleanup
      if (event.error !== 'aborted') {
        let errorMessage = `Error: ${event.error}`;
        
        // Provide more helpful error messages
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking more clearly.';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture failed. Please check your microphone permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = `Voice recognition error: ${event.error}`;
        }
        
        toast({
          title: "Voice Recognition Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Clear any pending timeout
      clearCommandTimeout();
      // Use the ref to get the most current final transcript
      if (finalTranscriptRef.current) {
        processVoiceCommand(finalTranscriptRef.current);
      }
    };

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch (error) {
          // Ignore errors during cleanup
          console.log('Cleanup: Speech recognition already stopped');
        }
      }
      // Clear timeout on cleanup
      clearCommandTimeout();
    };
  }, [processVoiceCommand, toast, startCommandTimeout, clearCommandTimeout]);

  // Toggle listening with better error handling
  const toggleListening = () => {
    if (!isSupported) return;
    
    const recognition = recognitionRef.current;
    if (!recognition) return;
    
    try {
      if (isListening) {
        recognition.stop();
      } else {
        // Reset transcript before starting
        setTranscript('');
        setConfidence(0);
        finalTranscriptRef.current = '';
        recognition.start();
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error);
      setIsListening(false);
      toast({
        title: "Voice Recognition Error",
        description: "Failed to start/stop voice recognition. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Stop listening function
  const stopListening = () => {
    if (!isSupported) return;
    
    const recognition = recognitionRef.current;
    if (!recognition) return;
    
    try {
      if (isListening) {
        recognition.stop();
        toast({
          title: "Voice Recognition Stopped",
          description: "Voice listening has been stopped.",
        });
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      setIsListening(false);
    }
  };

  // Simulate voice command for testing - now uses the same processVoiceCommand function
  const simulateVoiceCommand = (command: VoiceCommand) => {
    setTranscript(command.phrase);
    processVoiceCommand(command.phrase);
  };

  // Get category styling
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'data': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'analysis': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'control': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  // Audio level animation
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);

  // Listen for stop voice listening command
  useEffect(() => {
    const handleStopVoiceListening = () => {
      stopListening();
    };

    window.addEventListener('stopVoiceListening', handleStopVoiceListening);

    return () => {
      window.removeEventListener('stopVoiceListening', handleStopVoiceListening);
    };
  }, []);

  if (!isSupported) {
    return (
      <Card className="glass-effect border-white/10">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Voice Recognition Not Available</h3>
          <p className="text-muted-foreground">
            Please use Chrome or Edge browser for voice command functionality.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-white/10 overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg"></div>
              <div className="relative p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10">
                <Mic className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Voice Command Center
                {isListening && <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Hands-free executive control</p>
            </div>
          </div>
         
          <Badge className={`${
            isListening 
              ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-600 border-red-500/30 animate-pulse' 
              : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 border-green-500/30'
          }`}>
            <div className={`h-2 w-2 rounded-full mr-2 ${
              isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'
            }`}></div>
            {isListening ? 'Listening' : 'Ready'}            
          </Badge>
          
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Voice Control Interface */}
        <div className="flex items-center justify-center py-4 relative">
          <div className="relative">
            <Button
              onClick={isListening ? stopListening : toggleListening}
              size="lg"
              disabled={!isSupported}
              className={`w-28 h-28 rounded-full transition-all duration-300 relative ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/25 animate-voice-pulse' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 animate-voice-glow'
              }`}
            >
              {isListening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
            </Button>
            
            {/* Audio level rings */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-voice-wave"></div>
                <div className="absolute inset-0 rounded-full border-2 border-purple-500/50 animate-voice-pulse" 
                     style={{ transform: `scale(${1 + audioLevel / 100})` }}></div>
              </>
            )}
          </div>

          
        </div>

        {/* Voice Feedback */}
        {(transcript || isListening) && (
          <div className="space-y-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-white/10">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Voice Input</span>
              {isProcessing && <Activity className="h-4 w-4 animate-spin text-purple-500" />}
              {!isProcessing && transcript && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            
            {transcript && (
              <p className="text-lg font-medium text-foreground">"{transcript}"</p>
            )}
            
            {isListening && !transcript && (
              <div className="space-y-2">
                <p className="text-muted-foreground animate-pulse">Listening for commands...</p>
                <p className="text-xs text-muted-foreground">Say "Stop listening" to stop voice recognition</p>
              </div>
            )}
            
            {/* Countdown indicator */}
            {timeoutCountdown > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-orange-600 font-medium">
                    Executing in {timeoutCountdown} seconds...
                  </span>
                </div>
                <Progress value={(5 - timeoutCountdown) * 20} className="h-1" />
              </div>
            )}
            
            {confidence > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Confidence</span>
                  <span>{Math.round(confidence)}%</span>
                </div>
                <Progress value={confidence} className="h-2" />
              </div>
            )}
          </div>
        )}

        {/* Command History */}
        {commandHistory.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Recent Commands
            </h4>
            <div className="space-y-2">
              {commandHistory.map((cmd, index) => (
                <div key={index} className="p-2 rounded-lg bg-white/5 border border-white/10 text-sm">
                  "{cmd}"
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Commands */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Command className="h-4 w-4" />
            Quick Voice Commands
          </h4>
          
          {/* Control Commands Section */}
          <div className="space-y-3">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Control</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {voiceCommands.filter(cmd => cmd.category === 'control').map((command) => (
                <Button
                  key={command.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => simulateVoiceCommand(command)}
                  className="justify-start p-3 h-auto hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 hover:scale-102 hover:shadow-md transition-all duration-300 group border border-transparent hover:border-red-500/20"
                >
                  <div className="text-left space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <Badge 
                        size="sm" 
                        className={`capitalize ${getCategoryColor(command.category)}`}
                      >
                        {command.category}
                      </Badge>
                      <Zap className="h-3 w-3 text-muted-foreground group-hover:text-red-500 transition-colors" />
                    </div>
                    <p className="text-sm font-medium">"{command.phrase}"</p>
                    <p className="text-xs text-muted-foreground">{command.action}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation Commands Section */}
          <div className="space-y-3">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Navigation</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {voiceCommands.filter(cmd => cmd.category === 'navigation').slice(0, 6).map((command) => (
                <Button
                  key={command.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => simulateVoiceCommand(command)}
                  className="justify-start p-3 h-auto hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:scale-102 hover:shadow-md transition-all duration-300 group border border-transparent hover:border-blue-500/20"
                >
                  <div className="text-left space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <Badge 
                        size="sm" 
                        className={`capitalize ${getCategoryColor(command.category)}`}
                      >
                        {command.category}
                      </Badge>
                      <Zap className="h-3 w-3 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                    </div>
                    <p className="text-sm font-medium">"{command.phrase}"</p>
                    <p className="text-xs text-muted-foreground">{command.action}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Data Commands Section */}
          <div className="space-y-3">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Data & Analysis</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {voiceCommands.filter(cmd => cmd.category === 'data' || cmd.category === 'analysis').slice(0, 6).map((command) => (
                <Button
                  key={command.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => simulateVoiceCommand(command)}
                  className="justify-start p-3 h-auto hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 hover:scale-102 hover:shadow-md transition-all duration-300 group border border-transparent hover:border-green-500/20"
                >
                  <div className="text-left space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <Badge 
                        size="sm" 
                        className={`capitalize ${getCategoryColor(command.category)}`}
                      >
                        {command.category}
                      </Badge>
                      <Zap className="h-3 w-3 text-muted-foreground group-hover:text-green-500 transition-colors" />
                    </div>
                    <p className="text-sm font-medium">"{command.phrase}"</p>
                    <p className="text-xs text-muted-foreground">{command.action}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default VoiceCommandPanel;