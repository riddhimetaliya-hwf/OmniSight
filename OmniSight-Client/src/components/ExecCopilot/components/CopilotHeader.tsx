
import React from 'react';
import { Sparkles } from 'lucide-react';

const CopilotHeader: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="bg-primary/20 p-1.5 rounded-md mr-3">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-medium text-sm">Executive Copilot</h3>
        <p className="text-xs text-muted-foreground">Your AI assistant</p>
      </div>
    </div>
  );
};

export default CopilotHeader;
