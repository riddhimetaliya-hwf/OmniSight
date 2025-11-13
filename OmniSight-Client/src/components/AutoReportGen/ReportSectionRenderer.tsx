
import React from "react";
import { ReportSection } from "./types";
import { InsightChart } from "../InsightsEngine";
import { 
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";

interface ReportSectionRendererProps {
  section: ReportSection;
}

const ReportSectionRenderer: React.FC<ReportSectionRendererProps> = ({ section }) => {
  const { type, title, content, insights } = section;

  const renderContent = () => {
    switch (type) {
      case "summary":
        return (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <div className="text-muted-foreground">{content}</div>
          </div>
        );
        
      case "chart":
        return (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            <div className="h-72 w-full">
              <InsightChart type={content.type} data={content.data} />
            </div>
          </div>
        );
        
      case "table":
        return (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  {content.headers.map((header: string, index: number) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.rows.map((row: any[], rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
        
      case "insight":
        return (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights?.slice(0, 2).map(insight => (
                <div key={insight.id} className="border rounded p-4">
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  {insight.chartData && (
                    <div className="h-40 mt-2">
                      <InsightChart 
                        type={insight.chartData.type} 
                        data={insight.chartData.data} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case "text":
        return (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        );
        
      default:
        return <div>Unknown section type</div>;
    }
  };

  return renderContent();
};

export default ReportSectionRenderer;
