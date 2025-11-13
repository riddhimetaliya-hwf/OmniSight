import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; 
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CopilotBody from './components/CopilotBody';
import CopilotSuggestions from './components/CopilotSuggestions';
import CopilotActions from './components/CopilotActions';
import CopilotSettings from './components/CopilotSettings';
import EnhancedVoiceIntegration from './components/EnhancedVoiceIntegration';
import SmartContextPanel from './components/SmartContextPanel';
import { useCopilotContext } from './context/CopilotContext';
import { 
  Minimize2, 
  Maximize2, 
  ChevronUp, 
  MessageSquare,
  Mic,
  Brain,
  Settings,
  Sparkles,
  MicIcon
} from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CopilotView } from './components/TabList';
import { VoiceCommand, VoiceSettings, ConversationContext } from './types';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const ExecCopilot: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeView, setActiveView] = useState<CopilotView>('chat');
  const { isLoading } = useCopilotContext();

  // Enhanced state for voice-first design
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    wakeWordEnabled: true,
    wakeWord: 'Hey Copilot',
    language: 'en-US',
    voiceBiometricsEnabled: false,
    ambientListening: true,
    voiceThreshold: 0.5
  });

  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    sessionId: `session-${Date.now()}`,
    history: [],
    userPreferences: {},
    businessContext: {
      quarter: 'Q4 2024',
      role: 'CEO',
      priorities: ['Revenue Growth', 'Risk Management', 'Market Expansion']
    },
    currentFocus: ['Performance Analysis', 'Strategic Planning']
  });

  const [showSettings, setShowSettings] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleMinimize = () => setIsMinimized(!isMinimized);

  const handleVoiceCommand = (command: VoiceCommand) => {
    console.log('Voice command executed:', command);
  };

  const handleVoiceSettingsChange = (settings: VoiceSettings) => {
    setVoiceSettings(settings);
  };

  const handleContextUpdate = (context: Partial<ConversationContext>) => {
    setConversationContext(prev => ({ ...prev, ...context }));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] transition-all duration-300 ease-in-out" style={{
      width: isExpanded ? '900px' : '650px',
      transform: isMinimized ? 'translateY(calc(100% - 60px))' : 'none'
    }}>
      <TooltipProvider>
        <Card className="shadow-2xl border-2 border-primary/20 overflow-hidden rounded-2xl glass-effect">
          <div 
            className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-primary/10 to-secondary/10 cursor-pointer backdrop-blur-xl"
            onClick={toggleMinimize}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                {voiceSettings.ambientListening && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg">
                    <MicIcon className="h-2.5 w-2.5 text-white m-0.5" />
                  </div>
                )}
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Executive Copilot AI
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className="text-xs px-2 py-0.5 bg-primary/15 text-primary">
                    Enhanced AI
                  </Badge>
                  {voiceSettings.wakeWordEnabled && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-600">
                      "{voiceSettings.wakeWord}"
                    </Badge>
                  )}
                  {voiceSettings.ambientListening && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 animate-pulse">
                      Listening
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); setShowSettings(true); }} className="h-8 w-8">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleExpand(); }} className="h-8 w-8">
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              
              <ChevronUp className={`h-4 w-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
            </div>
          </div>
          
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogContent className="max-w-lg">
              <CopilotSettings />
            </DialogContent>
          </Dialog>
          <div className="flex flex-col transition-all" style={{
            height: isExpanded ? '800px' : '650px'
          }}>
            {activeView === 'chat' && (
              <>
                <CopilotBody isExpanded={isExpanded} />
                <div className="border-t p-4 space-y-3 bg-background/50 backdrop-blur-sm">
                  <CopilotSuggestions />
                  <CopilotActions />
                </div>
              </>
            )}

            {activeView === 'voice' && (
              <div className="p-4 overflow-y-auto">
                <EnhancedVoiceIntegration
                  onVoiceCommand={handleVoiceCommand}
                  onSettingsChange={handleVoiceSettingsChange}
                />
              </div>
            )}

            {activeView === 'context' && (
              <div className="p-4 overflow-y-auto">
                <SmartContextPanel
                  context={conversationContext}
                  onContextUpdate={handleContextUpdate}
                />
              </div>
            )}
          </div>
        </Card>
      </TooltipProvider>
    </div>
  );
};

export default ExecCopilot;
