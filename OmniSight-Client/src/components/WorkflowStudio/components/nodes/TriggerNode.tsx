
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlarmClock, Database, Mail, Zap, Package } from 'lucide-react';

type TriggerNodeProps = {
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
    case 'alarm-clock':
      return <AlarmClock className="h-4 w-4" />;
    case 'database':
      return <Database className="h-4 w-4" />;
    case 'mail':
      return <Mail className="h-4 w-4" />;
    case 'zap':
      return <Zap className="h-4 w-4" />;
    case 'package':
      return <Package className="h-4 w-4" />;
    default:
      return <Zap className="h-4 w-4" />;
  }
};

export const TriggerNode = memo(({ data, selected }: TriggerNodeProps) => {
  return (
    <div className={`rounded-md bg-white border-2 ${selected ? 'border-primary' : 'border-gray-200'} shadow-sm`}>
      <div className="p-3 min-w-[180px]">
        <div className="flex items-center mb-2">
          <div className="bg-primary/10 p-1.5 rounded mr-2">
            {getIcon(data.icon)}
          </div>
          <div className="font-medium text-sm">{data.label}</div>
        </div>
        <div className="text-xs text-muted-foreground">{data.description}</div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        className="w-3 h-3 bg-primary border-2 border-white"
      />
    </div>
  );
});

TriggerNode.displayName = 'TriggerNode';
