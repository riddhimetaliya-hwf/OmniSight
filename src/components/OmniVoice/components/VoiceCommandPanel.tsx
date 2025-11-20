
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Volume2, VolumeX, Command, ListChecks, Settings2, Sparkles } from 'lucide-react';
import { useOmniVoice } from '../hooks/useOmniVoice';

export interface VoiceCommand {
  id: string;
  phrase: string;
  description: string;
  category: 'navigation' | 'analysis' | 'system' | 'custom';
  action: string | Function;
}

const defaultCommands: VoiceCommand[] = [
  {
    id: 'cmd1',
    phrase: 'Show dashboard',
    description: 'Navigate to the main dashboard',
    category: 'navigation',
    action: '/'
  },
  {
    id: 'cmd2',
    phrase: 'Show sales report',
    description: 'Open the sales performance report',
    category: 'navigation',
    action: '/reports'
  },
  {
    id: 'cmd3',
    phrase: 'Analyze customer trends',
    description: 'Generate insights about customer behavior',
    category: 'analysis',
    action: 'analyze_customer_trends'
  },
  {
    id: 'cmd4',
    phrase: 'System status',
    description: 'Check system health and status',
    category: 'system',
    action: 'system_status'
  }
];

const VoiceCommandPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<VoiceCommand[]>(defaultCommands);
  const [customPhrase, setCustomPhrase] = useState('');
  const [customAction, setCustomAction] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [wakeWord, setWakeWord] = useState('Hey Omni');
  const [filter, setFilter] = useState('');
  
  const { toast } = useToast();
  const { 
    startListening, 
    stopListening, 
    isWakeWordDetected, 
    isProcessing, 
    isSpeaking, 
    toggleMute 
  } = useOmniVoice();
  
  // Filter commands based on search query
  const filteredCommands = filter 
    ? commands.filter(cmd => 
        cmd.phrase.toLowerCase().includes(filter.toLowerCase()) ||
        cmd.description.toLowerCase().includes(filter.toLowerCase())
      )
    : commands;
    
  // Group commands by category
  const navigationCommands = filteredCommands.filter(cmd => cmd.category === 'navigation');
  const analysisCommands = filteredCommands.filter(cmd => cmd.category === 'analysis');
  const systemCommands = filteredCommands.filter(cmd => cmd.category === 'system');
  const customCommands = filteredCommands.filter(cmd => cmd.category === 'custom');
  
  // Handle command toggle (enable/disable)
  const handleToggleCommand = (id: string, enabled: boolean) => {
    // In a real app, this would save the state
    toast({
      title: enabled ? "Command enabled" : "Command disabled",
      description: `Voice command has been ${enabled ? 'enabled' : 'disabled'}.`
    });
  };
  
  // Add a custom command
  const handleAddCustomCommand = () => {
    if (!customPhrase || !customAction) {
      toast({
        title: "Missing information",
        description: "Please provide both a phrase and an action for your custom command.",
        variant: "destructive"
      });
      return;
    }
    
    const newCommand: VoiceCommand = {
      id: `custom-${Date.now()}`,
      phrase: customPhrase,
      description: customDescription || 'Custom command',
      category: 'custom',
      action: customAction
    };
    
    setCommands([...commands, newCommand]);
    
    // Reset form
    setCustomPhrase('');
    setCustomAction('');
    setCustomDescription('');
    
    toast({
      title: "Custom command added",
      description: `"${customPhrase}" has been added to your voice commands.`
    });
  };
  
  // Delete a command
  const handleDeleteCommand = (id: string) => {
    setCommands(commands.filter(cmd => cmd.id !== id));
    
    toast({
      title: "Command removed",
      description: "The voice command has been removed."
    });
  };
  
  // Update wake word
  const handleUpdateWakeWord = () => {
    // In a real app, this would save to user preferences
    toast({
      title: "Wake word updated",
      description: `Your wake word has been updated to "${wakeWord}".`
    });
  };
  
  useEffect(() => {
    // Listen for keyboard shortcut to toggle panel
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + V to toggle voice command panel
      if (e.altKey && e.key === 'v') {
        setIsOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Command className="h-5 w-5" />
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-[90%] max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Command className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Voice Command Center</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-muted-foreground"
                >
                  {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button
                  variant={isWakeWordDetected ? "destructive" : "outline"}
                  size="icon"
                  onClick={isWakeWordDetected ? stopListening : startListening}
                  className={isWakeWordDetected ? "animate-pulse" : ""}
                >
                  {isWakeWordDetected ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
            
            <Tabs defaultValue="commands">
              <div className="p-4 border-b">
                <TabsList className="w-full">
                  <TabsTrigger value="commands" className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    Commands
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Custom Commands
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="commands" className="p-0">
                <div className="p-4">
                  <Input
                    placeholder="Search commands..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="mb-4"
                  />
                  
                  <ScrollArea className="h-[calc(80vh-180px)]">
                    {/* Navigation Commands */}
                    {navigationCommands.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">NAVIGATION</h3>
                        <div className="space-y-1">
                          {navigationCommands.map(cmd => (
                            <div key={cmd.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                              <div>
                                <div className="font-medium">{cmd.phrase}</div>
                                <div className="text-sm text-muted-foreground">{cmd.description}</div>
                              </div>
                              <Switch
                                defaultChecked={true}
                                onCheckedChange={(checked) => handleToggleCommand(cmd.id, checked)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Analysis Commands */}
                    {analysisCommands.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">ANALYSIS</h3>
                        <div className="space-y-1">
                          {analysisCommands.map(cmd => (
                            <div key={cmd.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                              <div>
                                <div className="font-medium">{cmd.phrase}</div>
                                <div className="text-sm text-muted-foreground">{cmd.description}</div>
                              </div>
                              <Switch
                                defaultChecked={true}
                                onCheckedChange={(checked) => handleToggleCommand(cmd.id, checked)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* System Commands */}
                    {systemCommands.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">SYSTEM</h3>
                        <div className="space-y-1">
                          {systemCommands.map(cmd => (
                            <div key={cmd.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                              <div>
                                <div className="font-medium">{cmd.phrase}</div>
                                <div className="text-sm text-muted-foreground">{cmd.description}</div>
                              </div>
                              <Switch
                                defaultChecked={true}
                                onCheckedChange={(checked) => handleToggleCommand(cmd.id, checked)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Custom Commands */}
                    {customCommands.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">CUSTOM</h3>
                        <div className="space-y-1">
                          {customCommands.map(cmd => (
                            <div key={cmd.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                              <div>
                                <div className="font-medium">{cmd.phrase}</div>
                                <div className="text-sm text-muted-foreground">{cmd.description}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  defaultChecked={true}
                                  onCheckedChange={(checked) => handleToggleCommand(cmd.id, checked)}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteCommand(cmd.id)}
                                  className="h-8 w-8 text-destructive"
                                >
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
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Wake Word</h3>
                  <div className="flex items-end gap-2">
                    <Input
                      value={wakeWord}
                      onChange={(e) => setWakeWord(e.target.value)}
                      placeholder="Hey Omni"
                      className="flex-1"
                    />
                    <Button onClick={handleUpdateWakeWord}>Update</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Say this phrase to activate voice commands without pressing a button.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Voice Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Voice feedback</div>
                        <div className="text-sm text-muted-foreground">Enable voice responses</div>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Background listening</div>
                        <div className="text-sm text-muted-foreground">Listen for wake word when app is in background</div>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Proactive suggestions</div>
                        <div className="text-sm text-muted-foreground">Allow AI to suggest voice commands</div>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Create Custom Command</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Phrase</label>
                      <Input
                        value={customPhrase}
                        onChange={(e) => setCustomPhrase(e.target.value)}
                        placeholder="What the user should say..."
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Action</label>
                      <Input
                        value={customAction}
                        onChange={(e) => setCustomAction(e.target.value)}
                        placeholder="URL or action name"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description (optional)</label>
                      <Input
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="Explain what this command does"
                      />
                    </div>
                    
                    <Button onClick={handleAddCustomCommand}>
                      Add Custom Command
                    </Button>
                  </div>
                </div>
                
                {customCommands.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Your Custom Commands</h3>
                    <ScrollArea className="h-60">
                      <div className="space-y-1">
                        {customCommands.map(cmd => (
                          <div key={cmd.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                            <div>
                              <div className="font-medium">{cmd.phrase}</div>
                              <div className="text-sm text-muted-foreground">{cmd.description}</div>
                              <div className="text-xs text-muted-foreground">Action: {typeof cmd.action === 'string' ? cmd.action : 'Function'}</div>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteCommand(cmd.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      )}
    </>
  );
};

export default VoiceCommandPanel;
