
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportFormat } from "./types";
import { FileIcon, FileText, FileSpreadsheet, FileCode } from "lucide-react";

interface ReportFormatOptionsProps {
  format: ReportFormat;
  onFormatChange: (format: ReportFormat) => void;
}

const ReportFormatOptions: React.FC<ReportFormatOptionsProps> = ({
  format,
  onFormatChange
}) => {
  const formatOptions: { 
    id: ReportFormat; 
    label: string; 
    icon: React.ReactNode; 
    description: string 
  }[] = [
    {
      id: "pdf",
      label: "PDF Document",
      icon: <FileIcon className="h-10 w-10" />,
      description: "Standard portable document format for sharing and printing"
    },
    {
      id: "docx",
      label: "Word Document",
      icon: <FileText className="h-10 w-10" />,
      description: "Editable document for Microsoft Word"
    },
    {
      id: "xlsx",
      label: "Excel Spreadsheet",
      icon: <FileSpreadsheet className="h-10 w-10" />,
      description: "Data-focused format with interactive tables and charts"
    },
    {
      id: "html",
      label: "HTML",
      icon: <FileCode className="h-10 w-10" />,
      description: "Web-based format for online viewing and embedding"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Format</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {formatOptions.map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer border-2 transition-all ${
                format === option.id 
                  ? "border-primary bg-primary/5" 
                  : "border-transparent hover:border-muted"
              }`}
              onClick={() => onFormatChange(option.id)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-3 text-primary">
                  {option.icon}
                </div>
                <h3 className="font-medium mb-1">{option.label}</h3>
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFormatOptions;
