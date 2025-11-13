
import { useState } from "react";
import { Message } from "./types";
import { useToast } from "@/hooks/use-toast";

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const { toast } = useToast();

  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
  };

  const simulateResponse = (userInput: string) => {
    setIsThinking(true);
    
    // Simulate AI response after delay
    setTimeout(() => {
      const mockResponse: Message = {
        role: "assistant",
        content: `Here's a response to your query: "${userInput}"`,
        timestamp: new Date(),
        format: "text",
      };
      
      setMessages((prev) => [...prev, mockResponse]);
      setIsThinking(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    if (messages.length === 0) return;
    
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
    if (lastAssistantMessage) {
      navigator.clipboard.writeText(lastAssistantMessage.content);
      toast({
        title: "Copied to clipboard",
        description: "The last response has been copied to your clipboard",
      });
    }
  };

  const exportResults = () => {
    if (messages.length === 0) return;
    
    const content = messages.map(m => `${m.role.toUpperCase()} (${new Date(m.timestamp).toLocaleTimeString()}): ${m.content}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Conversation exported",
      description: "Your conversation has been downloaded as a text file",
    });
  };

  return {
    messages,
    isThinking,
    addUserMessage,
    simulateResponse,
    copyToClipboard,
    exportResults
  };
}
