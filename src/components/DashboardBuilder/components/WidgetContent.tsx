
import React from "react";
import { Widget } from "../types";
import { CardContent } from "@/components/ui/card";
import { InsightChart } from "@/components/InsightsEngine";
import { cn } from "@/lib/utils";
import { DataQualityIndicator } from "@/components/DataQuality/DataQualityIndicator";

interface WidgetContentProps {
  widget: Widget;
}

// Sample data for empty widgets to ensure visualization is present
const sampleLineData = [
  { month: 'Jan', sales: 400, profit: 200 },
  { month: 'Feb', sales: 300, profit: 150 },
  { month: 'Mar', sales: 600, profit: 300 },
  { month: 'Apr', sales: 800, profit: 400 },
  { month: 'May', sales: 500, profit: 250 },
  { month: 'Jun', sales: 700, profit: 350 },
];

const sampleBarData = [
  { category: 'Category A', value: 400 },
  { category: 'Category B', value: 300 },
  { category: 'Category C', value: 600 },
  { category: 'Category D', value: 200 },
  { category: 'Category E', value: 500 },
];

const samplePieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 200 },
  { name: 'Group D', value: 100 },
];

const sampleTableData = [
  { id: 1, name: 'Product A', sales: 100, growth: '+12%' },
  { id: 2, name: 'Product B', sales: 85, growth: '+5%' },
  { id: 3, name: 'Product C', sales: 72, growth: '-3%' },
  { id: 4, name: 'Product D', sales: 65, growth: '+8%' },
];

const WidgetContent: React.FC<WidgetContentProps> = ({ widget }) => {
  const renderWidgetContent = () => {
    const height = widget.config?.height || 300;
    const data = widget.data && widget.data.length > 0 ? widget.data : getDefaultData(widget.type);
    const showDataQuality = widget.config?.showDataQuality;
    
    // Widget content container with potential data quality indicator
    const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className="relative">
        {children}
        {showDataQuality && widget.dataQuality && (
          <div className="absolute top-1 right-1 z-10">
            <DataQualityIndicator 
              qualityScore={{
                overall: widget.dataQuality.score,
                completeness: widget.dataQuality.completeness,
                accuracy: widget.dataQuality.accuracy,
                consistency: widget.dataQuality.consistency,
                timeliness: widget.dataQuality.timeliness
              }}
              size="small"
            />
          </div>
        )}
      </div>
    );

    switch (widget.type) {
      case 'lineChart':
        return (
          <ContentWrapper>
            <div style={{ height: `${height}px` }}>
              <InsightChart type="line" data={data} />
            </div>
          </ContentWrapper>
        );
      case 'barChart':
        return (
          <ContentWrapper>
            <div style={{ height: `${height}px` }}>
              <InsightChart type="bar" data={data} />
            </div>
          </ContentWrapper>
        );
      case 'pieChart':
        return (
          <ContentWrapper>
            <div style={{ height: `${height}px` }}>
              <InsightChart type="pie" data={data} />
            </div>
          </ContentWrapper>
        );
      case 'kpi':
        return (
          <ContentWrapper>
            <div className="flex flex-col items-center justify-center h-full py-4">
              <span className="text-3xl font-bold">{widget.data?.value || "$123,456"}</span>
              <div className={cn(
                "flex items-center mt-2",
                (widget.data?.trend || 'up') === 'up' ? "text-green-500" : "text-red-500"
              )}>
                {(widget.data?.trend || 'up') === 'up' ? '↑' : '↓'}
                <span className="ml-1">{widget.data?.change || "12%"}</span>
              </div>
            </div>
          </ContentWrapper>
        );
      case 'table':
        return (
          <ContentWrapper>
            <div className="overflow-auto" style={{ maxHeight: `${height}px` }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-muted">
                  <tr>
                    {Object.keys(data[0]).map((header) => (
                      <th 
                        key={header} 
                        className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-gray-200">
                  {data.map((row: any, i: number) => (
                    <tr key={i}>
                      {Object.values(row).map((cell: any, j: number) => (
                        <td key={j} className="px-4 py-2 whitespace-nowrap text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ContentWrapper>
        );
      default:
        return <div>Unsupported widget type</div>;
    }
  };

  const getDefaultData = (type: string) => {
    switch (type) {
      case 'lineChart':
        return sampleLineData;
      case 'barChart':
        return sampleBarData;
      case 'pieChart':
        return samplePieData;
      case 'table':
        return sampleTableData;
      default:
        return [];
    }
  };

  // Render data lineage information if available
  const renderDataLineage = () => {
    if (!widget.dataLineage) return null;
    
    return (
      <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Source: {widget.dataLineage.source}</span>
          <span>Last updated: {new Date(widget.dataLineage.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>
    );
  };

  return (
    <CardContent className="pt-2">
      {renderWidgetContent()}
      {widget.config?.showDataQuality && renderDataLineage()}
    </CardContent>
  );
};

export default WidgetContent;
