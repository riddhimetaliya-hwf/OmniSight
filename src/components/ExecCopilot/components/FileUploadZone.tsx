
import React, { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  X, 
  Check,
  AlertCircle 
} from 'lucide-react';
import { FileUpload } from '../types';

interface FileUploadZoneProps {
  onFilesUploaded: (files: FileUpload[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ 
  onFilesUploaded, 
  maxFiles = 5,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv']
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleFileSelect = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files).slice(0, maxFiles - uploadedFiles.length);
    
    for (const file of fileArray) {
      try {
        const uploadedFile = await simulateUpload(file);
        setUploadedFiles(prev => {
          const newFiles = [...prev, uploadedFile];
          onFilesUploaded(newFiles);
          return newFiles;
        });
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    
    setUploadProgress({});
  }, [uploadedFiles.length, maxFiles, onFilesUploaded, simulateUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId);
      onFilesUploaded(newFiles);
      return newFiles;
    });
  }, [onFilesUploaded]);

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

  return (
    <div className="space-y-4">
      <Card 
        className={`border-2 border-dashed transition-all duration-300 ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <CardContent className="p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Drop files here or click to browse
          </p>
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Select Files
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Supports: Images, PDF, Word, Excel, CSV
          </p>
        </CardContent>
      </Card>

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
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                  <Check className="h-3 w-3 mr-1" />
                  Uploaded
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
    </div>
  );
};

export default FileUploadZone;
