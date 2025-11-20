
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { SystemNode as SystemNodeType } from '../types';
import { Building, Users, CreditCard, BarChart, Package, Database } from 'lucide-react';

interface SystemNodeProps {
  data: SystemNodeType;
  selected: boolean;
}

const SystemNode: React.FC<SystemNodeProps> = ({ data, selected }) => {
  const { label, type, status } = data;
  
  const getBgColor = () => {
    switch (type) {
      case 'erp': return 'bg-blue-100 border-blue-300';
      case 'crm': return 'bg-green-100 border-green-300';
      case 'hr': return 'bg-purple-100 border-purple-300';
      case 'marketing': return 'bg-orange-100 border-orange-300';
      case 'finance': return 'bg-yellow-100 border-yellow-300';
      case 'operations': return 'bg-pink-100 border-pink-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'erp': return <Building className="h-6 w-6 text-blue-600" />;
      case 'crm': return <Users className="h-6 w-6 text-green-600" />;
      case 'hr': return <Users className="h-6 w-6 text-purple-600" />;
      case 'marketing': return <BarChart className="h-6 w-6 text-orange-600" />;
      case 'finance': return <CreditCard className="h-6 w-6 text-yellow-600" />;
      case 'operations': return <Package className="h-6 w-6 text-pink-600" />;
      default: return <Database className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <div className={`w-44 ${getBgColor()} p-3 rounded-md shadow-md border-2 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle type="target" position={Position.Top} className="bg-gray-400 w-3 h-1.5 rounded-sm border-none" />
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <div className="font-medium text-sm">{label}</div>
        </div>
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} title={`Status: ${status}`} />
      </div>
      
      {data.metrics && data.metrics.length > 0 && (
        <div className="bg-white bg-opacity-80 p-1.5 rounded text-xs mt-2">
          {data.metrics.slice(0, 2).map((metric, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="text-gray-700">{metric.name}</span>
              <div className="flex items-center">
                <span>{metric.value}</span>
                {metric.trend && (
                  <span className={`ml-1 ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="bg-gray-400 w-3 h-1.5 rounded-sm border-none" />
    </div>
  );
};

export default memo(SystemNode);
