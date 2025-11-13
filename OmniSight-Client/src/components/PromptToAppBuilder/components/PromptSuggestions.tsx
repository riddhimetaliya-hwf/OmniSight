
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SparklesIcon, LayoutGrid, ListTodo, FileText, Table } from 'lucide-react';
import { usePromptToApp } from '../context/PromptToAppContext';
import { useAppGenerator } from '../hooks/useAppGenerator';

const PromptSuggestions: React.FC = () => {
  const { setPrompt } = usePromptToApp();
  const { generateApp } = useAppGenerator();

  const suggestions = [
    {
      title: "Forms and Inputs",
      icon: <FileText className="h-4 w-4" />,
      examples: [
        "Create a form for collecting customer feedback with ratings",
        "Build a contact form with name, email, and message fields",
        "Create a multi-step registration form with validation"
      ]
    },
    {
      title: "Workflows",
      icon: <ListTodo className="h-4 w-4" />,
      examples: [
        "Build a leave request form for HR with manager approval flow",
        "Create an expense reimbursement workflow with finance approval",
        "Design a document approval workflow with multiple reviewers"
      ]
    },
    {
      title: "Dashboards",
      icon: <LayoutGrid className="h-4 w-4" />,
      examples: [
        "Build a sales dashboard showing regional performance",
        "Create a project status dashboard with task completion metrics",
        "Design a marketing campaign performance dashboard"
      ]
    },
    {
      title: "Data Views",
      icon: <Table className="h-4 w-4" />,
      examples: [
        "Create a CRM-style interface that shows all customer details",
        "Build an inventory management interface with filtering",
        "Design a staff directory with search and filter options"
      ]
    }
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  const handleBuildClick = (example: string) => {
    setPrompt(example);
    generateApp(example);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-1">
          <SparklesIcon className="h-4 w-4 text-primary" />
          App Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((category, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-1">
              {category.icon}
              {category.title}
            </h3>
            <div className="space-y-1">
              {category.examples.map((example, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs justify-start h-auto py-1 text-left w-4/5 hover:bg-muted truncate"
                    onClick={() => handleExampleClick(example)}
                  >
                    {example}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-6 text-xs"
                    onClick={() => handleBuildClick(example)}
                  >
                    Build
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PromptSuggestions;
