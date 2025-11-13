
import React from 'react';
import { ProcessStep } from '../types';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, AlertTriangle, HelpCircle } from 'lucide-react';

interface ProcessStepsListProps {
  steps: ProcessStep[];
}

const ProcessStepsList: React.FC<ProcessStepsListProps> = ({ steps }) => {
  const getStepIcon = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'blocked':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStepStatusText = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'blocked':
        return 'Blocked';
      case 'pending':
        return 'Pending';
      default:
        return '';
    }
  };

  return (
    <div className="bg-card rounded-lg border p-4">
      <h3 className="text-lg font-medium mb-4">Process Steps</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">{getStepIcon(step.status)}</div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <h4 className="font-medium text-sm">{step.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center 
                    ${step.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      step.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                      step.status === 'blocked' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {getStepStatusText(step.status)}
                  </span>
                </div>
                
                {step.owner && (
                  <p className="text-xs text-muted-foreground mt-1">Owner: {step.owner}</p>
                )}
                
                {(step.startTime || step.endTime) && (
                  <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                    {step.startTime && <span>Started: {new Date(step.startTime).toLocaleString()}</span>}
                    {step.endTime && <span>Completed: {new Date(step.endTime).toLocaleString()}</span>}
                  </div>
                )}
                
                {step.notes && step.notes.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium">Notes:</p>
                    <ul className="text-xs text-muted-foreground mt-1 list-disc pl-4">
                      {step.notes.map((note, noteIndex) => (
                        <li key={noteIndex}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {step.dependencies && step.dependencies.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium">Dependencies:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {step.dependencies.map((dep, depIndex) => (
                        <span 
                          key={depIndex}
                          className="text-xs bg-muted px-2 py-0.5 rounded-full"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {index < steps.length - 1 && <Separator className="my-3" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessStepsList;
