
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAutomationContext } from '../context/AutomationContext';
import { Plus, Search, RefreshCcw, Wand2 } from 'lucide-react';
import { CreateAutomationModal } from './CreateAutomationModal';

export const AutomationHeader: React.FC = () => {
  const { filters, updateFilters } = useAutomationContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAISuggestionsModal, setShowAISuggestionsModal] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">AutoPilot</h2>
          <p className="text-muted-foreground">
            Configure automated tasks and workflows to run in the background
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowAISuggestionsModal(true)}>
            <Wand2 className="h-4 w-4 mr-2" />
            AI Suggestions
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Automation
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search automations..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      {showCreateModal && (
        <CreateAutomationModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};
