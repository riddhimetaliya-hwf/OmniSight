import React from 'react';
import { ViewMode } from '../types';
import { Button } from '@/components/ui/button';
import { 
  Grid3X3, 
  Globe, 
  Clock, 
  Layers, 
  MapPin 
} from 'lucide-react';

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const viewModes = [
    { key: '2d', label: '2D' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'geographic', label: 'Geographic' },
  ];

  return (
    <div className="flex space-x-1">
      {viewModes.map((mode) => {
        const Icon = mode.key === '2d' ? Grid3X3 : mode.key === 'timeline' ? Clock : mode.key === 'geographic' ? MapPin : Layers;
        return (
          <Button
            key={mode.key}
            variant={currentMode === mode.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange(mode.key as ViewMode)}
            className="h-8 px-2"
            title={mode.label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
};

export default ViewModeSelector; 