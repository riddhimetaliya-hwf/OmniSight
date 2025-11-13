
import React from 'react';
import { useAlertContext } from '../context/AlertContext';
import AlertCard from './AlertCard';
import { AlertCircle } from 'lucide-react';

const AlertList: React.FC = () => {
  const { filteredAlerts } = useAlertContext();

  if (filteredAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-lg">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No alerts found</h3>
        <p className="text-muted-foreground max-w-md">
          No alerts match your current filter criteria. Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {filteredAlerts.map(alert => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
};

export default AlertList;
