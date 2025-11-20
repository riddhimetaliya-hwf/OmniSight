
import React, { useEffect, useState } from 'react';
import { Tour, TourStep } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface TourOverlayProps {
  tour: Tour;
  stepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

const TourOverlay: React.FC<TourOverlayProps> = ({
  tour,
  stepIndex,
  onNext,
  onPrev,
  onSkip,
  onComplete,
}) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayStyle, setOverlayStyle] = useState({});
  const currentStep = tour.steps[stepIndex];
  const isLastStep = stepIndex === tour.steps.length - 1;
  
  useEffect(() => {
    if (!currentStep) return;
    
    // Find the DOM element to highlight
    const element = document.querySelector(currentStep.targetElement) as HTMLElement;
    setTargetElement(element);
    
    if (element) {
      // Calculate position for the tour card based on element position and placement
      const rect = element.getBoundingClientRect();
      const placement = currentStep.placement || 'bottom';
      
      // Make the element stand out
      element.style.position = 'relative';
      element.style.zIndex = '1001';
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Execute any step action
      if (currentStep.action) {
        currentStep.action();
      }
    }
  }, [currentStep]);
  
  const getCardPosition = () => {
    if (!targetElement) return {};
    
    const rect = targetElement.getBoundingClientRect();
    const placement = currentStep.placement || 'bottom';
    
    switch (placement) {
      case 'top':
        return {
          top: `${rect.top - 10 - 150}px`, // 150px is approx card height
          left: `${rect.left + rect.width / 2 - 150}px`, // 150px is half of card width
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2 - 75}px`,
          left: `${rect.right + 10}px`,
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2 - 75}px`,
          left: `${rect.left - 10 - 300}px`, // 300px is approx card width
        };
      case 'center':
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      case 'bottom':
      default:
        return {
          top: `${rect.bottom + 10}px`,
          left: `${rect.left + rect.width / 2 - 150}px`,
        };
    }
  };

  return (
    <>
      {/* Dimmed background overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity"
        onClick={onSkip}
      />
      
      {/* Tour step card */}
      <Card 
        className="fixed z-[1002] w-[300px] shadow-lg animate-fade-in"
        style={getCardPosition()}
      >
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            {currentStep.title}
            <span className="text-sm text-muted-foreground">
              Step {stepIndex + 1} of {tour.steps.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{currentStep.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {stepIndex > 0 && (
              <Button variant="outline" size="sm" onClick={onPrev}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          <div>
            {isLastStep ? (
              <Button size="sm" onClick={onComplete}>
                <Check className="mr-1 h-4 w-4" />
                Finish
              </Button>
            ) : (
              <Button size="sm" onClick={onNext}>
                Next
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {/* Highlight for the target element - renders a box around the element */}
      {targetElement && (
        <div
          className="absolute border-2 border-primary z-[1001] rounded-md animate-pulse"
          style={{
            top: `${targetElement.getBoundingClientRect().top - 4}px`,
            left: `${targetElement.getBoundingClientRect().left - 4}px`,
            width: `${targetElement.getBoundingClientRect().width + 8}px`,
            height: `${targetElement.getBoundingClientRect().height + 8}px`,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
};

export default TourOverlay;
