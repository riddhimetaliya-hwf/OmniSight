
import React from 'react';
import { useDrag } from 'react-dnd';
import { Badge } from '@/components/ui/badge';

interface DraggableNodeProps {
  type: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  category?: string;
}

export const DraggableNode: React.FC<DraggableNodeProps> = ({ type, label, icon, description, category }) => {
  const [, drag] = useDrag(() => ({
    type: 'node',
    item: { type, label, data: { label } },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="p-3 border rounded-lg bg-background shadow-sm hover:shadow-md cursor-grab transition-all hover:border-primary mb-2 group"
    >
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-sm">{label}</h3>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {category && (
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">{category}</Badge>
        </div>
      )}
    </div>
  );
};
