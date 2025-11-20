
import React from 'react';

const DashboardLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start animate-pulse">
        <div>
          <div className="h-8 w-64 bg-muted rounded"></div>
          <div className="h-4 w-96 bg-muted rounded mt-2"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-10 w-24 bg-muted rounded"></div>
          <div className="h-10 w-24 bg-muted rounded"></div>
          <div className="h-10 w-24 bg-muted rounded"></div>
        </div>
      </div>
      
      <div className="h-12 w-full bg-muted rounded animate-pulse"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        <div className="h-64 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    </div>
  );
};

export default DashboardLoading;
