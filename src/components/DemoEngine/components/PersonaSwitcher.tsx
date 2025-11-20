
import React from 'react';
import { DemoPersona } from '../types';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  CircleUser, 
  ChevronDown,
  TrendingUp,
  DollarSign,
  BarChart,
  Users,
  Megaphone
} from 'lucide-react';
import { useDemoContext } from '../context/DemoContext';
import { cn } from '@/lib/utils';

interface PersonaSwitcherProps {
  activePersona: DemoPersona;
  className?: string;
  disabled?: boolean;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
  activePersona,
  className,
  disabled = false
}) => {
  const { switchPersona } = useDemoContext();
  
  const personas: Array<{
    id: DemoPersona;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      id: 'CEO',
      label: 'CEO',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Strategic overview of all business units'
    },
    {
      id: 'CFO',
      label: 'CFO',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Financial metrics and forecasts'
    },
    {
      id: 'COO',
      label: 'COO',
      icon: <BarChart className="h-4 w-4" />,
      description: 'Operational performance and efficiency'
    },
    {
      id: 'CMO',
      label: 'CMO',
      icon: <Megaphone className="h-4 w-4" />,
      description: 'Marketing campaigns and customer insights'
    },
    {
      id: 'CHRO',
      label: 'CHRO',
      icon: <Users className="h-4 w-4" />,
      description: 'Workforce analytics and talent management'
    }
  ];
  
  const activePersonaDetails = personas.find(p => p.id === activePersona);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={cn("", className)}>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          disabled={disabled}
        >
          {activePersonaDetails?.icon || <CircleUser className="h-4 w-4" />}
          <span className="mx-1">{activePersonaDetails?.label || 'Select Persona'}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-[240px]">
        {personas.map(persona => (
          <DropdownMenuItem 
            key={persona.id}
            onClick={() => switchPersona(persona.id)}
            className="cursor-pointer py-2"
          >
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                {persona.icon}
              </div>
              <div>
                <p className="font-medium">{persona.label}</p>
                <p className="text-xs text-muted-foreground">{persona.description}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
