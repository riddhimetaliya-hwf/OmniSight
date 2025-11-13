
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2, Sparkles, Briefcase, DollarSign, Users, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface NaturalLanguageInputProps {
  onSubmit: (description: string) => void;
}

export const NaturalLanguageInput: React.FC<NaturalLanguageInputProps> = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('examples');
  
  const examples = [
    "Every Friday, email finance summary to CFO",
    "When new deal closes, start onboarding checklist",
    "Every day at 5PM, remind Sales team of unclosed deals",
    "If support tickets exceed 50, notify the support manager",
    "Monthly on the 1st, generate KPI report and send to leadership"
  ];

  const scenariosByDepartment = {
    finance: [
      "If invoice is unpaid after 15 days → Flag for follow-up + email accounting",
      "When expense report submitted → Route to manager then accounting",
      "When quarterly filing due date approaches → Alert finance team and CEO"
    ],
    sales: [
      "When lead score > 80 → Auto-assign to senior SDR and email introduction",
      "If deal sits in same stage for 14 days → Alert sales manager",
      "When deal size > $50K → Add additional approval step + executive review"
    ],
    hr: [
      "If employee submits PTO → Update calendar + alert manager + payroll sync",
      "When new hire paperwork complete → Trigger IT equipment ordering",
      "If training completion rate < 80% → Schedule follow-up sessions"
    ],
    operations: [
      "If part inventory < 20 units → Create PO and notify supplier contact",
      "When shipment delayed → Alert customer success + update delivery dashboard",
      "If equipment maintenance overdue → Create priority ticket for facilities"
    ]
  };

  const aiPrompts = [
    "Create an approval workflow for all expenses over $5,000",
    "Alert me when average handling time goes above 10 minutes",
    "Automate task assignment when deal is marked as closed-won",
    "Send weekly summary of performance anomalies to COO",
    "Create escalation path when SLA breach is imminent",
    "Auto-categorize and route incoming support tickets"
  ];
  
  const handleExampleClick = (example: string) => {
    setInput(example);
  };
  
  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);
    }
  };

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case 'finance':
        return <DollarSign className="h-4 w-4" />;
      case 'sales':
        return <Briefcase className="h-4 w-4" />;
      case 'hr':
        return <Users className="h-4 w-4" />;
      case 'operations':
        return <Package className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Describe your automation in plain language, and we'll convert it into a workflow.
        </p>
        
        <Textarea
          placeholder="Example: Every Monday at 9am, email weekly sales report to the sales team"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="examples">Quick Examples</TabsTrigger>
          <TabsTrigger value="scenarios">Department Scenarios</TabsTrigger>
          <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="examples" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                onClick={() => handleExampleClick(example)}
                className="text-xs"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {example}
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="scenarios" className="space-y-4">
          {Object.entries(scenariosByDepartment).map(([department, scenarios]) => (
            <div key={department} className="space-y-2">
              <div className="flex items-center gap-2">
                {getDepartmentIcon(department)}
                <h3 className="text-sm font-medium capitalize">{department}</h3>
              </div>
              <div className="flex flex-wrap gap-2 pl-6">
                {scenarios.map((scenario, idx) => (
                  <Button 
                    key={idx} 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleExampleClick(scenario)}
                    className="text-xs justify-start text-left"
                  >
                    {scenario}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4">
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className="self-start mb-2 bg-purple-50 text-purple-700 border-purple-200">
              AI-Suggested Workflows
            </Badge>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {aiPrompts.map((prompt, idx) => (
                <Button 
                  key={idx} 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExampleClick(prompt)}
                  className="text-xs justify-start h-auto py-2"
                >
                  <Wand2 className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="text-left">{prompt}</span>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Button 
        onClick={handleSubmit} 
        disabled={!input.trim()} 
        className="w-full"
      >
        <Wand2 className="h-4 w-4 mr-2" />
        Generate Automation
      </Button>
    </div>
  );
};
