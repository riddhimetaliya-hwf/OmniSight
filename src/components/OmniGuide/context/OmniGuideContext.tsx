
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tour, TourStep, UserRole, TooltipInfo } from '../types';
import { getDemoTours } from '../data/demoTours';
import { toast } from "@/components/ui/use-toast";

interface OmniGuideContextProps {
  // Tour state
  activeTour: Tour | null;
  activeTourStep: number;
  availableTours: Tour[];
  
  // Tooltip state
  isTooltipEnabled: boolean;
  viewedTooltips: string[];
  
  // User settings
  userRole: UserRole;
  
  // Tour actions
  startTour: (tourId: string) => void;
  stopTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  
  // Tooltip actions
  showTooltip: (tooltipId: string) => boolean;
  markTooltipAsViewed: (tooltipId: string) => void;
  resetViewedTooltips: () => void;
  
  // Admin actions
  setUserRole: (role: UserRole) => void;
  toggleTooltips: () => void;
}

const OmniGuideContext = createContext<OmniGuideContextProps | undefined>(undefined);

export const useOmniGuideContext = () => {
  const context = useContext(OmniGuideContext);
  if (!context) {
    throw new Error('useOmniGuideContext must be used within an OmniGuideProvider');
  }
  return context;
};

interface OmniGuideProviderProps {
  children: ReactNode;
}

export const OmniGuideProvider: React.FC<OmniGuideProviderProps> = ({ children }) => {
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [activeTourStep, setActiveTourStep] = useState(0);
  const [availableTours, setAvailableTours] = useState<Tour[]>([]);
  // Set isTooltipEnabled to false by default
  const [isTooltipEnabled, setIsTooltipEnabled] = useState(false);
  const [viewedTooltips, setViewedTooltips] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('analyst');
  
  // Load tours and user preferences on mount
  useEffect(() => {
    // Load user preferences from localStorage
    const savedSettings = localStorage.getItem('omniGuideSettings');
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        // Always set tooltips to disabled regardless of saved settings
        setIsTooltipEnabled(false);
        setViewedTooltips(settings.viewedTooltips ?? []);
        setUserRole(settings.userRole ?? 'analyst');
      } catch (error) {
        console.error('Failed to parse saved OmniGuide settings', error);
      }
    }
    
    // Save the disabled state to localStorage
    try {
      localStorage.setItem('omniGuideSettings', JSON.stringify({
        isTooltipEnabled: false,
        viewedTooltips: [],
        userRole: 'analyst'
      }));
    } catch (error) {
      console.error('Failed to save OmniGuide settings to localStorage', error);
    }
    
    // Load tours based on user role but don't auto-start any
    const tours = getDemoTours(userRole);
    setAvailableTours(tours.map(tour => ({ ...tour, autoStart: false })));
  }, []);
  
  // Update tours when user role changes
  useEffect(() => {
    const tours = getDemoTours(userRole);
    // Ensure no tours auto-start
    setAvailableTours(tours.map(tour => ({ ...tour, autoStart: false })));
  }, [userRole]);
  
  // Save settings when they change
  useEffect(() => {
    const settings = {
      isTooltipEnabled,
      viewedTooltips,
      userRole
    };
    try {
      localStorage.setItem('omniGuideSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save OmniGuide settings to localStorage', error);
    }
  }, [isTooltipEnabled, viewedTooltips, userRole]);
  
  // Modified startTour to be a no-op function
  const startTour = (tourId: string) => {
    // Do nothing - tours are disabled
    console.log('Tours are disabled');
  };
  
  const stopTour = () => {
    setActiveTour(null);
    setActiveTourStep(0);
  };
  
  const nextStep = () => {
    if (activeTour && activeTourStep < activeTour.steps.length - 1) {
      setActiveTourStep(prev => prev + 1);
    } else if (activeTour) {
      stopTour();
    }
  };
  
  const prevStep = () => {
    if (activeTourStep > 0) {
      setActiveTourStep(prev => prev - 1);
    }
  };
  
  const skipTour = () => {
    stopTour();
  };
  
  // Modified showTooltip to always return false
  const showTooltip = (tooltipId: string): boolean => {
    return false; // Always hide tooltips
  };
  
  const markTooltipAsViewed = (tooltipId: string) => {
    if (!viewedTooltips.includes(tooltipId)) {
      setViewedTooltips(prev => [...prev, tooltipId]);
    }
  };
  
  const resetViewedTooltips = () => {
    setViewedTooltips([]);
  };
  
  // Modified toggleTooltips to not enable tooltips
  const toggleTooltips = () => {
    // Only allow disabling, not enabling
    if (isTooltipEnabled) {
      setIsTooltipEnabled(false);
      toast({
        title: "Tooltips Disabled",
        description: "You won't see first-time tooltips anymore.",
      });
    }
  };

  const value: OmniGuideContextProps = {
    activeTour,
    activeTourStep,
    availableTours,
    isTooltipEnabled,
    viewedTooltips,
    userRole,
    startTour,
    stopTour,
    nextStep,
    prevStep,
    skipTour,
    showTooltip,
    markTooltipAsViewed,
    resetViewedTooltips,
    setUserRole,
    toggleTooltips
  };

  return (
    <OmniGuideContext.Provider value={value}>
      {children}
    </OmniGuideContext.Provider>
  );
};
