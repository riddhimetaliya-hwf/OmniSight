
import React from "react";
import { Button } from "@/components/ui/button";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  const prompts = [
    "How's our revenue trend this month?",
    "Show sales by product for Q1",
    "Compare this quarter to last year",
    "What's our customer retention rate?",
    "Send the quarterly report to the Finance team"
  ];

  return (
    <div className="w-full max-w-sm space-y-2">
      <p className="text-sm font-medium">Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, idx) => (
          <Button 
            key={idx} 
            variant="outline" 
            size="sm"
            className="text-xs truncate max-w-full"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;
