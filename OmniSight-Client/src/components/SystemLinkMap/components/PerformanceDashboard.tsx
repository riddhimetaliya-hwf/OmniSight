import React from 'react';
import { SystemNode, SystemEdge } from '../types';

interface PerformanceDashboardProps {
  systems: SystemNode[];
  edges: SystemEdge[];
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ systems, edges }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Performance Dashboard</h3>
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">
          System performance metrics
        </div>
        <div className="text-xs">
          Systems: {systems.length}
        </div>
        <div className="text-xs">
          Data flows: {edges.length}
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard; 