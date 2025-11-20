
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send } from "lucide-react";
import { useVoiceInput } from "./useVoiceInput";

interface ChatInputProps {
  onSubmit: (input: string) => void;
  isDarkMode: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isDarkMode }) => {
  const [input, setInput] = useState("");

  const handleInputReceived = (voiceInput: string) => {
    setInput(voiceInput);
  };

  const { isRecording, toggleRecording } = useVoiceInput(handleInputReceived);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    onSubmit(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        placeholder="Ask a question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={`flex-grow rounded-omni-sm ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={`rounded-full ${isRecording ? "text-omni-error border-omni-error animate-pulse" : ""}`}
        onClick={toggleRecording}
      >
        {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
      </Button>
      <Button 
        type="submit" 
        variant="default" 
        size="icon"
        className="rounded-full bg-gradient-to-r from-omni-accent-from to-omni-accent-to"
      >
        <Send size={18} />
      </Button>
    </form>
  );
};

export default ChatInput;
