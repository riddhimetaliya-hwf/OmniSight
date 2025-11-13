
import React from 'react';
import { Button } from '@/components/ui/button';
import { useOmniCommand } from '../context/OmniCommandContext';
import { ExecutiveRole } from '../types';
import { BadgeCheck } from 'lucide-react';

const RoleSwitcher: React.FC = () => {
  const { settings, switchRole } = useOmniCommand();
  
  const roles: ExecutiveRole[] = ['CEO', 'CFO', 'COO', 'CTO', 'CMO', 'custom'];
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Customize for role:</h3>
      
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <Button
            key={role}
            size="sm"
            variant={settings.role === role ? "default" : "outline"}
            onClick={() => switchRole(role)}
            className="flex items-center gap-1.5"
          >
            {settings.role === role && <BadgeCheck className="h-3.5 w-3.5" />}
            {role}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RoleSwitcher;
