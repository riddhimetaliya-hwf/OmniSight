
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Settings,
  Shield,
  Globe,
  Zap,
  Activity,
  Waves
} from 'lucide-react';
import { VoiceSettings, VoiceCommand } from '../types';

interface EnhancedVoiceIntegrationProps {
  onVoiceCommand: (command: VoiceCommand) => void;
  onSettingsChange: (settings: VoiceSettings) => void;
}

const EnhancedVoiceIntegration: React.FC<EnhancedVoiceIntegrationProps> = ({
  onVoiceCommand,
  onSettingsChange
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    wakeWordEnabled: false,
    wakeWord: 'Hey Copilot',
    language: 'en-US',
    voiceBiometricsEnabled: false,
    ambientListening: false,
    voiceThreshold: 0.5
  });

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'zh-CN', name: 'Chinese (Mandarin)' }
  ];

  const voiceCommands: VoiceCommand[] = [
    { id: '1', phrase: 'Show me the dashboard', action: 'Navigate to dashboard', category: 'navigation', language: 'en-US', confidence: 0.95 },
    { id: '2', phrase: 'Analyze quarterly performance', action: 'Generate Q4 analysis', category: 'analysis', language: 'en-US', confidence: 0.92 },
    { id: '3', phrase: 'Create weekly briefing', action: 'Generate briefing', category: 'control', language: 'en-US', confidence: 0.98 },
    { id: '4', phrase: 'What are my top risks?', action: 'Show risk analysis', category: 'query', language: 'en-US', confidence: 0.89 },
    { id: '5', phrase: 'Compare with competitors', action: 'Competitive analysis', category: 'analysis', language: 'en-US', confidence: 0.93 }
  ];

  // Simulate voice level detection
  useEffect(() => {
    if (isListening || voiceSettings.ambientListening) {
      const interval = setInterval(() => {
        setVoiceLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setVoiceLevel(0);
    }
  }, [isListening, voiceSettings.ambientListening]);

  // Simulate wake word detection
  useEffect(() => {
    if (voiceSettings.wakeWordEnabled && voiceSettings.ambientListening) {
      const interval = setInterval(() => {
        if (Math.random() > 0.98) { // 2% chance of wake word detection
          setIsWakeWordActive(true);
          setTimeout(() => setIsWakeWordActive(false), 3000);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [voiceSettings.wakeWordEnabled, voiceSettings.ambientListening]);

  const toggleListening = useCallback(() => {
    setIsListening(!isListening);
  }, [isListening]);

  const executeVoiceCommand = useCallback((command: VoiceCommand) => {
    onVoiceCommand(command);
    setIsListening(false);
  }, [onVoiceCommand]);

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    const updated = { ...voiceSettings, ...newSettings };
    setVoiceSettings(updated);
    onSettingsChange(updated);
  }, [voiceSettings, onSettingsChange]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'analysis': return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      case 'control': return 'bg-orange-500/10 text-orange-600 border-orange-500/30';
      case 'query': return 'bg-green-500/10 text-green-600 border-green-500/30';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Control Interface */}
      <Card className="glass-effect border-white/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <Mic className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Enhanced Voice Control</CardTitle>
                <p className="text-sm text-muted-foreground">Advanced AI-powered voice commands</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isWakeWordActive && (
                <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 border-green-500/30 animate-pulse">
                  Wake Word Detected
                </Badge>
              )}
              <Badge className={`${
                isListening ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-600 border-red-500/30' :
                voiceSettings.ambientListening ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 border-blue-500/30' :
                'bg-muted/50 text-muted-foreground border-border'
              }`}>
                {isListening ? 'Listening' : voiceSettings.ambientListening ? 'Ambient' : 'Ready'}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Voice Activation Button */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <Button
                onClick={toggleListening}
                size="lg"
                className={`w-20 h-20 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/25 animate-pulse' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25 hover:shadow-xl'
                }`}
              >
                {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </Button>
              {(isListening || voiceSettings.ambientListening) && (
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping"></div>
              )}
            </div>
          </div>

          {/* Voice Level Indicator */}
          {(isListening || voiceSettings.ambientListening) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Waves className="h-4 w-4" />
                  Voice Level
                </span>
                <span>{Math.round(voiceLevel)}%</span>
              </div>
              <Progress value={voiceLevel} className="h-2" />
            </div>
          )}

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Language
            </label>
            <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Voice Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Wake Word Detection</span>
            </div>
            <Switch
              checked={voiceSettings.wakeWordEnabled}
              onCheckedChange={(checked) => updateSettings({ wakeWordEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Ambient Listening</span>
            </div>
            <Switch
              checked={voiceSettings.ambientListening}
              onCheckedChange={(checked) => updateSettings({ ambientListening: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm">Voice Biometrics</span>
            </div>
            <Switch
              checked={voiceSettings.voiceBiometricsEnabled}
              onCheckedChange={(checked) => updateSettings({ voiceBiometricsEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Voice Commands Library */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle>Voice Commands Library</CardTitle>
          <p className="text-sm text-muted-foreground">Available voice commands for {currentLanguage}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {voiceCommands.map((command) => (
              <Button
                key={command.id}
                variant="ghost"
                size="sm"
                onClick={() => executeVoiceCommand(command)}
                className="justify-start p-3 h-auto hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-left space-y-1 w-full">
                  <div className="flex items-center justify-between">
                    <Badge size="sm" className={getCategoryColor(command.category)}>
                      {command.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(command.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-sm font-medium">"{command.phrase}"</p>
                  <p className="text-xs text-muted-foreground">{command.action}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedVoiceIntegration;
