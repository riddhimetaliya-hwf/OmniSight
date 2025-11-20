
import React from 'react';
import { CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { CommandItem as CommandItemType } from '../types';
import { getDynamicIcon } from '../utils/iconUtils';

interface CommandSuggestionsProps {
  items: CommandItemType[];
  onSelect: (item: CommandItemType) => void;
  inputValue: string;
}

const CommandSuggestions: React.FC<CommandSuggestionsProps> = ({ 
  items, 
  onSelect, 
  inputValue 
}) => {
  if (items.length === 0) {
    return (
      <CommandEmpty>
        No matching commands found
      </CommandEmpty>
    );
  }

  return (
    <CommandGroup heading="Suggestions">
      {items.map((item) => {
        const Icon = getDynamicIcon(item.icon);
        
        return (
          <CommandItem
            key={item.id}
            onSelect={() => onSelect(item)}
            className="flex items-center gap-2 px-2 py-1.5 cursor-pointer"
          >
            {Icon && <Icon className="h-4 w-4" />}
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
};

export default CommandSuggestions;
