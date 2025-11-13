
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PolicyCategory, PolicyPriority } from './types';

interface PolicyFiltersProps {
  selectedCategories: PolicyCategory[];
  selectedPriorities: PolicyPriority[];
  onCategoryChange: (categories: PolicyCategory[]) => void;
  onPriorityChange: (priorities: PolicyPriority[]) => void;
}

const CATEGORIES: { value: PolicyCategory; label: string }[] = [
  { value: 'finance', label: 'Finance' },
  { value: 'legal', label: 'Legal' },
  { value: 'procurement', label: 'Procurement' },
  { value: 'hr', label: 'HR' },
  { value: 'it', label: 'IT' },
  { value: 'general', label: 'General' },
];

const PRIORITIES: { value: PolicyPriority; label: string; className: string }[] = [
  { value: 'critical', label: 'Critical', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  { value: 'high', label: 'High', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  { value: 'medium', label: 'Medium', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  { value: 'low', label: 'Low', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
];

const PolicyFilters: React.FC<PolicyFiltersProps> = ({
  selectedCategories,
  selectedPriorities,
  onCategoryChange,
  onPriorityChange,
}) => {
  const toggleCategory = (category: PolicyCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const togglePriority = (priority: PolicyPriority) => {
    if (selectedPriorities.includes(priority)) {
      onPriorityChange(selectedPriorities.filter(p => p !== priority));
    } else {
      onPriorityChange([...selectedPriorities, priority]);
    }
  };

  const clearFilters = () => {
    onCategoryChange([]);
    onPriorityChange([]);
  };

  return (
    <Card>
      <CardHeader className="py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </CardTitle>
          
          {(selectedCategories.length > 0 || selectedPriorities.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map(category => (
                <Badge
                  key={category.value}
                  variant={selectedCategories.includes(category.value) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category.value)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Priority</h4>
            <div className="flex flex-wrap gap-1">
              {PRIORITIES.map(priority => (
                <Badge
                  key={priority.value}
                  variant={selectedPriorities.includes(priority.value) ? 'default' : 'outline'}
                  className={selectedPriorities.includes(priority.value) ? '' : priority.className}
                  onClick={() => togglePriority(priority.value)}
                >
                  {priority.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyFilters;
