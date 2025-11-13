
import React, { useEffect, useState } from 'react';
import { Command } from '@/components/ui/command';
import { useNavigate } from 'react-router-dom';
import { useCommandShortcut } from './hooks/useCommandShortcut';
import CommandInput from './components/CommandInput';
import CommandSuggestions from './components/CommandSuggestions';
import CommandHistory from './components/CommandHistory';
import { CommandItem } from './types';
import { commandItems } from './data/commandItems';
import VoiceCommandButton from './components/VoiceCommandButton';
import { useToast } from '@/hooks/use-toast';

interface OmniPromptBarProps {
  initialOpen?: boolean;
}

const OmniPromptBar: React.FC<OmniPromptBarProps> = ({ initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [inputValue, setInputValue] = useState('');
  const [filteredItems, setFilteredItems] = useState<CommandItem[]>([]);
  const [history, setHistory] = useState<CommandItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set up keyboard shortcut to open/close the command bar
  useCommandShortcut(() => setIsOpen(prev => !prev), { 
    key: 'k', 
    ctrlKey: false, 
    metaKey: true 
  });

  // Filter command items based on input
  useEffect(() => {
    if (!inputValue) {
      setFilteredItems([]);
      return;
    }
    
    const filtered = commandItems.filter(item => 
      item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(inputValue.toLowerCase()))
    );
    
    setFilteredItems(filtered);
  }, [inputValue]);

  // Execute command and add to history
  const executeCommand = (item: CommandItem) => {
    // Update history
    setHistory(prev => {
      const newHistory = [item, ...prev.filter(h => h.id !== item.id)].slice(0, 10);
      return newHistory;
    });

    // Handle different command types
    switch (item.type) {
      case 'navigation':
        navigate(item.action as string);
        break;
      case 'function':
        if (typeof item.action === 'function') {
          item.action();
        }
        break;
      case 'ai-query':
        toast({
          title: "AI Query",
          description: `Processing: "${item.name}"`,
        });
        // In a real app, this would send the query to an AI service
        break;
    }

    // Close the command bar
    setIsOpen(false);
    setInputValue('');
  };

  // Handle voice command received
  const handleVoiceCommand = (command: string) => {
    setInputValue(command);
    
    // Try to find an exact match
    const exactMatch = commandItems.find(item => 
      item.name.toLowerCase() === command.toLowerCase() ||
      item.keywords.some(keyword => keyword.toLowerCase() === command.toLowerCase())
    );
    
    if (exactMatch) {
      executeCommand(exactMatch);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 backdrop-blur-sm">
      <div 
        className="w-full max-w-xl overflow-hidden rounded-lg bg-background shadow-2xl animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="border">
          <div className="flex items-center px-3 border-b">
            <CommandInput 
              value={inputValue} 
              onChange={setInputValue} 
              placeholder="Type a command or ask a question..."
            />
            <VoiceCommandButton onCommandReceived={handleVoiceCommand} />
          </div>
          
          <div className="max-h-96 overflow-y-auto p-2">
            {inputValue.length > 0 && (
              <CommandSuggestions 
                items={filteredItems} 
                onSelect={executeCommand} 
                inputValue={inputValue}
              />
            )}
            
            {inputValue.length === 0 && history.length > 0 && (
              <CommandHistory items={history} onSelect={executeCommand} />
            )}
            
            {inputValue.length === 0 && history.length === 0 && (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                Type a command or use the mic to speak a command
              </div>
            )}
          </div>
        </Command>
      </div>
      
      <div 
        className="absolute inset-0 -z-10" 
        onClick={() => setIsOpen(false)}
      />
    </div>
  );
};

export default OmniPromptBar;
