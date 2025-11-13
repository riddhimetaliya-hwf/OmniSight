
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useDemoContext } from '../context/DemoContext';

interface DemoActionButtonProps {
  className?: string;
}

const DemoActionButton: React.FC<DemoActionButtonProps> = ({ className }) => {
  const { isActive, activateDemo, isLoading } = useDemoContext();
  
  if (isActive) return null;
  
  return (
    <Button
      onClick={activateDemo}
      variant="outline"
      className={className}
      disabled={isLoading}
    >
      <Play className="h-4 w-4 mr-2" />
      {isLoading ? 'Loading Demo...' : 'Enter Demo Mode'}
    </Button>
  );
};

export default DemoActionButton;
