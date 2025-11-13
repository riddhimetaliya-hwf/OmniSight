
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, 
  Volume2, 
  Settings, 
  Brain, 
  Bell,
  Shield,
  Globe
} from 'lucide-react';

const CopilotSettings: React.FC = () => {
  const [voiceSettings, setVoiceSettings] = useState({
    wakeWordEnabled: true,
    wakeWord: 'Hey Copilot',
    language: 'en-US',
    voiceBiometricsEnabled: false,
    ambientListening: true,
    volume: 80,
    voiceThreshold: 0.5
  });

  const [aiSettings, setAiSettings] = useState({
    communicationStyle: 'concise',
    businessFocus: 'balanced',
    proactiveInsights: true,
    contextAwareness: true,
    predictiveAnalysis: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    dailyBriefing: true,
    criticalAlerts: true,
    performanceUpdates: true,
    marketChanges: true,
    emailNotifications: false
  });

  return (
    <div className="w-full max-h-96 overflow-y-auto">
      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="ai">AI Behavior</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="voice" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="wake-word">Wake Word Detection</Label>
                <p className="text-sm text-muted-foreground">
                  Enable "{voiceSettings.wakeWord}" activation
                </p>
              </div>
              <Switch
                id="wake-word"
                checked={voiceSettings.wakeWordEnabled}
                onCheckedChange={(checked) => 
                  setVoiceSettings(prev => ({ ...prev, wakeWordEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ambient-listening">Ambient Listening</Label>
                <p className="text-sm text-muted-foreground">
                  Continuous background processing
                </p>
              </div>
              <Switch
                id="ambient-listening"
                checked={voiceSettings.ambientListening}
                onCheckedChange={(checked) => 
                  setVoiceSettings(prev => ({ ...prev, ambientListening: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="voice-biometrics">Voice Biometrics</Label>
                <p className="text-sm text-muted-foreground">
                  Secure voice authentication
                </p>
              </div>
              <Switch
                id="voice-biometrics"
                checked={voiceSettings.voiceBiometricsEnabled}
                onCheckedChange={(checked) => 
                  setVoiceSettings(prev => ({ ...prev, voiceBiometricsEnabled: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Voice Volume: {voiceSettings.volume}%</Label>
              <Slider
                value={[voiceSettings.volume]}
                onValueChange={(value) => 
                  setVoiceSettings(prev => ({ ...prev, volume: value[0] }))
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={voiceSettings.language}
                onChange={(e) => 
                  setVoiceSettings(prev => ({ ...prev, language: e.target.value }))
                }
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
                <option value="ja-JP">Japanese</option>
                <option value="zh-CN">Chinese (Simplified)</option>
              </select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Communication Style</Label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={aiSettings.communicationStyle}
                onChange={(e) => 
                  setAiSettings(prev => ({ ...prev, communicationStyle: e.target.value }))
                }
              >
                <option value="concise">Concise & Direct</option>
                <option value="detailed">Detailed & Thorough</option>
                <option value="conversational">Conversational</option>
                <option value="technical">Technical</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Business Focus</Label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={aiSettings.businessFocus}
                onChange={(e) => 
                  setAiSettings(prev => ({ ...prev, businessFocus: e.target.value }))
                }
              >
                <option value="strategic">Strategic Planning</option>
                <option value="operational">Operational Efficiency</option>
                <option value="financial">Financial Performance</option>
                <option value="customer">Customer Experience</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Proactive Insights</Label>
                <p className="text-sm text-muted-foreground">
                  AI suggests actions based on patterns
                </p>
              </div>
              <Switch
                checked={aiSettings.proactiveInsights}
                onCheckedChange={(checked) => 
                  setAiSettings(prev => ({ ...prev, proactiveInsights: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Context Awareness</Label>
                <p className="text-sm text-muted-foreground">
                  Remember conversation history
                </p>
              </div>
              <Switch
                checked={aiSettings.contextAwareness}
                onCheckedChange={(checked) => 
                  setAiSettings(prev => ({ ...prev, contextAwareness: checked }))
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</Label>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-muted/50">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Data Security
              </h4>
              <p className="text-sm text-muted-foreground">
                All conversations are encrypted and stored securely. Voice biometrics data is processed locally.
              </p>
            </div>

            <div className="p-4 rounded-lg border bg-muted/50">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Data Processing
              </h4>
              <p className="text-sm text-muted-foreground">
                Choose how your data is processed and stored for AI analysis.
              </p>
              <div className="mt-2 space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="dataProcessing" value="cloud" defaultChecked />
                  <span className="text-sm">Cloud Processing (Recommended)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="dataProcessing" value="local" />
                  <span className="text-sm">Local Processing Only</span>
                </label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-4 border-t mt-6">
        <Button className="w-full">Save Settings</Button>
      </div>
    </div>
  );
};

export default CopilotSettings;
