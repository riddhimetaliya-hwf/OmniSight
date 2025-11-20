
import { useState, useEffect, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { generateNodePath } from '../components/simulation/SimulationService';

export function useWorkflowSimulation(nodes: Node[] = [], edges: Edge[] = []) {
  const [simulating, setSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationPaused, setSimulationPaused] = useState(false);
  const [simulationPath, setSimulationPath] = useState<{ nodeId: string; delay: number }[]>([]);
  const [modifiedNodes, setModifiedNodes] = useState<Node[]>(nodes);
  const [modifiedEdges, setModifiedEdges] = useState<Edge[]>(edges);

  // Update modified nodes and edges when the props change
  useEffect(() => {
    setModifiedNodes(nodes);
    setModifiedEdges(edges);
  }, [nodes, edges]);

  const handleStartSimulation = useCallback(() => {
    if (nodes.length === 0) return;
    
    // Find the first node (usually a trigger)
    const startNode = nodes.find(node => node.type === 'trigger') || nodes[0];
    
    // Generate a path through the workflow
    const path = generateNodePath(startNode.id, nodes, edges);
    
    setSimulationPath(path);
    setSimulationProgress(0);
    setSimulationPaused(false);
    setSimulating(true);
    
    // Highlight nodes in the path
    const highlightedNodes = nodes.map(node => ({
      ...node,
      // Add styles for nodes in the path
      style: {
        ...node.style,
        // If node is in path, add a subtle glow or border
        ...(path.some(p => p.nodeId === node.id) ? { 
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
        } : {})
      }
    }));
    
    setModifiedNodes(highlightedNodes);
    
    // Highlight edges too
    const highlightedEdges = edges.map(edge => ({
      ...edge,
      animated: true // Make all edges animated during simulation
    }));
    
    setModifiedEdges(highlightedEdges);
  }, [nodes, edges]);

  const handleTogglePause = useCallback(() => {
    setSimulationPaused(p => !p);
  }, []);

  const stopSimulation = useCallback(() => {
    setSimulating(false);
    setSimulationProgress(0);
    setSimulationPaused(false);
    
    // Restore original nodes and edges
    setModifiedNodes(nodes);
    setModifiedEdges(edges);
  }, [nodes, edges]);

  // Run simulation effect
  useEffect(() => {
    if (!simulating || simulationPaused) return;
    
    let currentProgress = 0;
    const totalSteps = simulationPath.length;
    
    if (totalSteps === 0) {
      stopSimulation();
      return;
    }
    
    const interval = setInterval(() => {
      currentProgress++;
      setSimulationProgress(Math.round((currentProgress / totalSteps) * 100));
      
      if (currentProgress >= totalSteps) {
        clearInterval(interval);
        // Wait a bit then stop simulation
        setTimeout(() => {
          stopSimulation();
        }, 1000);
      }
    }, 1500); // Advance every 1.5 seconds
    
    return () => clearInterval(interval);
  }, [simulating, simulationPaused, simulationPath, stopSimulation]);

  return {
    simulating,
    simulationProgress,
    simulationPaused,
    handleStartSimulation,
    handleTogglePause,
    stopSimulation,
    modifiedNodes,
    modifiedEdges
  };
}
