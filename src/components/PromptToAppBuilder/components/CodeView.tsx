
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppDefinition } from '../types';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeViewProps {
  app: AppDefinition;
}

const CodeView: React.FC<CodeViewProps> = ({ app }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  
  // Generate a simplified JSON representation of the app
  const codeString = JSON.stringify(app, null, 2);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The app configuration has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="border-b bg-muted/50 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">App Configuration</CardTitle>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleCopy}
          className="h-8 px-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="p-0 relative">
        <pre className="overflow-auto p-4 text-xs font-mono text-foreground bg-black/5 rounded-b-md h-[600px]">
          {codeString}
        </pre>
      </CardContent>
    </Card>
  );
};

export default CodeView;
