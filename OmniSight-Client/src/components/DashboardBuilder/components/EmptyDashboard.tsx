
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyDashboardProps {
  onCreateDashboard: () => void;
}

const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ onCreateDashboard }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">No Dashboard Available</h2>
        <p className="text-muted-foreground max-w-md">
          Create your first dashboard to start building visualizations and tracking key metrics.
        </p>
      </div>
      
      <Button onClick={onCreateDashboard} className="flex items-center gap-2">
        <PlusCircle className="h-5 w-5" />
        Create Dashboard
      </Button>
    </div>
  );
};

export default EmptyDashboard;
