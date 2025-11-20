
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, DollarSign, CalendarClock } from 'lucide-react';
import { prebuiltTemplates } from '../data/templates';

interface WorkflowTemplateSelectorProps {
  onSelect: (templateId: string) => void;
  onCancel: () => void;
}

export const WorkflowTemplateSelector: React.FC<WorkflowTemplateSelectorProps> = ({
  onSelect,
  onCancel,
}) => {
  const getTemplateIcon = (category: string) => {
    switch (category) {
      case 'finance':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'sales':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'hr':
        return <CalendarClock className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Choose a Workflow Template</h2>
        <p className="text-muted-foreground">
          Get started quickly with a pre-built workflow template or create a custom workflow from scratch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {prebuiltTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(template.id)}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="bg-gray-100 p-2 rounded-full">
                  {getTemplateIcon(template.category)}
                </div>
                <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full uppercase">
                  {template.category}
                </span>
              </div>
              <CardTitle className="text-lg mt-4">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 flex justify-end">
              <Button variant="ghost" size="sm">
                Use Template <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Create from scratch option */}
        <Card className="border-dashed hover:shadow-md transition-shadow cursor-pointer" onClick={onCancel}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="bg-gray-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-gray-500"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full uppercase">
                Custom
              </span>
            </div>
            <CardTitle className="text-lg mt-4">Start from Scratch</CardTitle>
            <CardDescription>Create a custom workflow with your own triggers, conditions, and actions.</CardDescription>
          </CardHeader>
          <CardFooter className="pt-2 flex justify-end">
            <Button variant="ghost" size="sm">
              Create Custom <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
