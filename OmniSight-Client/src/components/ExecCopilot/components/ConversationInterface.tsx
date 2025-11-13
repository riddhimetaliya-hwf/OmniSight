import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Mic,
  Send,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Users,
  FileText,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useCopilotContext } from '../context/CopilotContext';

interface ConversationInterfaceProps {
  onInsightSelect: (insightId: string) => void;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  contextualCards?: ContextualCard[];
  suggestedActions?: SuggestedAction[];
}

interface ContextualCard {
  id: string;
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  priority: 'high' | 'medium' | 'low';
}

const ConversationInterface: React.FC<ConversationInterfaceProps> = ({ onInsightSelect }) => {
  const { query, setQuery, submitQuery, isLoading } = useCopilotContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Good morning! I've prepared your executive briefing for today. Our Q4 performance is tracking 12% above target, and there are 3 strategic items that need your attention. What would you like to focus on first?",
      timestamp: new Date(),
      contextualCards: [
        {
          id: 'revenue',
          title: 'Q4 Revenue',
          value: '$2.4M',
          trend: 'up',
          icon: TrendingUp,
          color: 'text-green-600'
        },
        {
          id: 'team',
          title: 'Team Performance',
          value: '94%',
          trend: 'up',
          icon: Users,
          color: 'text-blue-600'
        },
        {
          id: 'alerts',
          title: 'Critical Alerts',
          value: '3',
          trend: 'neutral',
          icon: AlertTriangle,
          color: 'text-amber-600'
        }
      ],
      suggestedActions: [
        {
          id: 'board-prep',
          title: 'Prepare Board Presentation',
          description: 'Auto-generate slides for next week\'s board meeting',
          icon: FileText,
          priority: 'high'
        },
        {
          id: 'team-review',
          title: 'Schedule Team Reviews',
          description: 'Set up Q4 performance reviews for direct reports',
          icon: Calendar,
          priority: 'medium'
        }
      ]
    }
  ]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isWaveVisible, setIsWaveVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [statusText, setStatusText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<number | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const [transcribedText, setTranscribedText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Wave Visualization ---
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    if (ctx) ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  };

  const drawStaticWave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#00b4d8');
    gradient.addColorStop(1, '#0077b6');
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00b4d8';
    ctx.stroke();
    ctx.shadowBlur = 0;
    setIsWaveVisible(false);
  };

  const animateWave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#00b4d8');
    gradient.addColorStop(1, '#0077b6');
    let phase = Date.now() * 0.002;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        let y = height / 2;
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
          const amp = (dataArrayRef.current[x % dataArrayRef.current.length] - 128) / 128;
          y += Math.sin(x * 0.015 + phase + i) * amp * (30 - i * 10);
        } else {
          y += Math.sin(x * 0.015 + phase + i) * (30 - i * 10) * Math.sin(Date.now() * 0.002);
        }
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00b4d8';
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    animationFrameIdRef.current = requestAnimationFrame(animateWave);
    setIsWaveVisible(true);
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    drawStaticWave();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  // --- WebSocket Setup ---
  useEffect(() => {
    const socket = new WebSocket('wss://satisfactory-florinda-vivek1902-377bc968.koyeb.app/ws');
    socketRef.current = socket;
    socket.onopen = () => setStatusText('Connected');
    socket.onclose = () => setStatusText('Disconnected');
    socket.onerror = () => setStatusText('Connection Error');
    socket.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.error) {
          setStatusText(`Error: ${response.error}`);
          return;
        }
        // If user spoke, add their transcribed text as a user message
        if (response.transcribed_text) {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              type: 'user',
              content: response.transcribed_text,
              timestamp: new Date()
            }
          ]);
        }
        // If assistant replied, add as assistant message
        if (response.response_text) {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              type: 'assistant',
              content: response.response_text,
              timestamp: new Date()
            }
          ]);
        }
        // Play audio if present
        if (response.audio) {
          playAudioResponse(response.audio);
        }
      } catch (error) {
        setStatusText('Error processing response');
      }
    };
    return () => {
      socket.close();
    };
  }, []);

  // --- Audio Recording Logic ---
  const startRecording = async () => {
    setIsRecording(true);
    setStatusText('Recording...');
    setIsWaveVisible(true);
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx({ sampleRate: 16000 });
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 16000 } });
    const source = audioContextRef.current.createMediaStreamSource(stream);
    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024;
    }
    source.connect(analyserRef.current);
    dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm', audioBitsPerSecond: 128000 });
    audioChunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onload = () => {
        const base64Audio = (reader.result as string).split(',')[1];
        setStatusText('Processing...');
        if (socketRef.current && socketRef.current.readyState === 1) {
          socketRef.current.send(base64Audio);
        }
      };
      reader.readAsDataURL(audioBlob);
    };
    mediaRecorderRef.current.start(1000);
    animateWave();
  };

  const stopRecording = () => {
    setIsRecording(false);
    setStatusText('');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    drawStaticWave();
    setIsWaveVisible(false);
  };

  // --- Play Audio Response ---
  const playAudioResponse = async (base64Audio: string) => {
    setIsWaveVisible(true);
    try {
      const binaryString = window.atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      animateWave();
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        drawStaticWave();
        setIsWaveVisible(false);
      };
      await audio.play();
    } catch (error) {
      drawStaticWave();
    }
  };

  // --- Button Handlers ---
  const handleVoiceButtonDown = () => {
    setIsVoiceActive(true);
    startRecording();
  };
  const handleVoiceButtonUp = () => {
    setIsVoiceActive(false);
    stopRecording();
  };

  const handleSendMessage = async () => {
    if (!query.trim()) return;
    // Add user message to chat
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        content: query,
        timestamp: new Date()
      }
    ]);
    // Send to backend as JSON
    if (socketRef.current && socketRef.current.readyState === 1) {
      socketRef.current.send(JSON.stringify({ text: query }));
    }
    setQuery('');
  };

  const generateContextualResponse = (userQuery: string): string => {
    if (userQuery.toLowerCase().includes('performance')) {
      return "Based on our latest data, here's your performance overview: Revenue is up 12% QoQ, team productivity has increased by 8%, and customer satisfaction is at 94%. I've identified 2 key areas for optimization.";
    }
    if (userQuery.toLowerCase().includes('team')) {
      return "Your team performance metrics show strong results across all departments. Sales exceeded targets by 15%, Marketing delivered 23% more qualified leads, and Engineering reduced deployment time by 30%. Shall I prepare individual performance summaries?";
    }
    return "I've analyzed your request and gathered relevant insights from across your business systems. Here's what I found:";
  };

  const generateContextualCards = (userQuery: string): ContextualCard[] => {
    if (userQuery.toLowerCase().includes('performance')) {
      return [
        { id: 'revenue', title: 'Revenue Growth', value: '+12%', trend: 'up', icon: TrendingUp, color: 'text-green-600' },
        { id: 'productivity', title: 'Team Productivity', value: '+8%', trend: 'up', icon: Users, color: 'text-blue-600' },
        { id: 'satisfaction', title: 'Customer Satisfaction', value: '94%', trend: 'up', icon: Users, color: 'text-purple-600' }
      ];
    }
    return [];
  };

  const generateSuggestedActions = (userQuery: string): SuggestedAction[] => {
    if (userQuery.toLowerCase().includes('team')) {
      return [
        {
          id: 'review-schedule',
          title: 'Schedule Performance Reviews',
          description: 'Set up 1-on-1s with all direct reports',
          icon: Calendar,
          priority: 'high'
        },
        {
          id: 'recognition',
          title: 'Send Team Recognition',
          description: 'Acknowledge top performers publicly',
          icon: Users,
          priority: 'medium'
        }
      ];
    }
    return [];
  };

  const smartPrompts = [
    "What's my team's performance this quarter?",
    "Prepare my board presentation",
    "Show me critical alerts",
    "Schedule team reviews"
  ];

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Status/Transcription */}
      {statusText && <div className="text-center text-xs text-slate-500 pb-1">{statusText}</div>}
      {transcribedText && <div className="text-center text-xs text-blue-600 pb-1">{transcribedText}</div>}
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        {messages.map((message, idx) => {
          // Only show wave for latest assistant message and if wave is visible
          const isLatestAssistant = message.type === 'assistant' &&
            messages.slice(idx + 1).findIndex(m => m.type === 'assistant') === -1;
          return (
            <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'assistant' && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-2xl ${message.type === 'user' ? 'ml-12' : 'mr-12'}`}> 
                <Card className={`${message.type === 'user' ? 'bg-blue-50 border-blue-200' : 'glass-enhanced'}`}> 
                  <CardContent className="p-4"> 
                    {/* Wave Visualization Canvas (only for latest assistant message and when wave is visible) */}
                    {isLatestAssistant && isWaveVisible && (
                      <div className="w-full flex justify-center items-center py-2">
                        <canvas ref={canvasRef} style={{ width: 320, height: 60, borderRadius: 8, background: '#f8fafc', boxShadow: '0 2px 8px #e0e7ef' }} width={320} height={60}></canvas>
                      </div>
                    )}
                    <p className="text-sm text-slate-700 leading-relaxed">{message.content}</p>
                    {/* Contextual Cards */}
                    {message.contextualCards && message.contextualCards.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {message.contextualCards.map((card) => (
                          <Card key={card.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onInsightSelect(card.id)}>
                            <div className="flex items-center gap-2">
                              <card.icon className={`h-4 w-4 ${card.color}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-600 truncate">{card.title}</p>
                                <p className="font-semibold text-sm">{card.value}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                    {/* Suggested Actions */}
                    {message.suggestedActions && message.suggestedActions.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <p className="text-xs font-medium text-slate-600 mb-2">Suggested Actions:</p>
                        {message.suggestedActions.map((action) => (
                          <Button key={action.id} variant="outline" size="sm" className="w-full justify-start gap-2 h-auto p-3">
                            <action.icon className="h-4 w-4" />
                            <div className="text-left flex-1">
                              <p className="font-medium text-xs">{action.title}</p>
                              <p className="text-xs text-slate-500">{action.description}</p>
                            </div>
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.type === 'user' && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-slate-600 text-white text-xs">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex gap-4">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </AvatarFallback>
            </Avatar>
            <Card className="glass-enhanced max-w-xs">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-xs text-slate-600 ml-2">AI is thinking...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200/50 bg-white/90 backdrop-blur-xl">
        {/* Smart Prompts */}
        <div className="p-4 pb-2">
          <div className="flex gap-2 flex-wrap">
            {smartPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7 bg-slate-50 hover:bg-slate-100"
                onClick={() => setQuery(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 pt-2">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Textarea
                placeholder="Ask me anything about your business performance, schedule meetings, or get strategic insights..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[60px] resize-none border-slate-200 focus:border-blue-300"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onMouseDown={handleVoiceButtonDown}
                onMouseUp={handleVoiceButtonUp}
                onMouseLeave={handleVoiceButtonUp}
                className={`p-3 ${isVoiceActive ? 'bg-red-50 border-red-200 text-red-600' : 'border-slate-200'}`}
              >
                <Mic className={`h-4 w-4 ${isVoiceActive ? 'animate-pulse' : ''}`} />
              </Button>
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!query.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationInterface;
