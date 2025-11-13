
import React from 'react';

interface SmartTooltipProps {
  tooltipId: string;
  title: string;
  content: string;
  showOnce?: boolean;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

// Simplified component that just renders children without any tooltips
const SmartTooltip: React.FC<SmartTooltipProps> = ({
  children
}) => {
  // Simply render the children without any tooltip wrapper
  return <>{children}</>;
};

export default SmartTooltip;
