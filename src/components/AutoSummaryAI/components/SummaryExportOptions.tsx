
import React, { useState } from 'react';
import { useAutoSummary } from '../context/AutoSummaryContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { FileText, FileImage } from 'lucide-react';

const SummaryExportOptions: React.FC = () => {
  const { exportSummary, isGenerating } = useAutoSummary();
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx'>('pdf');
  
  const handleExport = () => {
    exportSummary(selectedFormat);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Export Summary</h3>
      <p className="text-sm text-muted-foreground">
        Export your summary to share with your team or stakeholders.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card 
          className={`cursor-pointer border-2 transition-all ${
            selectedFormat === 'pdf' ? 'border-primary' : 'border-transparent hover:border-muted'
          }`}
          onClick={() => setSelectedFormat('pdf')}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-center">
              <FileText className="h-10 w-10 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <CardTitle className="text-sm">PDF Document</CardTitle>
            <CardDescription className="text-xs mt-1">
              High-quality document format ideal for sharing and printing
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer border-2 transition-all ${
            selectedFormat === 'docx' ? 'border-primary' : 'border-transparent hover:border-muted'
          }`}
          onClick={() => setSelectedFormat('docx')}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-center">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <CardTitle className="text-sm">Word Document</CardTitle>
            <CardDescription className="text-xs mt-1">
              Editable document format for Microsoft Word
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={handleExport} 
          disabled={isGenerating}
          className="w-full md:w-auto"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export as {selectedFormat.toUpperCase()}
        </Button>
      </div>
    </div>
  );
};

export default SummaryExportOptions;
