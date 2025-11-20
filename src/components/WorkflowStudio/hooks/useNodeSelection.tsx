
import { useState, useEffect, useCallback } from 'react';
import { useWorkflow } from '../context/WorkflowContext';

export function useNodeSelection(initialNode: string | null = null, onNodeSelect: (nodeId: string | null) => void = () => {}) {
  const { actions } = useWorkflow();
  const [selectedNode, setSelectedNode] = useState<string | null>(initialNode);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
    onNodeSelect(nodeId);
  }, [onNodeSelect]);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    onNodeSelect(null);
  }, [onNodeSelect]);

  // Add keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedNode) {
        actions.deleteNode(selectedNode);
        setSelectedNode(null);
        onNodeSelect(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode, actions, onNodeSelect]);

  return {
    selectedNode,
    setSelectedNode,
    handleNodeClick,
    handlePaneClick
  };
}
