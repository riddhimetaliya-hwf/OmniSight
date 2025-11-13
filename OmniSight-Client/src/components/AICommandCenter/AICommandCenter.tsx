
import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import AIResponse from "./AIResponse";
import { useConversation } from "./useConversation";
import ChatInput from "./ChatInput";
import ActionButtons from "./ActionButtons";
import ChatHeader from "./ChatHeader";
import MinimizedButton from "./MinimizedButton";
import ThinkingIndicator from "./ThinkingIndicator";
import WelcomeScreen from "./WelcomeScreen";

const AICommandCenter: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<"expanded" | "minimized">("minimized");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isThinking, 
    addUserMessage, 
    simulateResponse, 
    copyToClipboard, 
    exportResults 
  } = useConversation();

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (input: string) => {
    addUserMessage(input);
    simulateResponse(input);
  };

  const toggleDisplayMode = () => {
    setDisplayMode(prev => prev === "minimized" ? "expanded" : "minimized");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div 
      className={`fixed ${displayMode === "minimized" ? "bottom-6 right-6 w-16 h-16" : "bottom-6 right-6 w-96 h-[600px]"} 
                  transition-all duration-300 ease-in-out z-40`}
    >
      {displayMode === "minimized" ? (
        <MinimizedButton onClick={toggleDisplayMode} />
      ) : (
        <Card className={`w-full h-full flex flex-col shadow-omni-hover border rounded-omni-lg overflow-hidden
                          ${isDarkMode ? "bg-omni-deep-indigo text-white border-slate-700" : "bg-white text-slate-800 border-slate-200"}`}>
          <ChatHeader 
            isDarkMode={isDarkMode} 
            onToggleDarkMode={toggleDarkMode} 
            onToggleDisplayMode={toggleDisplayMode} 
          />
          
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <WelcomeScreen onSelectPrompt={handleSubmit} />
            ) : (
              messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <AIResponse message={message} />
                </div>
              ))
            )}
            {isThinking && <ThinkingIndicator />}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-border">
            <ChatInput onSubmit={handleSubmit} isDarkMode={isDarkMode} />
            
            {messages.length > 0 && (
              <ActionButtons 
                onCopyToClipboard={copyToClipboard} 
                onExportResults={exportResults} 
              />
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AICommandCenter;
