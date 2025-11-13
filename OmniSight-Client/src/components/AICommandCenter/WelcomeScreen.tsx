
import React from "react";
import { MessageSquare } from "lucide-react";
import SuggestedPrompts from "./SuggestedPrompts";

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
      <MessageSquare size={48} className="opacity-50" />
      <p>How can I help you today?</p>
      <SuggestedPrompts onSelectPrompt={onSelectPrompt} />
    </div>
  );
};

export default WelcomeScreen;
