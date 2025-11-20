
import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { prebuiltTemplates } from '../data/templates';

export const useWorkflowOperations = (
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  setName: React.Dispatch<React.SetStateAction<string>>,
  setDescription: React.Dispatch<React.SetStateAction<string>>
) => {
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
    loadTemplate,
    clearWorkflow
  };
};
