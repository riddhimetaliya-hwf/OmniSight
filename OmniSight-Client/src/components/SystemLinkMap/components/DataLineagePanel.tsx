import React from 'react';
import { DataLineage, SystemNode } from '../types';

interface DataLineagePanelProps {
  lineage: DataLineage[];
  systems: SystemNode[];
}

const DataLineagePanel: React.FC<DataLineagePanelProps> = ({ lineage, systems }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Data Lineage</h3>
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">
          Data flow tracking and quality metrics
        </div>
        <div className="text-xs">
          Lineage paths: {lineage.length}
        </div>
      </div>
    </div>
  );
};

export default DataLineagePanel; 