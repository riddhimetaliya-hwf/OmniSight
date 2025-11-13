
// Supported executive personas
export type DemoPersona = 'CEO' | 'CFO' | 'COO' | 'CMO' | 'CHRO' | 'custom';

// Context type definition
export interface DemoContextType {
  isActive: boolean;
  isLoading: boolean;
  activePersona: DemoPersona;
  activateDemo: () => Promise<void>;
  deactivateDemo: () => void;
  switchPersona: (persona: DemoPersona) => Promise<void>;
  resetDemo: () => Promise<void>;
}

// Walkthrough step definition
export interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string; // CSS selector
  placement: 'top' | 'right' | 'bottom' | 'left' | 'center';
  action?: () => void;
}

// Mock data structure
export interface DemoPersonaData {
  command: {
    kpis: any[];
    snapshots: any[];
    alerts: any[];
    recommendations: any[];
  };
  insights: any[];
  workflows: any[];
  dashboards: any[];
  // Add more sections as needed
}
