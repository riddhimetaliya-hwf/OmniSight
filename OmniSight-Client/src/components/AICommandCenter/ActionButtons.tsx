
import React from "react";
import { Button } from "@/components/ui/button";
import { Clipboard, Download } from "lucide-react";

interface ActionButtonsProps {
  onCopyToClipboard: () => void;
  onExportResults: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onCopyToClipboard, 
  onExportResults 
}) => {
  return (
    <div className="flex justify-end mt-2 space-x-1">
      <Button variant="ghost" size="sm" onClick={onCopyToClipboard}>
        <Clipboard size={14} className="mr-1" />
        Copy
      </Button>
      <Button variant="ghost" size="sm" onClick={onExportResults}>
        <Download size={14} className="mr-1" />
        Export
      </Button>
    </div>
  );
};

export default ActionButtons;
