
import React from 'react';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddConnectorButtonProps {
  onClick: () => void;
  className?: string;
}

const AddConnectorButton: React.FC<AddConnectorButtonProps> = ({ onClick, className }) => {
  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center p-5 h-full border-dashed cursor-pointer",
        "transition-all hover:border-primary/50 hover:bg-muted/50 animate-fade-in",
        "min-h-[200px]",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 rounded-full bg-primary/10">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">Add New Integration</h3>
          <p className="text-sm text-muted-foreground">
            Connect a new enterprise system
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AddConnectorButton;
