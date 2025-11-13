
import React from 'react';
import { useKPIContext } from './context/KPIContext';
import KPICard from './KPICard';

const KPIGrid: React.FC = () => {
  const { filteredKPIs } = useKPIContext();

  if (filteredKPIs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-semibold mb-2">No KPIs match your filters</h3>
        <p className="text-muted-foreground">
          Try adjusting your filter criteria or add a new KPI
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredKPIs.map((kpi) => (
        <KPICard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
};

export default KPIGrid;
