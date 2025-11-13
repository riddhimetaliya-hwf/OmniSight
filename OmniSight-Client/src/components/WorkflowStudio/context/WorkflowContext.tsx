
import React, { createContext, useContext, useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { useNodeOperations } from '../hooks/useNodeOperations';
import { useEdgeOperations } from '../hooks/useEdgeOperations';
import { useWorkflowOperations } from '../hooks/useWorkflowOperations';
import { useWorkflowSimulation } from '../hooks/useWorkflowSimulation';

// Context type definition
interface WorkflowContextType {
  workflow: {
    nodes: Node[];
    edges: Edge[];
    name: string;
    description: string;
    version: string;
    lastSaved: Date | null;
    isModified: boolean;
  };
  actions: {
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
    onConnect: (connection: any) => void;
    addNode: (nodeData: any, position: { x: number; y: number }) => any;
    updateNode: (id: string, data: any) => void;
    deleteNode: (id: string) => void;
    setName: (name: string) => void;
    setDescription: (description: string) => void;
    loadTemplate: (templateId: string) => void;
    clearWorkflow: () => void;
    saveWorkflow: () => void;
  };
  simulating: boolean;
  simulationProgress: number;
  simulationPaused: boolean;
  handleStartSimulation: () => void;
  handlePauseSimulation: () => void;
  stopSimulation: () => void;
}

// Create context
const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// Provider component
export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [name, setName] = useState<string>('New Workflow');
  const [description, setDescription] = useState<string>('');
  const [version, setVersion] = useState<string>('1.0.0');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isModified, setIsModified] = useState<boolean>(false);

  // Use custom hooks
  const { onNodesChange, addNode, updateNode, deleteNode } = useNodeOperations(nodes, setNodes);
  const { onEdgesChange, onConnect } = useEdgeOperations(edges, setEdges);
  const { loadTemplate, clearWorkflow } = useWorkflowOperations(setNodes, setEdges, setName, setDescription);
  
  const { 
    simulating, 
    simulationProgress, 
    simulationPaused,
    handleStartSimulation,
    handlePauseSimulation,
    stopSimulation
  } = useWorkflowSimulation();

  // Set isModified to true when nodes or edges change
  React.useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      setIsModified(true);
    }
  }, [nodes, edges]);

  const saveWorkflow = () => {
    setLastSaved(new Date());
    setIsModified(false);
    // This could be expanded to save to backend or local storage
  };

  const handleSetName = (newName: string) => {
    setName(newName);
    setIsModified(true);
  };

  const handleSetDescription = (newDesc: string) => {
    setDescription(newDesc);
    setIsModified(true);
  };

  const value = {
    workflow: {
      nodes,
      edges,
      name,
      description,
      version,
      lastSaved,
      isModified
    },
    actions: {
      onNodesChange,
      onEdgesChange,
      onConnect,
      addNode,
      updateNode,
      deleteNode,
      setName: handleSetName,
      setDescription: handleSetDescription,
      loadTemplate,
      clearWorkflow,
      saveWorkflow,
    },
    simulating,
    simulationProgress,
    simulationPaused,
    handleStartSimulation,
    handlePauseSimulation,
    stopSimulation
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

// Custom hook to use the workflow context
export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
