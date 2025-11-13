
import React from 'react';
import { useAutomationContext } from '../context/AutomationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { AutomationStatus, AutomationCategory } from '../types';
import { automationStatusColors } from '../utils';

export const AutomationFilters: React.FC = () => {
  const { filters, updateFilters } = useAutomationContext();

  const handleStatusChange = (status: AutomationStatus, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    
    updateFilters({ status: newStatuses });
  };

  const handleCategoryChange = (category: AutomationCategory, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    updateFilters({ categories: newCategories });
  };

  const handleClearFilters = () => {
    updateFilters({
      status: ['active', 'paused', 'draft', 'error'],
      categories: ['reports', 'notifications', 'data', 'workflows', 'other'],
      search: '',
    });
  };

  return (
    <Card className="bg-muted/40">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Status</h3>
            <div className="space-y-2">
              {Object.entries(automationStatusColors).map(([status, { color, label }]) => (
                <div className="flex items-center space-x-2" key={status}>
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.status.includes(status as AutomationStatus)}
                    onCheckedChange={(checked) => 
                      handleStatusChange(status as AutomationStatus, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`status-${status}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Category</h3>
            <div className="space-y-2">
              {['reports', 'notifications', 'data', 'workflows', 'other'].map((category) => (
                <div className="flex items-center space-x-2" key={category}>
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category as AutomationCategory)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category as AutomationCategory, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
