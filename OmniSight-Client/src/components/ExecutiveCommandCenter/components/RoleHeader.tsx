
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Monitor, 
  Megaphone,
  Settings,
  Download,
  Share2,
  Sparkles
} from 'lucide-react';
import { ExecutiveRole } from '@/types/executive-roles';

interface RoleHeaderProps {
  role: ExecutiveRole;
  displayName: string;
  description: string;
  roleColor: string;
  focusAreas: string[];
}

const RoleHeader: React.FC<RoleHeaderProps> = ({ 
  role, 
  displayName, 
  description, 
  roleColor,
  focusAreas 
}) => {
  const getRoleIcon = (role: ExecutiveRole) => {
    const iconProps = { className: "h-6 w-6", style: { color: roleColor } };
    
    switch (role) {
      case 'CEO':
        return <TrendingUp {...iconProps} />;
      case 'CFO':
        return <DollarSign {...iconProps} />;
      case 'COO':
        return <BarChart3 {...iconProps} />;
      case 'CTO':
        return <Monitor {...iconProps} />;
      case 'CMO':
        return <Megaphone {...iconProps} />;
      default:
        return <TrendingUp {...iconProps} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-xl shadow-lg"
              style={{ backgroundColor: `${roleColor}15`, border: `1px solid ${roleColor}30` }}
            >
              {getRoleIcon(role)}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {displayName} Command Center
              </h1>
              <p className="text-muted-foreground text-lg mt-1">{description}</p>
            </div>
            <Badge 
              className="ml-4 gap-1" 
              style={{ backgroundColor: `${roleColor}20`, color: roleColor, borderColor: `${roleColor}40` }}
            >
              <Sparkles className="h-3 w-3" />
              Executive Dashboard
            </Badge>
          </div>
          
          {/* Focus Areas */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Key Focus Areas:</p>
            <div className="flex flex-wrap gap-2">
              {focusAreas.map((area, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-xs px-3 py-1"
                  style={{ borderColor: `${roleColor}40`, color: roleColor }}
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            style={{ borderColor: `${roleColor}40`, color: roleColor }}
          >
            <Settings className="h-4 w-4" />
            Customize
          </Button>
        </div>
      </div>
      
      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
};

export default RoleHeader;
