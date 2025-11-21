import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Key } from "lucide-react";

interface TemplateCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  trigger: string;
  // integrations: string[];
  requiredCredentials?: string[]; 
  onClick: () => void;
}

export const TemplateCard = ({ 
  title, 
  description, 
  icon: Icon, 
  category, 
  trigger,  
  // integrations, 
  requiredCredentials = [], 
  onClick 
}: TemplateCardProps) => {
  const getTriggerVariant = (trigger: string) => {
    switch (trigger) {
      case "Complex":
        return "default";
      case "Manual":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Filter out noisy/invalid integrations for display
  // const displayIntegrations = integrations.filter(integration => {
  //   const normalized = integration.toLowerCase().trim();
  //   const skipPatterns = [
  //     'documentation', 'manual', 'workflow', 'trigger', 
  //     'api', 'key', 'step', 'action'
  //   ];
    
  //   return !skipPatterns.some(pattern => normalized.includes(pattern)) &&
  //          normalized.length > 2 &&
  //          !normalized.match(/^\d+$/) &&
  //          !normalized.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  // });

  return (
    <Card 
      onClick={onClick}
      className="group relative overflow-hidden border-border bg-card cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{category}</span>
            <Badge variant={getTriggerVariant(trigger)} className="text-xs">
              {trigger}
            </Badge>
          </div>
        </div>
        
        {/* Icon and Title */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground leading-tight">
            {title}
          </h3>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Required Credentials Section */}
        {requiredCredentials.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-medium text-foreground">
                Required Credentials ({requiredCredentials.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-1">
              {requiredCredentials.map((credential, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                >
                  {credential}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Integrations
        {displayIntegrations.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-sm font-medium text-foreground">
              Integrations ({displayIntegrations.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {displayIntegrations.slice(0, 3).map((integration, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-secondary/50 hover:bg-secondary"
                >
                  {integration}
                </Badge>
              ))}
              {displayIntegrations.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{displayIntegrations.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )} */}
      </div>
    </Card>
  );
};