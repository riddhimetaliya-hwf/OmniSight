
export type UserRole = 'exec' | 'analyst' | 'admin';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  targetElement: string; // CSS selector for the element to highlight
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  action?: () => void; // Optional action to perform on this step
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  module: string; // e.g., 'dashboard', 'workflow', 'copilot'
  role: UserRole[];
  autoStart: boolean;
  steps: TourStep[];
}

export interface TooltipInfo {
  id: string;
  title: string;
  content: string;
  placement: 'top' | 'right' | 'bottom' | 'left';
  showOnce: boolean;
}

export interface TourManagerProps {
  tours: Tour[];
  onEditTour: (tour: Tour) => void;
  onDeleteTour: (tourId: string) => void;
  onAddTour: () => void;
  onToggleTourForUser: (tourId: string, userId: string, enabled: boolean) => void;
}
