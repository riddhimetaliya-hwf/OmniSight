
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  variant?: 'spinner' | 'pulse' | 'skeleton' | 'shimmer';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  variant = 'spinner', 
  size = 'default', 
  className,
  text 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const renderVariant = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className="flex items-center gap-2">
            <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
            {text && <span className="text-sm text-muted-foreground">{text}</span>}
          </div>
        );
      
      case 'pulse':
        return (
          <div className="flex items-center gap-2">
            <div className={cn('rounded-full bg-primary animate-pulse', sizeClasses[size])} />
            {text && <span className="text-sm text-muted-foreground animate-pulse">{text}</span>}
          </div>
        );
      
      case 'skeleton':
        return (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        );
      
      case 'shimmer':
        return (
          <div className="relative overflow-hidden bg-muted rounded h-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn('flex justify-center items-center', className)}>
      {renderVariant()}
    </div>
  );
};

export default Loading;
