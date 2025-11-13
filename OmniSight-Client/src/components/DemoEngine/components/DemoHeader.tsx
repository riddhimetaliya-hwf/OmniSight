
import React from 'react';
import { DemoPersona } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PersonaSwitcher } from './PersonaSwitcher';
import { 
  RefreshCw, 
  X, 
  HelpCircle,
  ArrowUpDown
} from 'lucide-react';
import { useDemoContext } from '../context/DemoContext';

interface DemoHeaderProps {
  activePersona: DemoPersona;
  onReset: () => void;
  onToggleWalkthrough: () => void;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({
  activePersona,
  onReset,
  onToggleWalkthrough
}) => {
  const { deactivateDemo, isLoading } = useDemoContext();
  
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-primary text-primary-foreground shadow-md">
      <div className="flex items-center space-x-4">
        <Badge variant="outline" className="bg-primary-foreground text-primary px-2 py-1">
          DEMO MODE
        </Badge>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Viewing as:</span>
          <PersonaSwitcher 
            activePersona={activePersona} 
            className="persona-switcher"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleWalkthrough}
          className="text-primary-foreground hover:bg-primary/80"
        >
          <HelpCircle className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Guide</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-primary-foreground hover:bg-primary/80 reset-demo-button"
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Reset Demo</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={deactivateDemo}
          className="text-primary-foreground hover:bg-primary/80"
        >
          <X className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Exit Demo</span>
        </Button>
      </div>
    </div>
  );
};
