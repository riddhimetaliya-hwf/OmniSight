
import React from 'react';
import { DraggableNode } from './DraggableNode';
import { NodeDefinition } from './nodeData';
import { Separator } from '@/components/ui/separator';

interface NodeSectionProps {
  title: string;
  icon: React.ReactNode;
  nodes: NodeDefinition[];
  filteredNodes: NodeDefinition[];
  badgeText?: string;
  badgeClass?: string;
}

export const NodeSection: React.FC<NodeSectionProps> = ({
  title,
  icon,
  nodes,
  filteredNodes,
  badgeText,
  badgeClass
}) => {
  return (
    <div>
      <h2 className="text-sm font-semibold flex items-center mb-3">
        {icon}
        {title}
        {badgeText && (
          <span className={`ml-2 ${badgeClass}`}>
            {badgeText}
          </span>
        )}
      </h2>
      <div>
        {filteredNodes.map((node, index) => (
          <DraggableNode key={`${node.type}-${index}`} {...node} />
        ))}
      </div>
      {filteredNodes.length === 0 && (
        <p className="text-sm text-muted-foreground italic">No {title.toLowerCase()} match your search.</p>
      )}
      <Separator className="my-6" />
    </div>
  );
};
