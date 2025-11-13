import React from "react";
import { N8NIframeBuilder } from "./N8NIframeBuilder";

interface WorkflowBuilderProps {
  workflowId: string;
  workflowName: string;
  workflowDescription: string;
  onSaveSuccess: () => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = (props) => {
  return <N8NIframeBuilder {...props} />;
};