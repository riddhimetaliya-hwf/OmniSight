import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface CreateWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, description: string) => void;
}

export const CreateWorkflowDialog = ({ open, onOpenChange, onSave }: CreateWorkflowDialogProps) => {
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", description: "" });

  const validateForm = () => {
    const newErrors = { name: "", description: "" };
    let isValid = true;

    if (!workflowName.trim()) {
      newErrors.name = "Workflow name is required";
      isValid = false;
    } else if (workflowName.length < 3) {
      newErrors.name = "Workflow name must be at least 3 characters";
      isValid = false;
    }

    if (!workflowDescription.trim()) {
      newErrors.description = "Workflow description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(workflowName.trim(), workflowDescription.trim());
      setWorkflowName("");
      setWorkflowDescription("");
      setErrors({ name: "", description: "" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Workflow</DialogTitle>
          <DialogDescription>
            Give your workflow a name and description to get started
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-name">
              Workflow Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="workflow-name"
              placeholder="e.g., Customer Onboarding Flow"
              value={workflowName}
              onChange={(e) => {
                setWorkflowName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="workflow-description">
              Workflow Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="workflow-description"
              placeholder="Describe what this workflow does..."
              value={workflowDescription}
              onChange={(e) => {
                setWorkflowDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Workflow"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
