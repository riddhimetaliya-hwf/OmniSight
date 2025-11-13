
import React from 'react';

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  layoutMode: 'compact' | 'comfortable' | 'spacious';
}

const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({ children, layoutMode }) => {
  const getLayoutClasses = () => {
    switch (layoutMode) {
      case 'compact':
        return 'space-y-4 max-w-7xl mx-auto px-4';
      case 'spacious':
        return 'space-y-8 max-w-full mx-auto px-8';
      default: // comfortable
        return 'space-y-6 max-w-7xl mx-auto px-6';
    }
  };

  const getBackgroundStyle = () => {
    const baseStyle = "min-h-screen transition-all duration-500";
    
    switch (layoutMode) {
      case 'compact':
        return `${baseStyle} bg-background`;
      case 'spacious':
        return `${baseStyle} bg-gradient-to-br from-background via-background/95 to-muted/10`;
      default: // comfortable
        return `${baseStyle} bg-gradient-to-br from-background via-background/98 to-muted/5`;
    }
  };

  return (
    <div className={getBackgroundStyle()}>
      <div className={getLayoutClasses()}>
        {children}
      </div>
      
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-accent/5 to-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default AdaptiveLayout;
