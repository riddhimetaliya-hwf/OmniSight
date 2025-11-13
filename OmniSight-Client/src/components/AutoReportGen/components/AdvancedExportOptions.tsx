
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ReportFormatOptions from "../ReportFormatOptions";
import ReportBrandingOptions from "../ReportBrandingOptions";
import ReportScheduleOptions from "../ReportScheduleOptions";
import { ReportBranding, ReportFormat, ReportSchedule } from "../types";
import { Download, Share2, Clock, FileText, FileImage, Presentation } from "lucide-react";

interface AdvancedExportOptionsProps {
  onExport: () => void;
}

const AdvancedExportOptions: React.FC<AdvancedExportOptionsProps> = ({ 
  onExport 
}) => {
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [branding, setBranding] = useState<ReportBranding>({
    useLogo: false,
    useWatermark: false,
    primaryColor: "#0066cc",
    logoUrl: ""
  });
  const [schedule, setSchedule] = useState<ReportSchedule | null>(null);
  const [activeTab, setActiveTab] = useState("format");

  const handleBrandingChange = (
    useLogo: boolean,
    useWatermark: boolean,
    primaryColor: string,
    logoUrl: string
  ) => {
    setBranding({
      useLogo,
      useWatermark,
      primaryColor,
      logoUrl
    });
  };

  const handleExport = () => {
    onExport();
    // In a real implementation, we would use the format, branding, and schedule options
    console.log("Exporting with options:", { format, branding, schedule });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="mr-2 h-5 w-5" />
          Advanced Export Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="format" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Format</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-1">
              <FileImage className="h-4 w-4" />
              <span>Branding</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Schedule</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="format">
            <ReportFormatOptions 
              format={format} 
              onFormatChange={setFormat} 
            />
            
            <div className="mt-6 bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Additional Formats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Switch id="include-powerpoint" />
                  <Label htmlFor="include-powerpoint" className="flex items-center gap-1">
                    <Presentation className="h-4 w-4" />
                    <span>PowerPoint Export</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="include-csv" />
                  <Label htmlFor="include-csv">CSV Data Export</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="include-images" />
                  <Label htmlFor="include-images">Chart Images</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="include-interactive" />
                  <Label htmlFor="include-interactive">Interactive Elements</Label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="branding">
            <ReportBrandingOptions 
              branding={branding}
              onBrandingChange={handleBrandingChange}
            />
          </TabsContent>
          
          <TabsContent value="schedule">
            <ReportScheduleOptions 
              schedule={schedule}
              onScheduleChange={setSchedule}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setActiveTab("format")}>
            Cancel
          </Button>
          <Button
            variant="default"
            className="gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedExportOptions;
