import { useLocation, useNavigate } from "react-router-dom";
import { WorkflowBuilder } from "@/components/n8nWorkFlow/components/WorkflowBuilder";

export default function WorkflowBuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { workflowId, workflowName, workflowDescription } = location.state || {};

  const handleSaveSuccess = () => {
    navigate("/");
  };

  if (!workflowId) {
    navigate("/");
    return null;
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      <WorkflowBuilder
        workflowId={workflowId}
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}
