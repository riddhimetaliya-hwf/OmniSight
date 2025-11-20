
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAutoSummary } from '../context/AutoSummaryContext';
import { SummaryOptions, SummaryLevel, SummaryFocus } from '../types';
import SummaryModal from './SummaryModal';

interface SummaryButtonProps extends ButtonProps {
  sourceId: string;
  sourceType: 'dashboard' | 'report';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const SummaryButton: React.FC<SummaryButtonProps> = ({ 
  sourceId, 
  sourceType,
  variant = 'outline',
  size = 'sm',
  ...props 
}) => {
  const { generateSummary, isGenerating } = useAutoSummary();
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState<SummaryOptions>({
    level: 'detailed',
    focus: 'all',
    includeRecommendations: true,
    timeframe: 'last30days'
  });
  
  const handleSummarize = async () => {
    await generateSummary(options, sourceId, sourceType);
    setShowModal(true);
  };
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleSummarize}
        disabled={isGenerating}
        {...props}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <FileText className="h-4 w-4 mr-2" />
        )}
        Summarize
      </Button>
      
      <SummaryModal
        open={showModal}
        onOpenChange={setShowModal}
      />
    </>
  );
};

export default SummaryButton;
