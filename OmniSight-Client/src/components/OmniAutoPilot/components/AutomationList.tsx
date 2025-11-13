
import React, { useState } from 'react';
import { useAutomationContext } from '../context/AutomationContext';
import { AlertCircle } from 'lucide-react';
import { AutomationCard } from './AutomationCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AutomationFilters } from './AutomationFilters';

export const AutomationList: React.FC = () => {
  const { filteredAutomations } = useAutomationContext();
  const [showFilters, setShowFilters] = useState(false);

  if (filteredAutomations.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        {showFilters && <AutomationFilters />}
        
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-lg">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No automations found</h3>
          <p className="text-muted-foreground max-w-md">
            No automations match your current filter criteria. Adjust your filters or create a new automation to get started.
          </p>
        </div>
      </div>
    );
  }

  // Group automations by category
  const automationsByCategory = filteredAutomations.reduce((acc, automation) => {
    if (!acc[automation.category]) {
      acc[automation.category] = [];
    }
    acc[automation.category].push(automation);
    return acc;
  }, {} as Record<string, typeof filteredAutomations>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Badge variant="outline" className="text-sm">
            {filteredAutomations.length} automation{filteredAutomations.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>
      
      {showFilters && <AutomationFilters />}

      {Object.entries(automationsByCategory).map(([category, automations]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-medium capitalize">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automations.map(automation => (
              <AutomationCard key={automation.id} automation={automation} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
