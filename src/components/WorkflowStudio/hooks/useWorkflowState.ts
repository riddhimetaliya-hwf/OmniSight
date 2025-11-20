
import { useState, useCallback } from 'react';
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowTemplate } from '../types';
import { prebuiltTemplates } from '../data/templates';

export const useWorkflowState = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [name, setName] = useState<string>('New Workflow');
  const [description, setDescription] = useState<string>('');

  // Node operations
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
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
    [setNodes]
  );

  const updateNode = useCallback(
    (id: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...data } } : node))
      );
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
    },
    [setNodes]
  );

  // Edge operations
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: any) => {
      const newEdge = {
        id: `e-${uuidv4()}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
      };
      setEdges((eds) => [...eds, newEdge]);
    },
    [setEdges]
  );

  // Workflow operations
  const loadTemplate = useCallback(
    (templateId: string) => {
      const template = prebuiltTemplates.find((t) => t.id === templateId);
      if (template) {
        setName(template.name);
        setDescription(template.description);
        setNodes(template.nodes);
        setEdges(template.edges);
      }
    },
    [setNodes, setEdges, setName, setDescription]
  );

  const clearWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setName('New Workflow');
    setDescription('');
  }, [setNodes, setEdges, setName, setDescription]);

  return {
    workflow: {
      nodes,
      edges,
      name,
      description,
    },
    actions: {
      onNodesChange,
      onEdgesChange,
      onConnect,
      addNode,
      updateNode,
      deleteNode,
      setName,
      setDescription,
      loadTemplate,
      clearWorkflow,
    },
  };
};
