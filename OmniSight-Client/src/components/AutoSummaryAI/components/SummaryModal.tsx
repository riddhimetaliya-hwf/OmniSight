
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Download, 
  RefreshCw, 
  Mail, 
  Pencil, 
  Check, 
  X,
  FileText
} from 'lucide-react';
import { useAutoSummary } from '../context/AutoSummaryContext';
import SummarySection from './SummarySection';
import SummaryExportOptions from './SummaryExportOptions';
import SummaryEmailSchedule from './SummaryEmailSchedule';

interface SummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ open, onOpenChange }) => {
  const { 
    currentSummary, 
    isGenerating, 
    regenerateSummary,
    clearCurrentSummary
  } = useAutoSummary();
  
  const [activeTab, setActiveTab] = useState('summary');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  
  // Handle close modal and clean up
  const handleClose = () => {
    setActiveTab('summary');
    setEditingSectionId(null);
    if (!open) {
      clearCurrentSummary();
    }
  };
  
  if (!currentSummary) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col" onCloseAutoFocus={handleClose}>
        <DialogHeader>
          <DialogTitle className="text-xl">{currentSummary.title}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="flex-1 overflow-y-auto space-y-4 p-1">
            {currentSummary.sections.map(section => (
              <SummarySection 
                key={section.id}
                section={section}
                isEditing={editingSectionId === section.id}
                onEdit={() => setEditingSectionId(section.id)}
                onCancel={() => setEditingSectionId(null)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="export" className="flex-1 overflow-y-auto">
            <SummaryExportOptions />
          </TabsContent>
          
          <TabsContent value="schedule" className="flex-1 overflow-y-auto">
            <SummaryEmailSchedule />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Generated on {new Date(currentSummary.timestamp).toLocaleString()}
          </div>
          
          <div className="flex gap-2">
            {activeTab === 'summary' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={regenerateSummary}
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            )}
            
            <DialogClose asChild>
              <Button size="sm">Close</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryModal;
