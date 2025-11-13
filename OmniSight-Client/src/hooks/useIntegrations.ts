import { useState, useEffect, useCallback } from 'react';
import { integrationService, Integration, Category, IntegrationData } from '@/services/integrationService';

interface UseIntegrationsReturn {
  integrations: Integration[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addIntegration: (integration: Omit<Integration, 'id' | 'createdAt'>) => Promise<Integration>;
  updateIntegration: (id: string, updates: Partial<Integration>) => Promise<Integration>;
  deleteIntegration: (id: string) => Promise<void>;
  filterIntegrations: (searchText: string, selectedCategory: string) => Promise<Integration[]>;
  lastUpdated: string | null;
}

export const useIntegrations = (): UseIntegrationsReturn => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get cached data first
      const cachedData = integrationService.getCachedData();
      if (cachedData) {
        setIntegrations(cachedData.integrations);
        setCategories(cachedData.categories);
        setLastUpdated(cachedData.lastUpdated);
        setLoading(false);
      }

      // Fetch fresh data from JSON file
      const data: IntegrationData = await integrationService.fetchIntegrationData();
      
      setIntegrations(data.integrations);
      setCategories(data.categories);
      setLastUpdated(data.lastUpdated);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch integration data');
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const addIntegration = useCallback(async (integration: Omit<Integration, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const newIntegration = await integrationService.addIntegration(integration);
      
      // Update local state
      setIntegrations(prev => [...prev, newIntegration]);
      
      // Refresh categories to update counts
      const updatedCategories = await integrationService.getCategories();
      setCategories(updatedCategories);
      
      return newIntegration;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add integration';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateIntegration = useCallback(async (id: string, updates: Partial<Integration>) => {
    try {
      setError(null);
      const updatedIntegration = await integrationService.updateIntegration(id, updates);
      
      // Update local state
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === id ? updatedIntegration : integration
        )
      );
      
      // Refresh categories to update counts
      const updatedCategories = await integrationService.getCategories();
      setCategories(updatedCategories);
      
      return updatedIntegration;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update integration';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const deleteIntegration = useCallback(async (id: string) => {
    try {
      setError(null);
      await integrationService.deleteIntegration(id);
      
      // Update local state
      setIntegrations(prev => prev.filter(integration => integration.id !== id));
      
      // Refresh categories to update counts
      const updatedCategories = await integrationService.getCategories();
      setCategories(updatedCategories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete integration';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const filterIntegrations = useCallback(async (searchText: string, selectedCategory: string) => {
    try {
      return await integrationService.filterIntegrations(searchText, selectedCategory);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to filter integrations';
      setError(errorMessage);
      return [];
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
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
  };
}; 