
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
  ReportConfig, 
  ReportSection, 
  ReportFormat, 
  ReportSchedule,
  Department,
  TimeFrame,
  Audience,
  ReportBranding
} from '../types';
import { useToast } from "@/components/ui/use-toast";
import { useReportGenerator } from '../hooks/useReportGenerator';

interface ReportContextType {
  reportConfig: ReportConfig;
  isGenerating: boolean;
  isScheduling: boolean;
  isExporting: boolean;
  handlePromptSubmit: (prompt: string, department: Department, timeframe: TimeFrame, audience: Audience) => Promise<void>;
  handleSectionReorder: (reorderedSections: ReportSection[]) => void;
  handleFormatChange: (format: ReportFormat) => void;
  handleScheduleChange: (schedule: ReportSchedule | null) => void;
  handleBrandingChange: (useLogo: boolean, useWatermark: boolean, primaryColor: string, logoUrl: string) => void;
  handleExport: () => Promise<void>;
  handleSchedule: () => Promise<void>;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const defaultReportConfig: ReportConfig = {
  title: "",
  prompt: "",
  department: "all",
  timeframe: "last30d",
  audience: "executive",
  sections: [],
  format: "pdf",
  schedule: null,
  branding: {
    useLogo: false,
    useWatermark: false,
    primaryColor: "#2563eb",
    logoUrl: ""
  }
};

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { 
    generateReport, 
    scheduleReport, 
    exportReport, 
    isGenerating,
    isScheduling,
    isExporting
  } = useReportGenerator();
  
  const [reportConfig, setReportConfig] = useState<ReportConfig>(defaultReportConfig);

  const handlePromptSubmit = async (
    prompt: string, 
    department: Department, 
    timeframe: TimeFrame, 
    audience: Audience
  ) => {
    setReportConfig(prev => ({
      ...prev,
      prompt,
      department,
      timeframe,
      audience
    }));
    
    try {
      const generatedReport = await generateReport(prompt, department, timeframe, audience);
      setReportConfig(prev => ({
        ...prev,
        title: generatedReport.title,
        sections: generatedReport.sections
      }));
      
      toast({
        title: "Report generated successfully",
        description: "Your report is ready for customization and export.",
      });
    } catch (error) {
      toast({
        title: "Failed to generate report",
        description: "Please try again or modify your prompt.",
        variant: "destructive"
      });
    }
  };

  const handleSectionReorder = (reorderedSections: ReportSection[]) => {
    setReportConfig(prev => ({
      ...prev,
      sections: reorderedSections
    }));
  };

  const handleFormatChange = (format: ReportFormat) => {
    setReportConfig(prev => ({
      ...prev,
      format
    }));
  };

  const handleScheduleChange = (schedule: ReportSchedule | null) => {
    setReportConfig(prev => ({
      ...prev,
      schedule
    }));
  };

  const handleBrandingChange = (
    useLogo: boolean,
    useWatermark: boolean,
    primaryColor: string,
    logoUrl: string
  ) => {
    setReportConfig(prev => ({
      ...prev,
      branding: {
        useLogo,
        useWatermark,
        primaryColor,
        logoUrl
      }
    }));
  };

  const handleExport = async () => {
    try {
      await exportReport(reportConfig);
      toast({
        title: "Report exported successfully",
        description: `Your report has been exported as ${reportConfig.format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to export report",
        description: "Please try again or choose a different format.",
        variant: "destructive"
      });
    }
  };

  const handleSchedule = async () => {
    if (!reportConfig.schedule) return;
    
    try {
      await scheduleReport(reportConfig);
      toast({
        title: "Report scheduled successfully",
        description: `Your report will be generated ${reportConfig.schedule.frequency}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to schedule report",
        description: "Please try again or modify the schedule.",
        variant: "destructive"
      });
    }
  };

  const value = {
    reportConfig,
    isGenerating,
    isScheduling,
    isExporting,
    handlePromptSubmit,
    handleSectionReorder,
    handleFormatChange,
    handleScheduleChange,
    handleBrandingChange,
    handleExport,
    handleSchedule
  };

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};

export const useReportContext = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReportContext must be used within a ReportProvider');
  }
  return context;
};
