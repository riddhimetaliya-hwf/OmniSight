import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CreateWorkflowButtonProps {
  onClick: () => void;
}

export const CreateWorkflowButton = ({ onClick }: CreateWorkflowButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity shadow-lg"
      size="lg"
    >
      <Plus className="w-5 h-5 mr-2" />
      Create your Workflow
    </Button>
  );
};