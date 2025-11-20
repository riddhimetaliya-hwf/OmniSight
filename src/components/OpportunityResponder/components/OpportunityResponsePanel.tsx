
import React, { useState } from "react";
import { Opportunity } from "../types";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOpportunity } from "../context/OpportunityContext";
import { mockWorkflows } from "../mockData";
import { 
  SendHorizonal, 
  AlertTriangle, 
  Users, 
  GitBranch 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OpportunityResponsePanelProps {
  opportunity: Opportunity;
  onClose: () => void;
}

const OpportunityResponsePanel: React.FC<OpportunityResponsePanelProps> = ({ 
  opportunity, 
  onClose 
}) => {
  const { respondToOpportunity } = useOpportunity();
  const { toast } = useToast();
  const [response, setResponse] = useState("");
  const [assignee, setAssignee] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] = useState("");

  const handleSubmitResponse = (actionType: string) => {
    if (!response && actionType !== "workflow") {
      toast({
        title: "Response required",
        description: "Please enter a response message before submitting",
        variant: "destructive",
      });
      return;
    }

    if (actionType === "assign" && !assignee) {
      toast({
        title: "Assignee required",
        description: "Please select an assignee",
        variant: "destructive",
      });
      return;
    }

    if (actionType === "workflow" && !selectedWorkflow) {
      toast({
        title: "Workflow required",
        description: "Please select a workflow to trigger",
        variant: "destructive",
      });
      return;
    }

    let responseText = response;
    
    if (actionType === "assign") {
      responseText = `Assigned to ${assignee}: ${response}`;
    } else if (actionType === "workflow") {
      const workflow = mockWorkflows.find(w => w.id === selectedWorkflow);
      responseText = `Triggered workflow: ${workflow?.name} - ${response}`;
    } else if (actionType === "escalate") {
      responseText = `Escalated: ${response}`;
    } else if (actionType === "notify") {
      responseText = `Notification sent: ${response}`;
    }

    respondToOpportunity(opportunity.id, responseText, actionType);
    
    toast({
      title: "Response submitted",
      description: `Your ${actionType} action has been recorded`,
    });
    
    onClose();
  };

  return (
    <div className="border-t p-4 bg-muted/20">
      <Tabs defaultValue="respond">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="respond" className="text-xs">
            <SendHorizonal className="h-3.5 w-3.5 mr-1" /> Respond
          </TabsTrigger>
          <TabsTrigger value="assign" className="text-xs">
            <Users className="h-3.5 w-3.5 mr-1" /> Assign
          </TabsTrigger>
          <TabsTrigger value="escalate" className="text-xs">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Escalate
          </TabsTrigger>
          <TabsTrigger value="workflow" className="text-xs">
            <GitBranch className="h-3.5 w-3.5 mr-1" /> Workflow
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="respond">
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button 
                size="sm"
                onClick={() => handleSubmitResponse("notify")}
              >
                Send Response
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="assign">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign to</label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alex-morgan">Alex Morgan (IT)</SelectItem>
                  <SelectItem value="jamie-rodriguez">Jamie Rodriguez (HR)</SelectItem>
                  <SelectItem value="taylor-chen">Taylor Chen (Support)</SelectItem>
                  <SelectItem value="dana-kim">Dana Kim (Operations)</SelectItem>
                  <SelectItem value="jordan-patel">Jordan Patel (Security)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              placeholder="Add instructions for assignee..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={3}
            />
            
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button 
                size="sm"
                onClick={() => handleSubmitResponse("assign")}
                disabled={!assignee}
              >
                Assign Task
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="escalate">
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md p-3 text-sm">
              <p className="text-amber-800 dark:text-amber-400">
                Escalation will notify senior management and create high-priority tracking.
              </p>
            </div>
            
            <Textarea
              placeholder="Provide escalation reason..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={3}
            />
            
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button 
                size="sm"
                variant="destructive"
                onClick={() => handleSubmitResponse("escalate")}
              >
                Escalate Issue
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="workflow">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Workflow</label>
              <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a workflow" />
                </SelectTrigger>
                <SelectContent>
                  {mockWorkflows.map(workflow => (
                    <SelectItem key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedWorkflow && (
                <p className="text-xs text-muted-foreground">
                  {mockWorkflows.find(w => w.id === selectedWorkflow)?.description}
                </p>
              )}
            </div>
            
            <Textarea
              placeholder="Add workflow instructions (optional)..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={3}
            />
            
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button 
                size="sm"
                onClick={() => handleSubmitResponse("workflow")}
                disabled={!selectedWorkflow}
                className="gap-2"
              >
                <GitBranch className="h-4 w-4" />
                Trigger Workflow
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OpportunityResponsePanel;
