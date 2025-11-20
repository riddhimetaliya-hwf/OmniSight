
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppDefinition, AppField } from '../types';
import { Download, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppPreviewProps {
  app: AppDefinition;
}

const AppPreview: React.FC<AppPreviewProps> = ({ app }) => {
  const { toast } = useToast();
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Form Submitted",
      description: "Your form data has been submitted successfully!",
    });
  };
  
  const handleAction = (actionType: string) => {
    toast({
      title: "Action Triggered",
      description: `The "${actionType}" action has been triggered.`,
    });
  };
  
  const renderField = (field: AppField) => {
    switch (field.type) {
      case 'input':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}{field.required && " *"}</Label>
            <Input 
              id={field.id} 
              placeholder={field.placeholder} 
              defaultValue={field.defaultValue as string} 
              required={field.required}
            />
          </div>
        );
        
      case 'textarea':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}{field.required && " *"}</Label>
            <Textarea 
              id={field.id} 
              placeholder={field.placeholder} 
              defaultValue={field.defaultValue as string} 
              required={field.required}
            />
          </div>
        );
        
      case 'select':
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}{field.required && " *"}</Label>
            <Select defaultValue={field.options?.[0]}>
              <SelectTrigger id={field.id}>
                <SelectValue placeholder={`Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2" key={field.id}>
            <input 
              type="checkbox" 
              id={field.id} 
              defaultChecked={field.defaultValue as boolean} 
              required={field.required}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor={field.id}>{field.label}{field.required && " *"}</Label>
          </div>
        );
        
      case 'table':
        return (
          <div className="space-y-2" key={field.id}>
            <Label>{field.label}</Label>
            <div className="border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-muted">
                  <tr>
                    {field.options?.map((header, i) => (
                      <th 
                        key={i} 
                        className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-gray-200">
                  {/* Sample table data rows */}
                  {[1, 2, 3].map((row) => (
                    <tr key={row}>
                      {field.options?.map((_, i) => (
                        <td key={i} className="px-4 py-2 text-sm">
                          {i === 0 ? `Item ${row}` : `Data ${row}-${i}`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'card':
        return (
          <div className="space-y-2" key={field.id}>
            <Card className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-base">{field.label}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{field.defaultValue}</div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{app.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-6">
            {app.sections.map((section) => (
              <div key={section.id} className="space-y-4">
                <h3 className="text-lg font-medium">{section.title}</h3>
                <div className="space-y-4">
                  {section.fields.map((field) => renderField(field))}
                </div>
              </div>
            ))}
          </div>
          
          <CardFooter className="px-0 pt-6 flex flex-wrap gap-2">
            {app.actions.map((action) => (
              <Button 
                key={action.id} 
                type={action.type === 'submit' ? 'submit' : 'button'} 
                variant={action.primary ? 'default' : 'outline'}
                onClick={() => action.type !== 'submit' && handleAction(action.type)}
              >
                {action.type === 'submit' && <Send className="w-4 h-4 mr-2" />}
                {action.label}
              </Button>
            ))}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppPreview;
