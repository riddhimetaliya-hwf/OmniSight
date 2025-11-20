
import React from 'react';
import { CommandGroup, CommandItem } from '@/components/ui/command';
import { CommandItem as CommandItemType } from '../types';
import { getDynamicIcon } from '../utils/iconUtils';
import { History } from 'lucide-react';

interface CommandHistoryProps {
  items: CommandItemType[];
  onSelect: (item: CommandItemType) => void;
}

const CommandHistory: React.FC<CommandHistoryProps> = ({ items, onSelect }) => {
  if (items.length === 0) return null;
  
  return (
    <CommandGroup heading="Recent">
      {items.map((item) => {
        const Icon = getDynamicIcon(item.icon);
        
        return (
          <CommandItem
            key={item.id}
            onSelect={() => onSelect(item)}
            className="flex items-center gap-2 px-2 py-1.5 cursor-pointer"
          >
            {Icon ? <Icon className="h-4 w-4" /> : <History className="h-4 w-4" />}
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

export default CommandHistory;
