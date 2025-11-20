import { useState, useEffect, useCallback } from 'react';
import { marketIntelService, MarketIntelItem, MarketIntelData } from '@/services/marketIntelService';

export const useMarketIntelData = () => {
  const [items, setItems] = useState<MarketIntelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await marketIntelService.fetchMarketIntelData();
      setItems(data.items);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market intelligence data');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await marketIntelService.refreshData();
      setItems(data.items);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh market intelligence data');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterItems = useCallback((
    searchQuery: string = '', 
    filters: {
      companies?: string[];
      newsTypes?: string[];
      dateRange?: { from?: Date; to?: Date };
    } = {}
  ) => {
    return marketIntelService.filterItems(items, searchQuery, filters);
  }, [items]);

  const getUniqueCompanies = useCallback(() => {
    return marketIntelService.getUniqueCompanies(items);
  }, [items]);

  const getUniqueNewsTypes = useCallback(() => {
    return marketIntelService.getUniqueNewsTypes(items);
  }, [items]);

  const getUniqueSources = useCallback(() => {
    return marketIntelService.getUniqueSources(items);
  }, [items]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    items,
    loading,
    error,
    lastUpdated,
    fetchData,
    refreshData,
    filterItems,
    getUniqueCompanies,
    getUniqueNewsTypes,
    getUniqueSources
  };
}; 