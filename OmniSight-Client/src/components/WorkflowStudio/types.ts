
import { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  name: string;
  description: string;
}

export interface WorkflowActions {
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: any) => void;
  addNode: (nodeData: any, position: { x: number; y: number }) => Node;
  updateNode: (id: string, data: any) => void;
  deleteNode: (id: string) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  loadTemplate: (templateId: string) => void;
  clearWorkflow: () => void;
}

export interface WorkflowContextType {
  workflow: WorkflowState;
  actions: WorkflowActions;
  // Add simulation properties
  simulating: boolean;
  simulationProgress: number;
  simulationPaused: boolean;
  handleStartSimulation: () => void;
  handlePauseSimulation: () => void;
  stopSimulation: () => void;
  selectedNodeId?: string | null;
  setSelectedNodeId?: (id: string | null) => void;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: Node[];
  edges: Edge[];
}
