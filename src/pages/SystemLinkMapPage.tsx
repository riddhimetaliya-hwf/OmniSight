
import React from 'react';
import SystemLinkMap from '@/components/SystemLinkMap';

const SystemLinkMapPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cross-System Relationship Graph</h1>
        <p className="text-muted-foreground">
          Interactive visualization of connections between enterprise systems and data flows
        </p>
      </div>
      
      <SystemLinkMap />
    </div>
  );
};

export default SystemLinkMapPage;
