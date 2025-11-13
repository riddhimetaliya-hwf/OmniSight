import React, { useState, useEffect } from 'react';
import { WalkthroughStep } from '../types';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoWalkthroughProps {
  steps: WalkthroughStep[];
  onComplete: () => void;
}

export const DemoWalkthrough: React.FC<DemoWalkthroughProps> = ({
  steps,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  const currentStep = steps[currentStepIndex];
  
  useEffect(() => {
    // Position the walkthrough tooltip based on the target element
    if (currentStep.targetElement) {
      const targetEl = document.querySelector(currentStep.targetElement);
      
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const tooltipHeight = 200; // Approximate height of the tooltip
        const tooltipWidth = 300; // Approximate width of the tooltip
        
        // Calculate position based on placement
        let top = 0;
        let left = 0;
        
        switch (currentStep.placement) {
          case 'top':
            top = rect.top - tooltipHeight - 10;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'right':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.right + 10;
            break;
          case 'bottom':
            top = rect.bottom + 10;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'left':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.left - tooltipWidth - 10;
            break;
          default:
            // Center
            top = window.innerHeight / 2 - tooltipHeight / 2;
            left = window.innerWidth / 2 - tooltipWidth / 2;
        }
        
        // Keep tooltip within viewport
        top = Math.max(10, Math.min(window.innerHeight - tooltipHeight - 10, top));
        left = Math.max(10, Math.min(window.innerWidth - tooltipWidth - 10, left));
        
        setPosition({ top, left });
        
        // Add highlight to the target element
        targetEl.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'transition-all', 'duration-200');
        
        // Execute step action if provided
        if (currentStep.action) {
          currentStep.action();
        }
        
        return () => {
          // Remove highlight when unmounting
          targetEl.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'transition-all', 'duration-200');
        };
      }
    } else if (currentStep.placement === 'center') {
      // Center the tooltip
      setPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 150
      });
    }
  }, [currentStep]);
  
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };
  
  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  
  // Determine if the tooltip should have an overlay
  const shouldShowOverlay = !currentStep.targetElement || currentStep.placement === 'center';
  
  return (
    <>
      {shouldShowOverlay && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
          onClick={onComplete}
        />
      )}
      
      <div 
        className={cn(
          "fixed z-[51] bg-card shadow-lg rounded-lg p-4 w-[300px]",
          "border border-border animate-fade-in"
        )}
        style={{ 
          top: `${position.top}px`, 
          left: `${position.left}px` 
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{currentStep.title}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onComplete}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {currentStep.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={cn(
                  "h-1.5 rounded-full",
                  index === currentStepIndex 
                    ? "w-4 bg-primary" 
                    : "w-1.5 bg-muted"
                )}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleNext}
            >
              {currentStepIndex < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                'Finish'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
