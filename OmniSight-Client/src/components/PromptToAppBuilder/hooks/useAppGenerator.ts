
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePromptToApp } from '../context/PromptToAppContext';
import { AppDefinition } from '../types';
import { useToast } from '@/hooks/use-toast';
import { generateMockApp } from '../data/mockData';

export const useAppGenerator = () => {
  const { 
    prompt, 
    isProcessing, 
    setIsProcessing, 
    generatedApp, 
    setGeneratedApp, 
    error, 
    setError,
    addToHistory
  } = usePromptToApp();
  const { toast } = useToast();

  const generateApp = async (promptText: string) => {
    if (!promptText.trim()) {
      setError('Please provide a description of the app you want to create');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // In a real application, this would make a call to an LLM API
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Use mock data for now
      const appData = generateMockApp(promptText);
      setGeneratedApp(appData);
      
      // Add to prompt history
      addToHistory({
        id: uuidv4(),
        prompt: promptText,
        timestamp: new Date(),
        appId: appData.id
      });

      toast({
        title: "App generated",
        description: "Your application has been created based on your description",
      });
    } catch (err) {
      setError('Failed to generate app. Please try again with a more specific description.');
      
      toast({
        title: "Error",
        description: "Failed to generate app. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const regenerateApp = () => {
    if (!prompt) {
      setError('No previous prompt to regenerate');
      return;
    }
    
    generateApp(prompt);
  };

  const clearApp = () => {
    setGeneratedApp(null);
    setError(null);
  };

  return {
    generatedApp,
    isProcessing,
    error,
    generateApp,
    regenerateApp,
    clearApp
  };
};
