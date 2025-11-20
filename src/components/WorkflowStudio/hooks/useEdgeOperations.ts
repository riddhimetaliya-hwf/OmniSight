
import { useCallback } from 'react';
import { Edge, EdgeChange, applyEdgeChanges } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

export const useEdgeOperations = (
  edges: Edge[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) => {
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

  return {
    onEdgesChange,
    onConnect
  };
};
