
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';

interface ProcessInsightsPromptProps {
  onSubmit: (prompt: string) => void;
  recommendedPrompts: string[];
  isLoading: boolean;
}

const ProcessInsightsPrompt: React.FC<ProcessInsightsPromptProps> = ({ 
  onSubmit,
  recommendedPrompts,
  isLoading 
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const handleRecommendedPrompt = (p: string) => {
    onSubmit(p);
  };

  return (
    <Card className="border-dashed">
      <CardContent className="p-4 space-y-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ask about business process performance..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading || !prompt.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ask'}
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {recommendedPrompts.map((p, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleRecommendedPrompt(p)}
              disabled={isLoading}
            >
              {p}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessInsightsPrompt;
