
import React from 'react';
import { Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { SmartTooltip } from '@/components/OmniGuide';

interface ShortcutHintProps {
  onClick?: () => void;
}

const ShortcutHint: React.FC<ShortcutHintProps> = ({ onClick }) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  
  // Handle click with fallback if no onClick is provided
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Fallback: trigger keyboard shortcut programmatically
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'k',
          metaKey: true,
          bubbles: true
        })
      );
    }
  };
  
  return (
    <SmartTooltip
      tooltipId="omniprompt-shortcut"
      title="Command Bar"
      content="Press this button or use the keyboard shortcut to access the command bar for quick navigation and actions."
      showOnce={true}
      placement="bottom"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs h-8 px-2 border-dashed"
              onClick={handleClick}
            >
              <Command className="h-3.5 w-3.5" />
              <span>{isMac ? '⌘' : 'Ctrl'}</span>
              <span>K</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Open command bar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SmartTooltip>
  );
};

export default ShortcutHint;
