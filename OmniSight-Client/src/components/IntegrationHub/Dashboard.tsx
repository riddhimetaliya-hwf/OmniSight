
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Filter, Search, ArrowUpDown, RefreshCw, AlertCircle, Download, Settings } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DashboardOverview from './components/DashboardOverview';
import IntegrationCategories from './components/IntegrationCategories';
import EnhancedIntegrationCard from './components/EnhancedIntegrationCard';
import BulkActions from './components/BulkActions';
import ConfigurationModal from './components/ConfigurationModal';
import AddIntegrationModal from './components/AddIntegrationModal';
import { useIntegrations } from '@/hooks/useIntegrations';
import { Integration, integrationService } from '@/services/integrationService';

export const IntegrationHub: React.FC = () => {
  const { toast } = useToast();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [addIntegrationModalOpen, setAddIntegrationModalOpen] = useState(false);
  const [filteredIntegrations, setFilteredIntegrations] = useState<Integration[]>([]);

  const {
    integrations,
    categories,
    loading,
    error,
    refreshData,
    addIntegration,
    updateIntegration,
    deleteIntegration,
    filterIntegrations,
    lastUpdated
  } = useIntegrations();

  // Filter integrations based on search and category
  useEffect(() => {
    const filterData = async () => {
      const filtered = await filterIntegrations(searchText, selectedCategory);
      setFilteredIntegrations(filtered);
    };
    
    if (!loading) {
      filterData();
    }
  }, [integrations, searchText, selectedCategory, filterIntegrations, loading]);

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(filteredIntegrations.map(i => i.id));
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: `Bulk ${action}`,
      description: `${action} operation applied to ${selectedItems.length} integrations.`,
    });
    setSelectedItems([]);
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigModalOpen(true);
  };

  const handleCloseConfigModal = () => {
    setConfigModalOpen(false);
    setSelectedIntegration(null);
  };

  const handleAddIntegration = async (newIntegration: Omit<Integration, 'id' | 'createdAt'>) => {
    try {
      // Check if auto-download is enabled (default: false)
      const autoDownload = localStorage.getItem('integrationAutoDownload') === 'true';
      
      await addIntegration(newIntegration);
      
      const message = autoDownload 
        ? `${newIntegration.name} has been added successfully. Data saved to localStorage and JSON file downloaded.`
        : `${newIntegration.name} has been added successfully. Data saved to localStorage. Use the Export button to download the JSON file.`;
      
      toast({
        title: 'Integration Added',
        description: message,
      });
    } catch (error) {
      toast({
        title: 'Error Adding Integration',
        description: error instanceof Error ? error.message : 'Failed to add integration',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteIntegration = async (integration: Integration) => {
    try {
      // Check if auto-download is enabled (default: false)
      const autoDownload = localStorage.getItem('integrationAutoDownload') === 'true';
      
      await deleteIntegration(integration.id);
      
      const message = autoDownload 
        ? `${integration.name} has been deleted. Data saved to localStorage and JSON file downloaded.`
        : `${integration.name} has been deleted. Data saved to localStorage. Use the Export button to download the JSON file.`;
      
      toast({
        title: 'Integration Deleted',
        description: message,
      });
    } catch (error) {
      toast({
        title: 'Error Deleting Integration',
        description: error instanceof Error ? error.message : 'Failed to delete integration',
        variant: 'destructive'
      });
    }
  };

  const handleExportData = async () => {
    try {
      await integrationService.exportIntegrationData();
      toast({
        title: 'Data Exported',
        description: 'Integration data has been exported as integration.json',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to export data',
        variant: 'destructive'
      });
    }
  };

  const toggleAutoDownload = () => {
    const current = localStorage.getItem('integrationAutoDownload') === 'true';
    localStorage.setItem('integrationAutoDownload', (!current).toString());
    toast({
      title: 'Auto-Download Setting Updated',
      description: `Auto-download is now ${!current ? 'enabled' : 'disabled'}`,
    });
  };

  const isAutoDownloadEnabled = localStorage.getItem('integrationAutoDownload') === 'true';

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Loading integrations...</span>
          </div>
        </div>
      ) : (
        <>
          <DashboardOverview integrations={integrations} />

          {/* Integration Categories */}
          <IntegrationCategories 
            onCategorySelect={setSelectedCategory}
            activeCategory={selectedCategory}
            categories={categories}
          />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Integration Hub</h2>
              <p className="text-muted-foreground">Connect and configure enterprise systems with OmniSight</p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button 
                onClick={() => setAddIntegrationModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Integration
              </Button>
              <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search integrations..." 
                  className="pl-9" 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <Button size="icon" variant="outline" className="flex-shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="flex-shrink-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="flex-shrink-0"
                onClick={handleExportData}
                title="Export Integration Data"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant={isAutoDownloadEnabled ? "default" : "outline"}
                className="flex-shrink-0"
                onClick={toggleAutoDownload}
                title={`Auto-download is ${isAutoDownloadEnabled ? 'enabled' : 'disabled'}`}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredIntegrations.map((integration) => (
              <div key={integration.id} className="relative h-full">
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Checkbox
                    checked={selectedItems.includes(integration.id)}
                    onCheckedChange={() => handleSelectItem(integration.id)}
                  />
                </div>

                <EnhancedIntegrationCard
                  name={integration.name}
                  description={integration.description}
                  logoSrc={integration.logoSrc}
                  status={integration.status}
                  lastSync={integration.lastSync}
                  dataPoints={integration.dataPoints}
                  connectionType={integration.connectionType}
                  healthScore={integration.healthScore}
                  syncProgress={integration.syncProgress}
                  dataFlow={integration.dataFlow}
                  onConfigure={() => handleConfigure(integration)}
                  onView={() => toast({ 
                    title: `View ${integration.name} details`,
                    description: "Opening detailed view..."
                  })}
                  onPause={() => toast({
                    title: `${integration.name} paused`,
                    description: "Synchronization has been paused."
                  })}
                  onSync={() => toast({
                    title: `${integration.name} sync started`,
                    description: "Manual synchronization initiated."
                  })}
                  onDelete={() => handleDeleteIntegration(integration)}
                  className="group hover:bg-gray-50/50 h-full"
                />
              </div>
            ))}
          </div>
          
          {filteredIntegrations.length === 0 && searchText && (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/40">
              <p className="text-muted-foreground mb-2">No integrations found matching "{searchText}"</p>
              <Button variant="outline" size="sm" onClick={() => setSearchText('')}>
                Clear search
              </Button>
            </div>
          )}

          {/* Bulk Actions */}
          <BulkActions
            selectedItems={selectedItems}
            totalItems={filteredIntegrations.length}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onBulkSync={() => handleBulkAction('sync')}
            onBulkPause={() => handleBulkAction('pause')}
            onBulkConfigure={() => handleBulkAction('configure')}
            onBulkDelete={() => handleBulkAction('delete')}
          />

          {/* Configuration Modal */}
          {selectedIntegration && (
            <ConfigurationModal
              isOpen={configModalOpen}
              onClose={handleCloseConfigModal}
              integration={selectedIntegration}
            />
          )}

          {/* Add Integration Modal */}
          <AddIntegrationModal
            isOpen={addIntegrationModalOpen}
            onClose={() => setAddIntegrationModalOpen(false)}
            onIntegrationAdded={handleAddIntegration}
          />

          {/* Last Updated Info */}
          {lastUpdated && (
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
              <div className="flex items-center gap-4">
                <span>Last updated: {new Date(lastUpdated).toLocaleString()}</span>
                <span className="text-blue-600">Data saved to localStorage</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportData}
                  className="h-6 px-2"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshData}
                  className="h-6 px-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
