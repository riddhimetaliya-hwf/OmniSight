
import { useState, useCallback } from 'react';
import { Node, NodeChange, applyNodeChanges } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

export const useNodeOperations = (
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const addNode = useCallback(
    (nodeData: any, position: { x: number; y: number }) => {
      const newNode = {
        id: `node-${uuidv4()}`,
        type: nodeData.type,
        position,
        data: { ...nodeData.data, label: nodeData.label },
      };
      setNodes((nds) => [...nds, newNode]);
      return newNode;
    },
    []
  );

  const updateNode = useCallback(
    (id: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...data } } : node))
      );
    },
    []
  );

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
    },
    []
  );

  return {
    onNodesChange,
    addNode,
    updateNode,
    deleteNode
  };
};
