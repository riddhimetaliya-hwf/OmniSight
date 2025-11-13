import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  FileText,
  CalendarCheck,
  Mail,
  Mic,
  MicOff,
  Upload,
  Paperclip,
  Sparkles,
  Brain
} from 'lucide-react';
import { useCopilotContext } from '../context/CopilotContext';
import FileUploadZone from './FileUploadZone';
import { FileUpload } from '../types';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const CopilotActions: React.FC = () => {
  const { 
    query, 
    setQuery, 
    submitQuery, 
    isLoading,
    generateBriefing,
    generateReport
  } = useCopilotContext();
  
  const [isRecording, setIsRecording] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [activeTab, setActiveTab] = useState('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() || uploadedFiles.length > 0) {
      submitQuery(query);
      setUploadedFiles([]);
      setShowFileUpload(false);
    }
  };

  const toggleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice to text with advanced query
      setTimeout(() => {
        setQuery("Analyze our Q4 performance against competitors in the enterprise segment and predict Q1 opportunities");
      }, 800);
    } else {
      // Request microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          setActiveTab('voice');
        })
        .catch(() => {
          console.error("Microphone access denied");
        });
    }
  };

  const handleFilesUploaded = (files: FileUpload[]) => {
    setUploadedFiles(files);
    if (files.length > 0) {
      const currentQuery = query || '';
      const fileText = `[${files.length} file(s) attached for analysis]`;
      setQuery(currentQuery + (currentQuery ? ' ' : '') + fileText);
    }
  };

  const smartSuggestions = [
    "Compare Q4 performance vs competitors in our target segments",
    "What are the predictive indicators for Q1 revenue growth?",
    "Analyze customer churn patterns and recommend retention strategies",
    "Identify emerging market opportunities based on current trends",
    "Assess operational efficiency across all departments"
  ];

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Text
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Ask me anything about your business..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowFileUpload(!showFileUpload)}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              <Button type="submit" disabled={!query.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Smart Suggestions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Smart suggestions:
              </div>
              <div className="flex flex-wrap gap-2">
                {smartSuggestions.slice(0, 2).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-3"
                    onClick={() => setQuery(suggestion)}
                  >
                    {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {showFileUpload && (
              <FileUploadZone 
                onFilesUploaded={handleFilesUploaded}
                maxFiles={3}
              />
            )}
          </form>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Button
                onClick={toggleVoiceInput}
                size="lg"
                className={`w-16 h-16 rounded-full ${
                  isRecording 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
              >
                {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isRecording ? 'Listening... Speak your query' : 'Click to start voice input'}
              </p>
              <p className="text-xs text-muted-foreground">
                Try: "What are my top risks this quarter?" or "Show me competitive analysis"
              </p>
            </div>
            {isRecording && (
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1 bg-blue-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 20 + 10}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <FileUploadZone 
            onFilesUploaded={handleFilesUploaded}
            maxFiles={5}
          />
          {uploadedFiles.length > 0 && (
            <Button 
              onClick={() => submitQuery(`Analyze the uploaded files: ${uploadedFiles.map(f => f.name).join(', ')}`)}
              className="w-full"
              disabled={isLoading}
            >
              <Brain className="h-4 w-4 mr-2" />
              Analyze Uploaded Files
            </Button>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => generateBriefing('daily')}>
                <Mail className="mr-2 h-4 w-4" />
                Daily Briefing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generateBriefing('weekly')}>
                <CalendarCheck className="mr-2 h-4 w-4" />
                Weekly Briefing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generateReport('Finance')}>
                <FileText className="mr-2 h-4 w-4" />
                Financial Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generateReport('Operations')}>
                <FileText className="mr-2 h-4 w-4" />
                Operations Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleVoiceInput}
          className={`${isRecording ? 'text-red-500 animate-pulse' : ''}`}
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default CopilotActions;
