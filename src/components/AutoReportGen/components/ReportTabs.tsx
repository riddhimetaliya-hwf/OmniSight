
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReportPromptInput from "../ReportPromptInput";
import ReportPreview from "../ReportPreview";
import ReportFormatOptions from "../ReportFormatOptions";
import ReportBrandingOptions from "../ReportBrandingOptions";
import ReportScheduleOptions from "../ReportScheduleOptions";
import { useReportContext } from "../context/ReportContext";

const ReportTabs: React.FC = () => {
  const { 
    reportConfig, 
    isGenerating,
    handlePromptSubmit, 
    handleSectionReorder, 
    handleFormatChange, 
    handleBrandingChange, 
    handleScheduleChange 
  } = useReportContext();

  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="create">Create Report</TabsTrigger>
        <TabsTrigger value="customize" disabled={reportConfig.sections.length === 0}>
          Customize
        </TabsTrigger>
        <TabsTrigger value="format" disabled={reportConfig.sections.length === 0}>
          Format & Export
        </TabsTrigger>
        <TabsTrigger value="schedule" disabled={reportConfig.sections.length === 0}>
          Schedule
        </TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="space-y-6">
        <ReportPromptInput 
          onSubmit={handlePromptSubmit} 
          isLoading={isGenerating}
        />
      </TabsContent>

      <TabsContent value="customize" className="space-y-6">
        {reportConfig.sections.length > 0 ? (
          <ReportPreview 
            title={reportConfig.title}
            sections={reportConfig.sections}
            onSectionReorder={handleSectionReorder}
          />
        ) : (
          <div className="p-10 text-center">
            <p className="text-muted-foreground">Generate a report first</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="format" className="space-y-6">
        <ReportFormatOptions 
          format={reportConfig.format}
          onFormatChange={handleFormatChange}
        />
        <ReportBrandingOptions 
          branding={reportConfig.branding}
          onBrandingChange={handleBrandingChange}
        />
      </TabsContent>

      <TabsContent value="schedule" className="space-y-6">
        <ReportScheduleOptions 
          schedule={reportConfig.schedule}
          onScheduleChange={handleScheduleChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ReportTabs;
