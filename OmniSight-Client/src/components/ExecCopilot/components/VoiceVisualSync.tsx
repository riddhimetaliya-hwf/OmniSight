
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Zap, Brain, Sparkles } from 'lucide-react';

interface VoiceVisualSyncProps {
  isListening?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
}

export const VoiceVisualSync: React.FC<VoiceVisualSyncProps> = ({
  isListening = false,
  onStartListening,
  onStopListening
}) => {
  const [transcript, setTranscript] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [confidence, setConfidence] = useState(0);

  const mockTranscripts = [
    "Show me the revenue breakdown for Q4 with predictive analytics",
    "What are the top performance metrics driving our success this quarter?",
    "Schedule a strategic planning session with the leadership team",
    "Generate an executive summary report for the board presentation",
    "What are the critical alerts requiring immediate executive attention?"
  ];

  useEffect(() => {
    if (isListening) {
      // Simulate voice recognition with enhanced typing effect
      const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setIsTyping(true);
      setTranscript('');
      setConfidence(0);
      
      let i = 0;
      const typeWriter = setInterval(() => {
        if (i < randomTranscript.length) {
          setTranscript(prev => prev + randomTranscript.charAt(i));
          setConfidence(Math.min(95, 60 + (i / randomTranscript.length) * 35));
          i++;
        } else {
          clearInterval(typeWriter);
          setIsTyping(false);
          setConfidence(98);
        }
      }, 45);

      return () => clearInterval(typeWriter);
    } else {
      setTranscript('');
      setIsTyping(false);
      setConfidence(0);
    }
  }, [isListening]);

  const handleToggleListening = () => {
    if (isListening) {
      onStopListening?.();
    } else {
      onStartListening?.();
    }
  };

  return (
    <Card className={`voice-visual-sync transition-all duration-400 ${
      isListening ? 'voice-pulse border-amber-300 shadow-xl' : 'border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl transition-all duration-300 ${
            isListening 
              ? 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 shadow-lg' 
              : 'bg-gradient-to-br from-slate-100 to-gray-100 text-slate-500'
          }`}>
            <Volume2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800">Executive Voice Command</h3>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-slate-600">
                {isListening ? 'Processing your command...' : 'Ready for voice input'}
              </p>
              {isListening && confidence > 0 && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
                  {confidence.toFixed(0)}% confidence
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleListening}
          className={`transition-all duration-300 font-semibold px-4 py-2 ${
            isListening 
              ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-400 hover:from-red-600 hover:to-rose-600 shadow-lg' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Voice Command
            </>
          )}
        </Button>
      </div>

      {/* Voice Transcript Display */}
      <div className={`voice-transcript min-h-[80px] p-5 rounded-xl transition-all duration-300 ${
        transcript 
          ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-inner' 
          : 'bg-gradient-to-br from-slate-50 to-gray-50 border-2 border-slate-200'
      }`}>
        {transcript ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 text-xs">
                <Brain className="h-3 w-3 mr-1" />
                AI Processing
              </Badge>
            </div>
            <blockquote className="voice-transcript text-slate-800 font-semibold text-lg leading-relaxed border-l-4 border-amber-400 pl-4">
              "{transcript}"
              {isTyping && <span className="animate-pulse text-amber-500">|</span>}
            </blockquote>
            {!isTyping && confidence > 90 && (
              <div className="flex items-center gap-2 mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <Sparkles className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">
                  Command recognized and ready for execution
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Mic className="h-8 w-8 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-medium">
                Click "Start Voice Command" to begin executive voice interaction
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Quick Voice Commands */}
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-4 w-4 text-amber-500" />
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Quick Commands</h4>
        </div>
        <div className="flex flex-wrap gap-3">
          {['Revenue Analytics', 'Performance Metrics', 'Critical Alerts', 'Schedule Meeting'].map((command) => (
            <Button
              key={command}
              variant="outline"
              size="sm"
              className="executive-btn-secondary text-xs font-semibold px-3 py-2 bg-gradient-to-r from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 border-slate-200 hover:border-amber-300 transition-all duration-300"
            >
              {command}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};
