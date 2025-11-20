import React from 'react';
import { NetworkAnalysis, SystemNode } from '../types';

interface NetworkAnalysisPanelProps {
  analysis: NetworkAnalysis;
  systems: SystemNode[];
}

const NetworkAnalysisPanel: React.FC<NetworkAnalysisPanelProps> = ({ analysis, systems }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Network Analysis</h3>
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">
          Centrality scores and network metrics
        </div>
        <div className="text-xs">
          Clusters: {analysis.clusters.length}
        </div>
        <div className="text-xs">
          Critical paths: {analysis.criticalPaths.length}
        </div>
        <div className="text-xs">
          Bottlenecks: {analysis.bottlenecks.length}
        </div>
      </div>
    </div>
  );
};

export default NetworkAnalysisPanel; 