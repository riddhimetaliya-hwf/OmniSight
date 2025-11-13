
import { Node, Edge } from '@xyflow/react';

export interface SimulationPath {
  nodeId: string;
  delay: number;
}

export const generateNodePath = (startNodeId: string, nodes: Node[], edges: Edge[]): SimulationPath[] => {
  // This is a simplified path generation
  // In a real implementation, this would handle branches, conditions, etc.
  const path: SimulationPath[] = [];
  let currentNodeId = startNodeId;
  
  // Add the start node
  path.push({ nodeId: currentNodeId, delay: 1000 });
  
  // Find connected nodes in sequence
  let safety = 0;
  while (safety < 20) { // Prevent infinite loops
    const outgoingEdges = edges.filter(edge => edge.source === currentNodeId);
    
    if (outgoingEdges.length === 0) break;
    
    // For simplicity, just follow the first edge
    const nextEdge = outgoingEdges[0];
    currentNodeId = nextEdge.target;
    
    // Add the node to path
    path.push({ nodeId: currentNodeId, delay: 1000 });
    
    safety++;
  }
  
  return path;
};
