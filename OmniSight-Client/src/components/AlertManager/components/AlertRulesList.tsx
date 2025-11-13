
import React from 'react';
import { useAlertContext } from '../context/AlertContext';
import AlertRuleCard from './AlertRuleCard';
import { AlertCircle } from 'lucide-react';

const AlertRulesList: React.FC = () => {
  const { alertRules } = useAlertContext();

  if (alertRules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-lg">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No alert rules defined</h3>
        <p className="text-muted-foreground max-w-md">
          You haven't created any alert rules yet. Create a rule to get notified when important events happen.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {alertRules.map(rule => (
        <AlertRuleCard key={rule.id} rule={rule} />
      ))}
    </div>
  );
};

export default AlertRulesList;
