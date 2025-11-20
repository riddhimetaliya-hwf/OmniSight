
import React from 'react';
import { AutoSummaryProvider as OriginalAutoSummaryProvider } from './AutoSummaryContext';

export const AutoSummaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <OriginalAutoSummaryProvider>{children}</OriginalAutoSummaryProvider>;
};
