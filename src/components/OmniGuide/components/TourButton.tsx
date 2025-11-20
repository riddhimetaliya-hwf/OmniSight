
import React from 'react';

interface TourButtonProps {
  tourId: string;
  tour?: any;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  onStartTour?: (id: string) => void;
}

// Simplified component that renders nothing
const TourButton: React.FC<TourButtonProps> = () => {
  // Return null to render nothing
  return null;
};

export default TourButton;
