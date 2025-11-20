
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface DashboardGridActionsProps {
  onCreateWidget?: () => void;
}

const DashboardGridActions: React.FC<DashboardGridActionsProps> = ({ onCreateWidget }) => {
  return (
    <div className="flex justify-center mt-8">
      <Button 
        variant="outline" 
        size="lg" 
        className="border-dashed"
        onClick={onCreateWidget}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add New Widget
      </Button>
    </div>
  );
};

export default DashboardGridActions;
