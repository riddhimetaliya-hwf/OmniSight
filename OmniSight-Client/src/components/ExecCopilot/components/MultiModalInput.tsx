import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Image, 
  FileText, 
  Mic, 
  Send,
  X,
  Check,
  Camera,
  File,
  Brain,
  Sparkles
} from 'lucide-react';
import { useCopilotContext } from '../context/CopilotContext';
import { FileUpload } from '../types';

const MultiModalInput: React.FC = () => {
  const { query, setQuery, submitQuery, isLoading } = useCopilotContext();
  const [activeMode, setActiveMode] = useState<'text' | 'voice' | 'image' | 'document'>('text');
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const simulateUpload = useCallback((file: File): Promise<FileUpload> => {
    return new Promise((resolve) => {
      const fileId = `file-${Date.now()}-${Math.random()}`;
      let progress = 0;
      
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        setUploadProgress(prev => ({ ...prev, [fileId]: Math.min(progress, 100) }));
        
        if (progress >= 100) {
          clearInterval(interval);
          resolve({
            id: fileId,
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString()
          });
        }
      }, 200);
    });
  }, []);

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files).slice(0, 5);
    
    for (const file of fileArray) {
      try {
        const uploadedFile = await simulateUpload(file);
        setUploadedFiles(prev => [...prev, uploadedFile]);
        
        // Add AI analysis prompt
        const analysisPrompt = `Analyze the uploaded ${file.type.startsWith('image/') ? 'image' : 'document'}: ${file.name}`;
        setQuery(query ? `${query}\n${analysisPrompt}` : analysisPrompt);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    
    setUploadProgress({});
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice-to-text
      setTimeout(() => {
        setQuery("Analyze our market position and competitive landscape with focus on enterprise segment growth opportunities and potential risks for Q1 2024");
      }, 1000);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          setActiveMode('voice');
        })
        .catch(() => {
          console.error("Microphone access denied");
        });
    }
  };

  const handleSubmit = () => {
    if (query.trim() || uploadedFiles.length > 0) {
      let finalQuery = query;
      if (uploadedFiles.length > 0) {
        finalQuery += `\n\nFiles for analysis: ${uploadedFiles.map(f => f.name).join(', ')}`;
      }
      submitQuery(finalQuery);
      setUploadedFiles([]);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const smartPrompts = [
    "Analyze this financial report for key trends and anomalies",
    "Compare these market research documents and identify opportunities",
    "Extract insights from this presentation and suggest improvements",
    "Review this contract for potential risks and recommendations"
  ];

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Multi-Modal AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-3">
              <Textarea
                placeholder="Ask me anything about your business, upload files for analysis, or describe what you need..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[120px] resize-none"
                disabled={isLoading}
              />
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Smart prompts:</div>
                <div className="flex flex-wrap gap-2">
                  {smartPrompts.slice(0, 2).map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => setQuery(prompt)}
                    >
                      {prompt.substring(0, 30)}...
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <div className="text-center space-y-4">
              <Button
                onClick={toggleVoiceRecording}
                size="lg"
                className={`w-20 h-20 rounded-full transition-all duration-300 ${
                  isRecording 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/25 animate-pulse' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25'
                }`}
              >
                <Mic className="h-8 w-8" />
              </Button>
              <div className="space-y-2">
                <p className="font-medium">
                  {isRecording ? 'Listening... Speak your query' : 'Click to start voice input'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Try: "Analyze Q4 performance" or "Show competitive analysis"
                </p>
              </div>
              {isRecording && (
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1 bg-red-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 20 + 10}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <Camera className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload charts, graphs, presentations, or any business visuals
              </p>
              <Button
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Images
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="document" className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="document-upload"
              />
              <FileText className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload reports, spreadsheets, presentations, and documents
              </p>
              <Button
                variant="outline"
                onClick={() => document.getElementById('document-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Documents
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Ready for Analysis</h4>
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                    <Check className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={(!query.trim() && uploadedFiles.length === 0) || isLoading}
            className="gap-2"
          >
            <Brain className="h-4 w-4" />
            {uploadedFiles.length > 0 ? 'Analyze Files' : 'Send Query'}
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiModalInput;
