
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OmniVoiceContextProps {
  isVoiceEnabled: boolean;
  toggleVoiceEnabled: () => void;
}

const OmniVoiceContext = createContext<OmniVoiceContextProps | undefined>(undefined);

export const OmniVoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(false);

  const toggleVoiceEnabled = () => {
    setIsVoiceEnabled(prev => !prev);
  };

  return (
    <OmniVoiceContext.Provider
      value={{
        isVoiceEnabled,
        toggleVoiceEnabled
      }}
    >
      {children}
    </OmniVoiceContext.Provider>
  );
};

export const useOmniPromptBar = () => {
  const context = useContext(OmniVoiceContext);
  if (context === undefined) {
    throw new Error('useOmniPromptBar must be used within an OmniVoiceProvider');
  }
  return context;
};
