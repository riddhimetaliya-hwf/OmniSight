
import React from 'react';
import { Dashboard } from '../types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface DashboardHeaderProps {
  currentDashboard: Dashboard;
  dashboards: Dashboard[];
  onDashboardChange: (dashboardId: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentDashboard,
  dashboards,
  onDashboardChange
}) => {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold">{currentDashboard.name}</h1>
      {currentDashboard.description && (
        <p className="text-muted-foreground">{currentDashboard.description}</p>
      )}
      
      <div className="mt-4">
        <Select
          value={currentDashboard.id}
          onValueChange={onDashboardChange}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select dashboard" />
          </SelectTrigger>
          <SelectContent>
            {dashboards.map(dashboard => (
              <SelectItem key={dashboard.id} value={dashboard.id}>
                {dashboard.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DashboardHeader;
