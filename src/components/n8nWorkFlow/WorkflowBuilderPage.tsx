import { useLocation, useNavigate, useParams } from "react-router-dom";
import { WorkflowBuilder } from "@/components/n8nWorkFlow/components/WorkflowBuilder";
import { useEffect } from "react";

const WorkflowBuilderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  
  // Get workflow data from location state or URL params
  const { 
    workflowId = params.workflowId, 
    workflowName = "Untitled Workflow", 
    workflowDescription = "" 
  } = location.state || {};

  const handleSaveSuccess = () => {
    navigate("/workflows");
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  // Redirect if no workflowId is provided
  useEffect(() => {
    if (!workflowId) {
      console.warn('No workflowId provided, redirecting to home');
      navigate("/");
    }
  }, [workflowId, navigate]);

  if (!workflowId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">No Workflow Selected</h2>
          <p className="text-muted-foreground mb-4">Redirecting to workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      <WorkflowBuilder
        workflowId={workflowId}
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        onSaveSuccess={handleSaveSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default WorkflowBuilderPage;