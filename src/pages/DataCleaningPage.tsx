
import React from 'react';
import { CleanDataWithAI } from '@/components/CleanDataWithAI';

const DataCleaningPage: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-medium mb-6">Data Cleaning Assistant</h1>
      <CleanDataWithAI />
    </div>
  );
};

export default DataCleaningPage;
