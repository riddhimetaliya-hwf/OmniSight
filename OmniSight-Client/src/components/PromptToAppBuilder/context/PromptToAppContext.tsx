
import React, { createContext, useContext, useState } from 'react';
import { AppDefinition, PromptHistory, PromptToAppContextType } from '../types';

const PromptToAppContext = createContext<PromptToAppContextType | undefined>(undefined);

export const PromptToAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<AppDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const addToHistory = (item: PromptHistory) => {
    setPromptHistory(prev => [item, ...prev.slice(0, 9)]);
  };

  const value = {
    prompt,
    setPrompt,
    isProcessing,
    setIsProcessing,
    generatedApp,
    setGeneratedApp,
    error,
    setError,
    promptHistory,
    addToHistory,
    isRecording,
    setIsRecording,
    showCode,
    setShowCode
  };

  return (
    <PromptToAppContext.Provider value={value}>
      {children}
    </PromptToAppContext.Provider>
  );
};

export const usePromptToApp = () => {
  const context = useContext(PromptToAppContext);
  if (context === undefined) {
    throw new Error('usePromptToApp must be used within a PromptToAppProvider');
  }
  return context;
};
