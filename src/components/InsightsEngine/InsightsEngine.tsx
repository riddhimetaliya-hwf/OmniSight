import React, { useState } from "react";
import { useInsights } from "./useInsights";
import InsightsHeader from "./InsightsHeader";
import InsightsSummaryCards from "./InsightsSummaryCards";
import InsightsFilter from "./InsightsFilter";
import InsightsTabs from "./InsightsTabs";
import InsightsError from "./InsightsError";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessProcessInsightsAI } from "@/components/BusinessProcessInsightsAI";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, BarChart3, RefreshCcw, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ShareDialog from '@/components/Collaboration/ShareDialog/ShareDialog';
import { toast } from '@/hooks/use-toast';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

const InsightsEngine: React.FC = () => {
  const { 
    insights, 
    insightsByCategory,
    isLoading, 
    error, 
    filters, 
    updateFilters, 
    resetFilters 
  } = useInsights();

  const [activeTab, setActiveTab] = useState<string>("general");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data fetch delay
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: 'Insights refreshed',
        description: 'The Insights Engine section has been updated.'
      });
    }, 1200);
  };

  const handleExport = async () => {
    setIsExporting(true);
    const workbook = new ExcelJS.Workbook();
    for (let i = 0; i < insights.length; i++) {
      const insight = insights[i];
      const sheet = workbook.addWorksheet(insight.title.substring(0, 31) || `Insight ${i + 1}`);

      // Title
      sheet.mergeCells('A1', 'E1');
      sheet.getCell('A1').value = insight.title;
      sheet.getCell('A1').font = { size: 18, bold: true };
      sheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

      // Key details table
      const details = [
        ['Type', insight.type],
        ['Severity', insight.severity],
        ['Department', insight.department],
        ['Metric Category', insight.metricCategory],
        ['Timestamp', insight.timestamp],
        ['Confidence', insight.confidence],
      ];
      sheet.addTable({
        name: `Details${i}`,
        ref: 'A3',
        headerRow: false,
        columns: [{ name: 'Key' }, { name: 'Value' }],
        rows: details,
      });

      // Description
      sheet.getCell('A10').value = 'Description:';
      sheet.getCell('A10').font = { bold: true };
      sheet.getCell('A11').value = insight.description;
      sheet.getCell('A11').alignment = { wrapText: true };

      // Recommendations
      if (insight.recommendations && insight.recommendations.length > 0) {
        sheet.getCell('A13').value = 'Recommendations:';
        sheet.getCell('A13').font = { bold: true };
        sheet.getCell('A14').value = insight.recommendations.join('\n');
        sheet.getCell('A14').alignment = { wrapText: true };
      }

      // Related Metrics
      if (insight.relatedMetrics && insight.relatedMetrics.length > 0) {
        sheet.getCell('A16').value = 'Related Metrics:';
        sheet.getCell('A16').font = { bold: true };
        sheet.getCell('A17').value = insight.relatedMetrics.join(', ');
        sheet.getCell('A17').alignment = { wrapText: true };
      }

      // Chart image
      if (insight.chartData) {
        const chartElem = document.getElementById(`insight-chart-${insight.id}`);
        if (chartElem) {
          const canvas = await html2canvas(chartElem);
          const imgData = canvas.toDataURL('image/png');
          const imageId = workbook.addImage({ base64: imgData, extension: 'png' });
          // Place image below details
          sheet.addImage(imageId, {
            tl: { col: 2, row: 18 },
            ext: { width: 400, height: 200 },
          });
        }
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'insights-analytics.xlsx');
    setIsExporting(false);
    toast({ title: 'Exported', description: 'Excel file downloaded with formatted insight sheets and chart images.' });
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  if (error) {
    return <InsightsError error={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="w-full mx-auto px-4 space-y-6 InsightsEngineExportArea">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <InsightsHeader onRefresh={handleRefresh} />
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <FileSpreadsheet className="h-4 w-4" />
            )}
            <span className="hidden md:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
          </Button>
          {isExporting && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-2 shadow-lg">
                <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="mt-2 text-primary font-semibold">Preparing Excel export...</span>
              </div>
            </div>
          )}
          <Button variant="outline" size="sm" className="gap-1" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            <span className="hidden md:inline">Share</span>
          </Button>
          <Button variant="default" size="sm" className="gap-1" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Refresh</span>
          </Button>
        </div>
        {showShareDialog && (
          <ShareDialog
            title="Insights Engine"
            type="insight"
            id="insights-engine"
            onShare={() => setShowShareDialog(false)}
            sharedWith={[]}
            currentAccessLevel="private"
            uniqueLink={window.location.href}
          />
        )}
      </div>

      <InsightsSummaryCards 
        isLoading={isLoading}
        criticalCount={insightsByCategory.critical.length}
        trendsCount={insightsByCategory.trends.length}
        totalCount={insights.length}
      />

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Insights Dashboard</span>
              <Badge variant="outline" className="ml-2 text-xs bg-primary/10">
                {insights.length} insights available
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full max-w-md mb-4 grid grid-cols-2">
              <TabsTrigger value="general" className="flex-1">
                General Insights
              </TabsTrigger>
              <TabsTrigger value="business-process" className="flex-1">
                Business Process AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="animate-fade-in">
              <div className="space-y-4">
                <InsightsFilter filters={filters} onFilterChange={updateFilters} />
                <Separator />

                <InsightsTabs 
                  insights={insights}
                  isLoading={isLoading}
                  insightsByCategory={insightsByCategory}
                  viewMode={viewMode}
                />
              </div>
            </TabsContent>

            <TabsContent value="business-process" className="animate-fade-up">
              <BusinessProcessInsightsAI />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsEngine;
