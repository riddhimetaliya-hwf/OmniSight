
import React, { useState } from 'react';
import { DemoHeader } from './components/DemoHeader';
import { PersonaSwitcher } from './components/PersonaSwitcher';
import { DemoWalkthrough } from './components/DemoWalkthrough';
import { WalkthroughStep } from './types';
import { DemoProvider, useDemoContext } from './context/DemoContext';

interface DemoEngineContentProps {
  children: React.ReactNode;
}

const DemoEngineContent: React.FC<DemoEngineContentProps> = ({ children }) => {
  const { isActive, activePersona, resetDemo } = useDemoContext();
  const [showWalkthrough, setShowWalkthrough] = useState(true);

  // Skip if demo mode isn't active
  if (!isActive) return <>{children}</>;

  // Define walkthrough steps
  const walkthroughSteps: WalkthroughStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Demo Mode',
      description: 'You are now viewing OmniSight with sample enterprise data. Try switching between different executive personas to see personalized views.',
      placement: 'center',
    },
    {
      id: 'persona',
      title: 'Switch Personas',
      description: 'Use this menu to view the system as different executives with role-specific dashboards and insights.',
      targetElement: '.persona-switcher',
      placement: 'bottom',
    },
    {
      id: 'command',
      title: 'Try the Command Center',
      description: 'Each persona has a customized command center with relevant KPIs and priorities.',
      targetElement: '.command-link',
      placement: 'bottom',
    },
    {
      id: 'reset',
      title: 'Reset Demo',
      description: 'Click here anytime to reset the demo data to its initial state.',
      targetElement: '.reset-demo-button',
      placement: 'left',
    },
  ];

  return (
    <>
      <DemoHeader 
        activePersona={activePersona} 
        onReset={resetDemo} 
        onToggleWalkthrough={() => setShowWalkthrough(!showWalkthrough)}
      />
      
      {showWalkthrough && (
        <DemoWalkthrough 
          steps={walkthroughSteps} 
          onComplete={() => setShowWalkthrough(false)}
        />
      )}
      
      {children}
    </>
  );
};

interface DemoEngineProps {
  children: React.ReactNode;
}

export const DemoEngine: React.FC<DemoEngineProps> = ({ children }) => {
  return (
    <DemoProvider>
      <DemoEngineContent children={children} />
    </DemoProvider>
  );
};

export default DemoEngine;
