
import React from 'react';
import { CommandInput as CMDKInput } from '@/components/ui/command';
import { Search } from 'lucide-react';

interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CommandInput: React.FC<CommandInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Type a command..." 
}) => {
  return (
    <div className="flex w-full items-center space-x-2">
      <Search className="h-4 w-4 shrink-0 opacity-50" />
      <CMDKInput 
        value={value}
        onValueChange={onChange}
        placeholder={placeholder}
        className="flex-1 border-0 outline-none focus:ring-0 bg-transparent placeholder:text-muted-foreground"
      />
    </div>
  );
};

export default CommandInput;
