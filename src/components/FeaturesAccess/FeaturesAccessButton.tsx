
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { 
  Settings, 
  Store,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export interface FeaturesAccessButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'accent';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const FeaturesAccessButton: React.FC<FeaturesAccessButtonProps> = ({ 
  variant = 'outline',
  size = 'default',
  className = ''
}) => {
  const navigate = useNavigate();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`gap-2 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 hover:from-primary/10 hover:to-secondary/10 transition-all ${className}`}
        >
          <CheckCircle className="h-4 w-4 text-accent" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium">Features</span>
          <Badge variant="outline" className="ml-1 bg-primary/10 text-primary text-xs border border-primary/20">New</Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-72 border-0 shadow-lg rounded-xl overflow-hidden bg-card/95 backdrop-blur-sm"
      >
        <DropdownMenuLabel className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10 text-primary font-medium">
          OmniSight Features
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="border-primary/10" />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1.5">
            Platform Settings
          </DropdownMenuLabel>
          <div className="grid grid-cols-1 gap-1">
            <DropdownMenuItem 
              onClick={() => navigate('/settings')}
              className="hover:bg-primary/5 rounded-md transition-colors focus:bg-primary/10"
            >
              <Settings className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-primary">User Preferences</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeaturesAccessButton;
