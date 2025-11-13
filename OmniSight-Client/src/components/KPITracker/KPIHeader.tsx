
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download, Share2 } from 'lucide-react';
import { useKPIContext } from './context/KPIContext';

const KPIHeader: React.FC = () => {
  const { setIsCreatingKPI } = useKPIContext();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">KPI Scorecards</h2>
        <p className="text-muted-foreground mt-1">
          Track your key business metrics against targets
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Button 
          onClick={() => setIsCreatingKPI(true)}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add KPI</span>
        </Button>
      </div>
    </div>
  );
};

export default KPIHeader;
