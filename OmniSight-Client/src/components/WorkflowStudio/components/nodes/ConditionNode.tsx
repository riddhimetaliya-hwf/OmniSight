
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Filter, Equal, Shield } from 'lucide-react';

type ConditionNodeProps = {
  data: {
    label: string;
    icon: string;
    description: string;
    config: any;
  };
  selected: boolean;
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'filter':
      return <Filter className="h-4 w-4" />;
    case 'equal':
      return <Equal className="h-4 w-4" />;
    case 'shield':
      return <Shield className="h-4 w-4" />;
    default:
      return <Filter className="h-4 w-4" />;
  }
};

export const ConditionNode = memo(({ data, selected }: ConditionNodeProps) => {
  return (
    <div className={`rounded-md bg-white border-2 ${selected ? 'border-amber-500' : 'border-gray-200'} shadow-sm`}>
      <div className="p-3 min-w-[180px]">
        <div className="flex items-center mb-2">
          <div className="bg-amber-100 p-1.5 rounded mr-2">
            {getIcon(data.icon)}
          </div>
          <div className="font-medium text-sm">{data.label}</div>
        </div>
        <div className="text-xs text-muted-foreground">{data.description}</div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        id="b"
        className="w-3 h-3 bg-amber-500 border-2 border-white"
      />
      
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-3 h-3 bg-green-500 border-2 border-white right-5"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 bg-red-500 border-2 border-white"
      />
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';
