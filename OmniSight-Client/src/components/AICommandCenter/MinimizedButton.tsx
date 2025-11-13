
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface MinimizedButtonProps {
  onClick: () => void;
}

const MinimizedButton: React.FC<MinimizedButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="w-16 h-16 rounded-full shadow-omni-hover bg-gradient-to-r from-omni-accent-from to-omni-accent-to hover:shadow-omni-button text-white"
      size="icon"
    >
      <MessageSquare size={24} />
    </Button>
  );
};

export default MinimizedButton;
