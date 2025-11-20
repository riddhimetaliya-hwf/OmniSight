
import React from 'react';
import { Dashboard } from '../types';
import { Button } from '@/components/ui/button';
import { Save, Share2, Settings, Layers } from 'lucide-react';

interface DashboardActionsProps {
  showSavedViews: boolean;
  setShowSavedViews: (show: boolean) => void;
  showShareDialog: boolean;
  currentDashboard: Dashboard;
  onOpenShareDialog: () => void;
  onShareDashboard: (emails: string[], accessLevel: string) => void;
  isCustomizing: boolean;
  setIsCustomizing: (isCustomizing: boolean) => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({
  showSavedViews,
  setShowSavedViews,
  showShareDialog,
  currentDashboard,
  onOpenShareDialog,
  onShareDashboard,
  isCustomizing,
  setIsCustomizing
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant={showSavedViews ? "secondary" : "outline"}
        onClick={() => setShowSavedViews(!showSavedViews)}
        className="flex items-center gap-2"
      >
        <Layers className="h-4 w-4" />
        <span className="hidden md:inline">Saved Views</span>
      </Button>
      
      <Button
        variant="outline"
        onClick={onOpenShareDialog}
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden md:inline">Share</span>
      </Button>
      
      <Button
        variant={isCustomizing ? "secondary" : "outline"}
        onClick={() => setIsCustomizing(!isCustomizing)}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden md:inline">
          {isCustomizing ? "Done" : "Customize"}
        </span>
      </Button>
    </div>
  );
};

export default DashboardActions;
