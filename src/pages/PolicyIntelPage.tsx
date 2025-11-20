
import React from 'react';
import { PolicyIntelBot } from '@/components/PolicyIntelBot';

const PolicyIntelPage: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-medium mb-6">Policy Intelligence</h1>
      <PolicyIntelBot />
    </div>
  );
};

export default PolicyIntelPage;
