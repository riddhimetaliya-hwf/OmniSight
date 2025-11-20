
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Monitor, 
  Megaphone, 
  ChevronDown 
} from 'lucide-react';

type ExecutiveRole = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO';

interface RoleSwitcherProps {
  activeRole: ExecutiveRole;
  onRoleChange: (role: ExecutiveRole) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ activeRole, onRoleChange }) => {
  // Role definitions with icons and descriptions
  const roles = [
    { 
      role: 'CEO', 
      icon: <TrendingUp className="h-4 w-4" />, 
      description: 'Strategic overview of all business units' 
    },
    { 
      role: 'CFO', 
      icon: <DollarSign className="h-4 w-4" />, 
      description: 'Financial performance and forecasts' 
    },
    { 
      role: 'COO', 
      icon: <BarChart3 className="h-4 w-4" />, 
      description: 'Operations and efficiency metrics' 
    },
    { 
      role: 'CTO', 
      icon: <Monitor className="h-4 w-4" />, 
      description: 'Technology and innovation metrics' 
    },
    { 
      role: 'CMO', 
      icon: <Megaphone className="h-4 w-4" />, 
      description: 'Marketing and brand performance' 
    }
  ];

  const activeRoleData = roles.find(r => r.role === activeRole) || roles[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 px-3">
          {activeRoleData.icon}
          <span>{activeRoleData.role}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        {roles.map((role) => (
          <DropdownMenuItem 
            key={role.role} 
            onClick={() => onRoleChange(role.role as ExecutiveRole)}
            className="cursor-pointer py-2"
          >
            <div className="flex gap-3 items-start">
              <div className="mt-0.5">{role.icon}</div>
              <div>
                <p className="font-medium">{role.role}</p>
                <p className="text-xs text-slate-500">{role.description}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSwitcher;
