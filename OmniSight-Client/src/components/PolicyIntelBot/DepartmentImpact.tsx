
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, Building, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Department, PolicyUpdate } from './types';

interface DepartmentImpactProps {
  policy: PolicyUpdate;
  departments: Department[];
  onBack: () => void;
}

const DepartmentImpact: React.FC<DepartmentImpactProps> = ({ 
  policy, 
  departments,
  onBack
}) => {
  const getImpactLevel = (dept: string) => {
    if (!policy.departmentalImpact || !policy.departmentalImpact[dept]) {
      return 'unknown';
    }
    
    const impact = policy.departmentalImpact[dept].toLowerCase();
    if (impact.includes('significant') || impact.includes('major') || impact.includes('high')) {
      return 'high';
    } else if (impact.includes('moderate') || impact.includes('medium')) {
      return 'medium';
    } else if (impact.includes('minimal') || impact.includes('low') || impact.includes('minor')) {
      return 'low';
    } else if (impact.includes('none') || impact.includes('no impact')) {
      return 'none';
    }
    
    return 'unknown';
  };

  const getImpactIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'none':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getImpactBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Impact</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium Impact</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low Impact</Badge>;
      case 'none':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">No Impact</Badge>;
      default:
        return <Badge variant="outline">Unknown Impact</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Policy
          </Button>
        </div>
        
        <div className="pt-2">
          <CardTitle className="flex items-center text-xl">
            <Building className="mr-2 h-5 w-5 text-primary" />
            Departmental Impact Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            How "{policy.title}" affects each department
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {departments.map(department => {
              const impactLevel = getImpactLevel(department.name);
              const impactText = policy.departmentalImpact?.[department.name] || 
                                "Impact information not available for this department.";
              
              return (
                <Card key={department.id} className="overflow-hidden">
                  <CardHeader className="py-3 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getImpactIcon(impactLevel)}
                        <CardTitle className="text-base">{department.name}</CardTitle>
                      </div>
                      {getImpactBadge(impactLevel)}
                    </div>
                  </CardHeader>
                  <CardContent className="py-3">
                    <p className="text-sm">{impactText}</p>
                    
                    {policy.requiredActions && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">Required Actions:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {policy.requiredActions.map((action, index) => (
                            <li key={index} className="text-sm">{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DepartmentImpact;
