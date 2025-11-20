import React from 'react';
import { Node, Edge, SystemMapFilter } from '../types';

interface ExportPanelProps {
  nodes: Node[];
  edges: Edge[];
  filters: SystemMapFilter;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ nodes, edges, filters }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Export</h3>
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">
          Export system map data
        </div>
        <div className="text-xs">
          Nodes: {nodes.length}
        </div>
        <div className="text-xs">
          Edges: {edges.length}
        </div>
      </div>
    </div>
  );
};

export default ExportPanel; 