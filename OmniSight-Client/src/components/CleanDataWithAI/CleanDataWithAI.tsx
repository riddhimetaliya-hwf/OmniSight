
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  CheckCircle, 
  X, 
  Undo, 
  Redo, 
  List, 
  Copy, 
  Search, 
  FileSearch 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CommandInput from './CommandInput';
import DataPreview from './DataPreview';
import CleaningHistory from './CleaningHistory';
import { useCleanData } from './useCleanData';
import { mockDataset } from './mockData';
import ColumnSelector from './ColumnSelector';

const CleanDataWithAI: React.FC = () => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    dataset,
    cleaningSteps,
    pendingChanges,
    isProcessing,
    applyCleaningCommand,
    undoLastStep,
    redoLastStep,
    applyPendingChanges,
    clearPendingChanges,
    exportCleanedData
  } = useCleanData(mockDataset);

  const handleCommandSubmit = async (command: string) => {
    if (!command.trim()) return;

    try {
      await applyCleaningCommand(command, selectedColumns);
    } catch (error) {
      toast({
        title: "Error processing command",
        description: (error as Error).message || "Failed to process cleaning command",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    exportCleanedData();
    toast({
      title: "Data exported",
      description: "Cleaned data has been exported successfully",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Data Cleaning Assistant
            </CardTitle>
            <CardDescription>
              Clean and prepare your data using natural language commands
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Copy className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="command" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="command">Clean Data</TabsTrigger>
            <TabsTrigger value="history">Cleaning History</TabsTrigger>
          </TabsList>

          <TabsContent value="command" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="col-span-1">
                <ColumnSelector 
                  dataset={dataset}
                  selectedColumns={selectedColumns}
                  onSelectColumns={setSelectedColumns}
                />
              </div>

              <div className="col-span-1 lg:col-span-2 space-y-4">
                <CommandInput 
                  onSubmit={handleCommandSubmit}
                  isProcessing={isProcessing}
                  selectedColumns={selectedColumns}
                />

                {pendingChanges && (
                  <div className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-sm">Preview Changes</h3>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={clearPendingChanges}
                        >
                          <X className="mr-1 h-3 w-3" /> Discard
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={applyPendingChanges}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" /> Apply
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <DataPreview 
                      before={pendingChanges.before}
                      after={pendingChanges.after}
                      columns={pendingChanges.columns}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Data Preview</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={undoLastStep}
                    disabled={cleaningSteps.length === 0}
                  >
                    <Undo className="mr-1 h-3 w-3" /> Undo
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={redoLastStep}
                  >
                    <Redo className="mr-1 h-3 w-3" /> Redo
                  </Button>
                </div>
              </div>
              <DataPreview 
                columns={dataset.columns}
                data={dataset.columns[0]?.data.slice(0, 5).map((_, idx) => {
                  return dataset.columns.reduce((row, col) => {
                    row[col.name] = col.data[idx];
                    return row;
                  }, {} as Record<string, any>);
                })}
              />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <CleaningHistory steps={cleaningSteps} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CleanDataWithAI;
