import React from 'react';
import { CollaborationSession, Annotation, SavedView } from '../types';

interface CollaborationPanelProps {
  session: CollaborationSession | null;
  annotations: Annotation[];
  savedViews: SavedView[];
  onSaveView: (name: string, description?: string) => void;
  onLoadView: (view: SavedView) => void;
  onAddAnnotation: (annotation: Annotation) => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ 
  session, 
  annotations, 
  savedViews, 
  onSaveView, 
  onLoadView, 
  onAddAnnotation 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Collaboration</h3>
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">
          Shared annotations and views
        </div>
        <div className="text-xs">
          Annotations: {annotations.length}
        </div>
        <div className="text-xs">
          Saved views: {savedViews.length}
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel; 