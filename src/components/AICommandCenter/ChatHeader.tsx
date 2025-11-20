
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, MessageSquare } from "lucide-react";

interface ChatHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleDisplayMode: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  isDarkMode, 
  onToggleDarkMode, 
  onToggleDisplayMode 
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h3 className="font-medium">OmniSight AI</h3>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" onClick={onToggleDarkMode}>
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleDisplayMode}>
          <MessageSquare size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
