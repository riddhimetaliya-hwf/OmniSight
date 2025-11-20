
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sliders, BarChart3, Download, Share2 } from 'lucide-react';
import { useOmniCommand } from '../context/OmniCommandContext';

interface CommandHeaderProps {
  isCustomizing: boolean;
  setIsCustomizing: (value: boolean) => void;
}

const CommandHeader: React.FC<CommandHeaderProps> = ({ isCustomizing, setIsCustomizing }) => {
  const { settings } = useOmniCommand();
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          {settings.role} Command Center
        </h2>
        <p className="text-muted-foreground mt-1">
          Your executive dashboard with real-time insights
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Button 
          variant={isCustomizing ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsCustomizing(!isCustomizing)}
        >
          <Sliders className="h-4 w-4" />
          <span>Customize</span>
        </Button>
      </div>
    </div>
  );
};

export default CommandHeader;
