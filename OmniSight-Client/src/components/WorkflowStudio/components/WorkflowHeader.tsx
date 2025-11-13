
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Save, 
  Settings, 
  MoreHorizontal,
  Download,
  Upload
} from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WorkflowHeaderProps {
  onNewWorkflow: () => void;
  onSaveWorkflow: () => void;
  extraActions?: React.ReactNode;
}

export const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  onNewWorkflow,
  onSaveWorkflow,
  extraActions
}) => {
  const { workflow, actions } = useWorkflow();
  const [isEditing, setIsEditing] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setName(e.target.value);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const exportWorkflow = () => {
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${workflow.name.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="border-b bg-card p-4 flex justify-between items-center flex-wrap gap-3">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold">Workflow Studio</h2>
        
        {isEditing ? (
          <Input
            value={workflow.name}
            onChange={handleNameChange}
            className="w-64"
            onBlur={toggleEditing}
            autoFocus
          />
        ) : (
          <div 
            className="text-lg font-medium cursor-pointer hover:text-primary transition-colors"
            onClick={toggleEditing}
          >
            {workflow.name}
          </div>
        )}
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {extraActions}
        <Button variant="outline" onClick={onNewWorkflow}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New
        </Button>
        <Button onClick={onSaveWorkflow}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Workflow Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportWorkflow}>
              <Download className="h-4 w-4 mr-2" />
              Export Workflow
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Upload className="h-4 w-4 mr-2" />
              Import Workflow
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Workflow Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
