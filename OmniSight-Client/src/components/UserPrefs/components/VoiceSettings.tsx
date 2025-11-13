
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useUserPrefs } from '../context/UserPrefsContext';

const VoiceSettings: React.FC = () => {
  const { preferences, updatePreferences } = useUserPrefs();
  
  // Default values if not set
  const voiceEnabled = preferences?.voiceAssistant?.enabled ?? false;
  const voiceVolume = preferences?.voiceAssistant?.volume ?? 80;
  
  const handleToggleVoice = (enabled: boolean) => {
    updatePreferences({
      ...preferences,
      voiceAssistant: {
        ...preferences.voiceAssistant,
        enabled
      }
    });
  };
  
  const handleVolumeChange = (value: number[]) => {
    updatePreferences({
      ...preferences,
      voiceAssistant: {
        ...preferences.voiceAssistant,
        volume: value[0]
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Assistant</CardTitle>
        <CardDescription>
          Configure the voice assistant "Hey Omni"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="voice-assistant">Enable Voice Assistant</Label>
            <p className="text-sm text-muted-foreground">
              Activate the "Hey Omni" wake word
            </p>
          </div>
          <Switch
            id="voice-assistant"
            checked={voiceEnabled}
            onCheckedChange={handleToggleVoice}
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="voice-volume">Assistant Volume</Label>
            <p className="text-sm text-muted-foreground">
              Adjust the volume of voice responses
            </p>
          </div>
          <Slider
            id="voice-volume"
            min={0}
            max={100}
            step={1}
            value={[voiceVolume]}
            onValueChange={handleVolumeChange}
            disabled={!voiceEnabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSettings;
