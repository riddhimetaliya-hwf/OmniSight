
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  RefreshCw, 
  Settings, 
  Share2,
  FileText
} from "lucide-react";
import { useReportContext } from "../context/ReportContext";
import { SummaryButton } from "@/components/AutoSummaryAI";

const ReportHeader: React.FC = () => {
  const { 
    reportConfig, 
    isGenerating, 
    isExporting 
  } = useReportContext();

  // Generate a default ID if none exists
  const reportId = reportConfig?.id || 'current-report';

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="flex-1 space-y-1">
        <h1 className="text-2xl font-bold">AI Report Generator</h1>
        <p className="text-muted-foreground text-sm">
          Generate comprehensive reports with AI that analyze your data and provide actionable insights
        </p>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isGenerating || reportConfig.sections.length === 0}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isGenerating || reportConfig.sections.length === 0}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isGenerating || isExporting || reportConfig.sections.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        
        {reportConfig.sections.length > 0 && (
          <SummaryButton 
            sourceId={reportId} 
            sourceType="report"
            size="sm"
          />
        )}
        
        <Button variant="outline" size="icon" className="shrink-0">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReportHeader;
