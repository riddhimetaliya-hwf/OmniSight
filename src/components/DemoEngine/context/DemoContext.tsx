
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DemoPersona, DemoContextType } from '../types';
import { loadPersonaData } from '../data/dataLoader';
import { useToast } from '@/hooks/use-toast';

const initialPersona: DemoPersona = 'CEO';

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [activePersona, setActivePersona] = useState<DemoPersona>(initialPersona);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Effect to load data when persona changes
  useEffect(() => {
    if (isActive) {
      loadPersonaData(activePersona);
    }
  }, [isActive, activePersona]);

  const activateDemo = async () => {
    setIsLoading(true);
    
    try {
      // Load initial persona data
      await loadPersonaData(initialPersona);
      setIsActive(true);
      
      toast({
        title: "Demo Mode Activated",
        description: `Viewing OmniSight as ${initialPersona}`,
      });
    } catch (error) {
      toast({
        title: "Failed to load demo data",
        description: "There was an error loading the demo data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateDemo = () => {
    setIsActive(false);
    toast({
      title: "Demo Mode Deactivated",
      description: "Returned to your normal workspace",
    });
  };

  const switchPersona = async (persona: DemoPersona) => {
    setIsLoading(true);
    
    try {
      await loadPersonaData(persona);
      setActivePersona(persona);
      
      toast({
        title: "Persona Switched",
        description: `Now viewing as ${persona}`,
      });
    } catch (error) {
      toast({
        title: "Failed to switch persona",
        description: "There was an error loading the persona data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetDemo = async () => {
    setIsLoading(true);
    
    try {
      // Reset to initial persona and reload data
      await loadPersonaData(initialPersona);
      setActivePersona(initialPersona);
      
      toast({
        title: "Demo Reset",
        description: "Demo data has been reset to its initial state",
      });
    } catch (error) {
      toast({
        title: "Failed to reset demo",
        description: "There was an error resetting the demo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DemoContext.Provider
      value={{
        isActive,
        isLoading,
        activePersona,
        activateDemo,
        deactivateDemo,
        switchPersona,
        resetDemo,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};
