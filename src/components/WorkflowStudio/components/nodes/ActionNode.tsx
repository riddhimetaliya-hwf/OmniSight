
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Activity } from 'lucide-react';

interface ActionNodeProps {
  data: {
    label: string;
    icon?: React.ReactNode;
  };
  selected: boolean;
}

export const ActionNode: React.FC<ActionNodeProps> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-2 rounded-md border-2 shadow-sm bg-white ${
      selected ? 'border-primary' : 'border-muted'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-white"
      />
      <div className="flex items-center gap-2">
        <div className="p-1 rounded bg-blue-100">
          {data.icon || <Activity className="h-4 w-4 text-primary" />}
        </div>
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-white"
      />
    </div>
  );
};
