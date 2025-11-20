
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { 
  Summary, 
  SummaryOptions, 
  SummarySection, 
  AutoSummaryContextType 
} from '../types';

// Create the context
const AutoSummaryContext = createContext<AutoSummaryContextType | undefined>(undefined);

// Context provider component
export const AutoSummaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null);
  const [summaryHistory, setSummaryHistory] = useState<Summary[]>([]);

  // Generate a summary based on dashboard or report data
  const generateSummary = async (
    options: SummaryOptions, 
    sourceId: string, 
    sourceType: 'dashboard' | 'report'
  ) => {
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll simulate the AI response with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSections: SummarySection[] = [
        {
          id: uuidv4(),
          title: 'Overview',
          content: `This ${sourceType} shows a 15% increase in overall performance compared to the previous period. Key metrics show positive trends across most business units.`,
          type: 'text',
          priority: 'high'
        },
        {
          id: uuidv4(),
          title: 'Key Trends',
          content: 'Revenue has increased by 12% month-over-month, while customer acquisition costs have decreased by 8%. User engagement is up 22% across all platforms.',
          type: 'trend',
          priority: 'high'
        },
        {
          id: uuidv4(),
          title: 'Notable Anomalies',
          content: 'There was an unexpected drop in conversion rates on May 15th, which appears to correlate with a temporary technical issue that has since been resolved.',
          type: 'anomaly',
          priority: 'medium'
        }
      ];
      
      // Add recommendations if requested
      if (options.includeRecommendations) {
        mockSections.push({
          id: uuidv4(),
          title: 'Recommendations',
          content: 'Consider reallocating marketing budget to top-performing channels. Investigate opportunities to optimize the checkout process to improve conversion rates.',
          type: 'recommendation',
          priority: 'medium'
        });
      }
      
      const newSummary: Summary = {
        id: uuidv4(),
        title: `Summary of ${sourceType === 'dashboard' ? 'Dashboard' : 'Report'} - ${new Date().toLocaleDateString()}`,
        timestamp: new Date().toISOString(),
        sections: mockSections,
        options: options
      };
      
      if (sourceType === 'dashboard') {
        newSummary.dashboardId = sourceId;
      } else {
        newSummary.reportId = sourceId;
      }
      
      setCurrentSummary(newSummary);
      setSummaryHistory(prev => [newSummary, ...prev]);
      
      toast({
        title: 'Summary Generated',
        description: 'Your summary has been successfully generated.',
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Regenerate the current summary with the same options
  const regenerateSummary = async () => {
    if (!currentSummary) {
      toast({
        title: 'Error',
        description: 'No summary to regenerate',
        variant: 'destructive'
      });
      return;
    }
    
    const sourceId = currentSummary.dashboardId || currentSummary.reportId || '';
    const sourceType = currentSummary.dashboardId ? 'dashboard' : 'report';
    
    await generateSummary(currentSummary.options, sourceId, sourceType);
  };
  
  // Edit a section in the current summary
  const editSummarySection = (sectionId: string, newContent: string) => {
    if (!currentSummary) return;
    
    const updatedSections = currentSummary.sections.map(section => 
      section.id === sectionId ? { ...section, content: newContent } : section
    );
    
    const updatedSummary = { ...currentSummary, sections: updatedSections };
    setCurrentSummary(updatedSummary);
    
    // Also update in history
    setSummaryHistory(prev => 
      prev.map(summary => 
        summary.id === currentSummary.id ? updatedSummary : summary
      )
    );
    
    toast({
      title: 'Summary Updated',
      description: 'Your changes have been saved.',
    });
  };
  
  // Export the summary to PDF or Word
  const exportSummary = async (format: 'pdf' | 'docx') => {
    if (!currentSummary) {
      toast({
        title: 'Error',
        description: 'No summary to export',
        variant: 'destructive'
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Summary Exported',
        description: `Your summary has been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Error exporting summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to export summary.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Schedule the summary to be sent via email
  const scheduleSummary = async (email: string, frequency: 'daily' | 'weekly' | 'monthly') => {
    if (!currentSummary) {
      toast({
        title: 'Error',
        description: 'No summary to schedule',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Simulate scheduling process
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: 'Summary Scheduled',
        description: `Your summary will be sent ${frequency} to ${email}.`,
      });
    } catch (error) {
      console.error('Error scheduling summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule summary.',
        variant: 'destructive'
      });
    }
  };
  
  // Clear the current summary
  const clearCurrentSummary = () => {
    setCurrentSummary(null);
  };
  
  const value = {
    isGenerating,
    currentSummary,
    summaryHistory,
    generateSummary,
    regenerateSummary,
    editSummarySection,
    exportSummary,
    scheduleSummary,
    clearCurrentSummary
  };
  
  return (
    <AutoSummaryContext.Provider value={value}>
      {children}
    </AutoSummaryContext.Provider>
  );
};

// Custom hook to use the AutoSummary context
export const useAutoSummary = () => {
  const context = useContext(AutoSummaryContext);
  if (context === undefined) {
    throw new Error('useAutoSummary must be used within an AutoSummaryProvider');
  }
  return context;
};
