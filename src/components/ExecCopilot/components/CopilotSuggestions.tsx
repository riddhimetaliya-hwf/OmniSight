
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCopilotContext } from '../context/CopilotContext';
import { SparklesIcon } from 'lucide-react';

const CopilotSuggestions: React.FC = () => {
  const { submitQuery, recentQueries } = useCopilotContext();
  
  const suggestions = [
    "Prepare for my board meeting",
    "Summarize this quarter's performance",
    "What are our top risks this month?",
    "Show me sales forecast vs actual"
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs py-1 h-7"
            onClick={() => submitQuery(suggestion)}
          >
            <SparklesIcon className="h-3 w-3 mr-1.5" />
            {suggestion}
          </Button>
        ))}
      </div>
      
      {recentQueries.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">Recent queries:</p>
          <div className="flex flex-wrap gap-1.5">
            {recentQueries.slice(0, 2).map(query => (
              <Button
                key={query.id}
                variant="ghost"
                size="sm"
                className="text-xs py-1 h-7 italic"
                onClick={() => submitQuery(query.text)}
              >
                "{query.text}"
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CopilotSuggestions;
