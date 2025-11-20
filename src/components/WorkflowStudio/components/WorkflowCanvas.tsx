
import React, { useEffect, useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { useNodeSelection } from '../hooks/useNodeSelection';
import { ReactFlow, Background, Controls, MiniMap, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../styles.css';

// Node types
import { TriggerNode } from './nodes/TriggerNode';
import { ActionNode } from './nodes/ActionNode';
import { ConditionNode } from './nodes/ConditionNode';
import { WorkflowSimulationControls } from './WorkflowSimulationControls';

interface WorkflowCanvasProps {
  isReadOnly?: boolean;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ isReadOnly = false }) => {
  const { 
    workflow, 
    actions,
    simulating,
    simulationProgress,
    simulationPaused,
    handleStartSimulation,
    handlePauseSimulation,
    stopSimulation
  } = useWorkflow();
  
  const { handleNodeClick } = useNodeSelection();
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  // Define node types for ReactFlow
  const nodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
    condition: ConditionNode,
  };
  
  // Custom handlers for node and edge deletion
  const handleNodesDelete = (nodes: any) => {
    // This can be implemented if needed
  };
  
  const handleEdgesDelete = (edges: any) => {
    // This can be implemented if needed
  };
  
  return (
    <div className="h-full w-full flex-1 relative">
      <ReactFlow
        nodes={workflow.nodes}
        edges={workflow.edges}
        onNodesChange={isReadOnly ? undefined : actions.onNodesChange}
        onEdgesChange={isReadOnly ? undefined : actions.onEdgesChange}
        onConnect={isReadOnly ? undefined : actions.onConnect}
        onNodeClick={(_, node) => !isReadOnly && handleNodeClick(node.id)}
        nodeTypes={nodeTypes}
        fitView
        onInit={setReactFlowInstance}
        deleteKeyCode={['Backspace', 'Delete']}
        onNodesDelete={handleNodesDelete}
        onEdgesDelete={handleEdgesDelete}
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background gap={16} size={1} />
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable
          pannable
          position="bottom-right"
        />
        
        {simulating && (
          <Panel position="top-left" className="bg-background/80 p-2 rounded-md shadow-md border backdrop-blur-sm">
            <WorkflowSimulationControls
              simulating={simulating}
              progress={simulationProgress}
              paused={simulationPaused}
              onPause={handlePauseSimulation}
              onResume={handleStartSimulation}
              onStop={stopSimulation}
            />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;
