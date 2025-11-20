
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface VoiceCommandsListProps {
  onSelectCommand: (command: string) => void;
}

const suggestedCommands = [
  {
    id: 'sales-dashboard',
    text: 'Show sales dashboard',
    description: 'Open the sales performance dashboard'
  },
  {
    id: 'workflow',
    text: 'Create new workflow',
    description: 'Open the workflow studio'
  },
  {
    id: 'alerts',
    text: 'Show me recent alerts',
    description: 'View recent system alerts'
  },
  {
    id: 'report',
    text: 'Generate quarterly report',
    description: 'Create a new quarterly report'
  },
  {
    id: 'help',
    text: 'What can you do?',
    description: 'Learn about OmniVoice capabilities'
  }
];

const VoiceCommandsList: React.FC<VoiceCommandsListProps> = ({ onSelectCommand }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Try saying "Hey Omni" followed by:</h3>
      <ScrollArea className="h-[250px] pr-3">
        <div className="space-y-2">
          {suggestedCommands.map((command) => (
            <Button
              key={command.id}
              variant="outline"
              className="w-full justify-start text-left h-auto py-2"
              onClick={() => onSelectCommand(command.text)}
            >
              <div>
                <p className="font-medium">{command.text}</p>
                <p className="text-xs text-muted-foreground">{command.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VoiceCommandsList;
