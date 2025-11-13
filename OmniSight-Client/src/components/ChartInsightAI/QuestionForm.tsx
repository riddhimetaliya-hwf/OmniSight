
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircleQuestion, 
  Sparkles,
  Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuestionFormProps {
  onSubmit: (question: string) => void;
  isLoading?: boolean;
}

const EXAMPLE_QUESTIONS = [
  "Why is this number red?",
  "Compare this to last year",
  "What caused this spike?",
  "What's driving the decline in Q3?",
  "Is this performance normal?",
  "What can we learn from this trend?"
];

const QuestionForm: React.FC<QuestionFormProps> = ({ 
  onSubmit,
  isLoading = false
}) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
      setQuestion('');
    }
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircleQuestion className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Ask about this chart</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Ask a question about this data..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!question.trim() || isLoading}
          className="gap-1"
        >
          <Search className="h-4 w-4" />
          {isLoading ? 'Analyzing...' : 'Ask'}
        </Button>
      </form>
      
      <Separator className="my-3" />
      
      <div>
        <div className="flex items-center gap-1 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs text-muted-foreground">Example questions:</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {EXAMPLE_QUESTIONS.map((example, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-muted"
              onClick={() => handleExampleClick(example)}
            >
              {example}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
