
import React from 'react';
import { MessageCircle, PanelLeft, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type CopilotView = 'chat' | 'voice' | 'context' | 'dashboard' | 'settings';

interface TabListProps { 
  activeView: CopilotView;
  onChange: (view: CopilotView) => void;
}

export const TabList: React.FC<TabListProps> = ({ activeView, onChange }) => {
  return (
    <div className="flex items-center border rounded-md overflow-hidden">
      <TabButton 
        isActive={activeView === 'chat'} 
        icon={<MessageCircle className="h-3.5 w-3.5" />} 
        onClick={() => onChange('chat')}
        tooltip="Chat with AI Assistant"
      />
      <TabButton 
        isActive={activeView === 'dashboard'} 
        icon={<PanelLeft className="h-3.5 w-3.5" />} 
        onClick={() => onChange('dashboard')}
        tooltip="View Business Dashboard"
      />
      <TabButton 
        isActive={activeView === 'settings'} 
        icon={<Settings2 className="h-3.5 w-3.5" />} 
        onClick={() => onChange('settings')}
        tooltip="Copilot Settings"
      />
    </div>
  );
};

interface TabButtonProps { 
  isActive: boolean; 
  icon: React.ReactNode; 
  onClick: () => void;
  tooltip: string;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, icon, onClick, tooltip }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-2 rounded-none ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="center">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};
