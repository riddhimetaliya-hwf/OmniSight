
import React from 'react';
import { NodeSection } from './NodeSection';
import { NodeDefinition, triggerNodes, actionNodes, conditionNodes, aiNodes } from './nodeData';
import { Zap, Activity, GitBranch, BrainCircuit } from 'lucide-react';

interface BlocksTabContentProps {
  searchTerm: string;
}

export const BlocksTabContent: React.FC<BlocksTabContentProps> = ({ searchTerm }) => {
  // Filter nodes based on search term
  const filterNodes = (nodes: NodeDefinition[]): NodeDefinition[] => {
    if (!searchTerm) return nodes;
    return nodes.filter((node) => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (node.description && node.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (node.category && node.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredTriggerNodes = filterNodes(triggerNodes);
  const filteredActionNodes = filterNodes(actionNodes);
  const filteredConditionNodes = filterNodes(conditionNodes);
  const filteredAINodes = filterNodes(aiNodes);

  return (
    <div className="p-4 mt-0">
      <div className="space-y-6">
        <NodeSection
          title="Triggers"
          icon={<Zap className="h-4 w-4 mr-2" />}
          nodes={triggerNodes}
          filteredNodes={filteredTriggerNodes}
        />
        
        <NodeSection
          title="Actions"
          icon={<Activity className="h-4 w-4 mr-2" />}
          nodes={actionNodes}
          filteredNodes={filteredActionNodes}
        />
        
        <NodeSection
          title="Conditions"
          icon={<GitBranch className="h-4 w-4 mr-2" />}
          nodes={conditionNodes}
          filteredNodes={filteredConditionNodes}
        />
        
        <NodeSection
          title="AI Blocks"
          icon={<BrainCircuit className="h-4 w-4 mr-2" />}
          nodes={aiNodes}
          filteredNodes={filteredAINodes}
          badgeText="New"
          badgeClass="bg-purple-100 text-purple-800 border-purple-300"
        />
      </div>
    </div>
  );
};
