
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SidebarSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SidebarSearch: React.FC<SidebarSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="p-4 border-b">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search blocks..."
          className="pl-9 bg-background"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};
