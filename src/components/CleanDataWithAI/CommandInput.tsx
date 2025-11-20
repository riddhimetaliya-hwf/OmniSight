
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MessageSquare, Wand2, Sparkles, Clock } from 'lucide-react';

interface CommandInputProps {
  onSubmit: (command: string, selectedColumns: string[]) => Promise<void>;
  selectedColumns: string[];
  isProcessing: boolean;
}

const COMMON_COMMANDS = [
  "Remove all null rows",
  "Format all dates to MM/DD/YYYY",
  "Convert EUR to USD",
  "Standardize names to Title Case",
  "Replace missing values with 0",
  "Remove duplicates",
  "Round numbers to 2 decimal places"
];

const CommandInput: React.FC<CommandInputProps> = ({ 
  onSubmit,
  selectedColumns,
  isProcessing
}) => {
  const [command, setCommand] = useState('');
  const [activeTab, setActiveTab] = useState('input');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      try {
        await onSubmit(command, selectedColumns);
      } catch (error) {
        console.error('Error submitting command:', error);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCommand(suggestion);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-primary mr-2" />
          <span>Data Cleaning Command</span>
        </CardTitle>
        <CardDescription>
          Use natural language to describe how you want to clean your data
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="input">Command Input</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Type cleaning command (e.g., 'Remove all null rows')"
                  className="pr-10"
                  disabled={isProcessing}
                />
                {command && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setCommand('')}
                  >
                    &times;
                  </Button>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={!command.trim() || isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Clean'}
              </Button>
            </form>
            
            <div className="mt-4">
              <div className="flex items-center mb-2 text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                Recent commands
              </div>
              <div className="flex flex-wrap gap-2">
                {["Remove null values", "Format dates"].map((cmd, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(cmd)}
                  >
                    {cmd}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="suggestions">
            <div className="space-y-4">
              <div className="flex items-center mb-2 text-sm text-muted-foreground">
                <Sparkles className="mr-2 h-4 w-4" />
                Common cleaning operations
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {COMMON_COMMANDS.map((cmd, i) => (
                  <Button 
                    key={i} 
                    variant="outline"
                    className="justify-start text-left font-normal h-auto py-2"
                    onClick={() => {
                      handleSuggestionClick(cmd);
                      setActiveTab('input');
                    }}
                  >
                    <Wand2 className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                    <span className="truncate">{cmd}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommandInput;
