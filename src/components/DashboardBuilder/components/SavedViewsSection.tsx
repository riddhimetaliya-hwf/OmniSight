
import React from 'react';
import { Dashboard, SavedView } from '../types';

interface SavedViewsSectionProps {
  showSavedViews: boolean;
  currentDashboard: Dashboard;
  onSaveView: (name: string, description?: string) => void;
  onDeleteView: (viewId: string) => void;
  onApplyView: (viewId: string) => void;
}

const SavedViewsSection: React.FC<SavedViewsSectionProps> = ({
  showSavedViews,
  currentDashboard,
  onSaveView,
  onDeleteView,
  onApplyView
}) => {
  if (!showSavedViews) return null;
  
  return (
    <div className="bg-card rounded-lg p-4 border">
      <h3 className="text-lg font-medium mb-4">Saved Views</h3>
      
      {(!currentDashboard.savedViews || currentDashboard.savedViews.length === 0) ? (
        <p className="text-muted-foreground">No saved views yet. Create a new view to save the current filters.</p>
      ) : (
        <div className="space-y-2">
          {currentDashboard.savedViews.map((view) => (
            <div key={view.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <h4 className="font-medium">{view.name}</h4>
                {view.description && <p className="text-sm text-muted-foreground">{view.description}</p>}
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm"
                  onClick={() => onApplyView(view.id)}
                >
                  Apply
                </button>
                <button
                  className="px-3 py-1 bg-destructive text-destructive-foreground rounded-md text-sm"
                  onClick={() => onDeleteView(view.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add a new view form could be implemented here */}
    </div>
  );
};

export default SavedViewsSection;
