
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, TrendingDown, Calendar, Clock, AlertTriangle, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface AlertExamplesProps {
  onSelectExample: (example: string) => void;
}

const AlertExamples: React.FC<AlertExamplesProps> = ({ onSelectExample }) => {
  const generalExamples = [
    { text: "Alert me if revenue drops below $100K", icon: <TrendingDown className="h-3 w-3" /> },
    { text: "Notify HR if any PTO request exceeds 10 days", icon: <Calendar className="h-3 w-3" /> },
    { text: "Alert me if response time exceeds 5 seconds", icon: <Clock className="h-3 w-3" /> }
  ];

  const departmentExamples = {
    sales: [
      "Alert if conversion rate drops below 10%",
      "Notify if any deal over $50K hasn't moved stages in 14 days",
      "Alert sales manager if pipeline value decreases by more than 15%"
    ],
    operations: [
      "Alert if inventory falls below 100 units for any product",
      "Notify if shipping time exceeds 3 days average",
      "Alert if production line efficiency drops below 85%"
    ],
    it: [
      "Alert if server load exceeds 90% for more than 10 minutes",
      "Notify if more than 5 failed login attempts within 1 hour",
      "Alert if backup process fails"
    ]
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Example Alerts</p>
      
      <Tabs defaultValue="examples">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="examples">Common Examples</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
        </TabsList>
        
        <TabsContent value="examples" className="pt-4">
          <div className="flex flex-wrap gap-2">
            {generalExamples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSelectExample(example.text)}
                className="flex gap-1 items-center text-xs"
              >
                {example.icon}
                {example.text}
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="departments" className="pt-4 space-y-4">
          {Object.entries(departmentExamples).map(([dept, examples]) => (
            <div key={dept} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium capitalize">{dept}</h4>
              </div>
              <div className="flex flex-wrap gap-2 pl-6">
                {examples.map((example, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectExample(example)}
                    className="text-xs justify-start"
                  >
                    <Bell className="h-3 w-3 mr-1" />
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertExamples;
