import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Badge } from './badge';
import { Button } from './button';
import { HelpCircle, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartTooltipProps {
  children: React.ReactNode;
  title: string;
  description: string;
  type?: 'info' | 'warning' | 'success' | 'insight';
  actionLabel?: string;
  onAction?: () => void;
  showDelay?: number;
  className?: string;
}

export const SmartTooltip: React.FC<SmartTooltipProps> = ({
  children,
  title,
  description,
  type = 'info',
  actionLabel,
  onAction,
  showDelay = 300,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const typeConfig = {
    info: {
      icon: HelpCircle,
      badge: 'info',
      bgClass: 'bg-info/5 border-info/20'
    },
    warning: {
      icon: AlertCircle,
      badge: 'warning',
      bgClass: 'bg-warning/5 border-warning/20'
    },
    success: {
      icon: TrendingUp,
      badge: 'success', 
      bgClass: 'bg-success/5 border-success/20'
    },
    insight: {
      icon: Lightbulb,
      badge: 'gradient',
      bgClass: 'bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <TooltipProvider delayDuration={showDelay}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          className={cn(
            'max-w-sm p-0 border-0 bg-transparent shadow-none',
            className
          )}
          side="top"
          align="center"
        >
          <div className={cn(
            'p-4 rounded-xl border backdrop-blur-xl shadow-xl animate-scale-in',
            config.bgClass,
            'bg-white/90'
          )}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-1.5 rounded-lg bg-background/50">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{title}</h4>
                  <Badge variant={config.badge as any} size="sm">
                    {type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
                {actionLabel && onAction && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 h-7 px-2 text-xs"
                    onClick={() => {
                      onAction();
                      setIsOpen(false);
                    }}
                  >
                    {actionLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SmartTooltip;
