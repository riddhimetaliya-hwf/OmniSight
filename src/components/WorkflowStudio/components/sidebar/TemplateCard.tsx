
import React from 'react';
import { Workflow } from 'lucide-react';

interface TemplateCardProps {
  name: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ name }) => {
  return (
    <div className="p-3 border rounded-lg bg-background hover:border-primary cursor-pointer transition-all">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-muted text-foreground">
          <Workflow className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-xs text-muted-foreground">Pre-built workflow template</p>
        </div>
      </div>
    </div>
  );
};
