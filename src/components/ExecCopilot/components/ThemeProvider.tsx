
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ExecutiveRole = 'CEO' | 'CFO' | 'CTO' | 'COO' | 'CHRO';
export type ThemeMode = 'light';

interface ThemeContextType {
  role: ExecutiveRole;
  themeMode: ThemeMode;
  setRole: (role: ExecutiveRole) => void;
  setThemeMode: (mode: ThemeMode) => void;
  brandingEnabled: boolean;
  setBrandingEnabled: (enabled: boolean) => void;
  companyLogo?: string;
  setCompanyLogo: (logo: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useExecutiveTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useExecutiveTheme must be used within ExecutiveThemeProvider');
  }
  return context;
};

interface ExecutiveThemeProviderProps {
  children: React.ReactNode;
}

export const ExecutiveThemeProvider: React.FC<ExecutiveThemeProviderProps> = ({ children }) => {
  const [role, setRole] = useState<ExecutiveRole>('CEO');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [brandingEnabled, setBrandingEnabled] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string>('');

  useEffect(() => {
    // Apply light theme classes to document
    const body = document.body;
    body.className = body.className.replace(/theme-\w+/g, '');
    body.className = body.className.replace(/executive-dark/g, '');
    
    // Always use light theme
    body.classList.add('theme-light');

    // Apply role-specific gradient classes
    body.className = body.className.replace(/gradient-\w+/g, '');
    body.classList.add(`gradient-${role.toLowerCase()}`);
  }, [role, themeMode]);

  return (
    <ThemeContext.Provider value={{
      role,
      themeMode,
      setRole,
      setThemeMode,
      brandingEnabled,
      setBrandingEnabled,
      companyLogo,
      setCompanyLogo
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
