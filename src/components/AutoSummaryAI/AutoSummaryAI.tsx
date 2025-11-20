
import React from 'react';
import { AutoSummaryProvider } from './context/AutoSummaryContext';
import SummaryButton from './components/SummaryButton';

interface AutoSummaryAIProps {
  children?: React.ReactNode;
}

const AutoSummaryAI: React.FC<AutoSummaryAIProps> = ({ children }) => {
  return (
    <AutoSummaryProvider>
      {children}
    </AutoSummaryProvider>
  );
};

export default AutoSummaryAI;
