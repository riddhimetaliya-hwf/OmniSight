
import { useState, useEffect, useCallback } from 'react';
import { IntelligenceItem, FilterOptions, DigestSettings, MarketIntelState } from '../types';
import { mockIntelligenceItems, mockFilterOptions, mockDigestSettings } from '../mockData';

export const useMarketIntel = () => {
  const [state, setState] = useState<MarketIntelState>({
    items: [],
    isLoading: true,
    error: null,
    filters: mockFilterOptions,
    digestSettings: mockDigestSettings,
    savedItems: []
  });

  // Fetch intelligence items (simulated with mock data)
  const fetchItems = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call
      const items = mockIntelligenceItems;
      
      setState(prev => ({ 
        ...prev, 
        items, 
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to fetch intelligence items', 
        isLoading: false 
      }));
    }
  }, []);

  // Initialize data on component mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  }, []);

  // Update digest settings
  const updateDigestSettings = useCallback((newSettings: Partial<DigestSettings>) => {
    setState(prev => ({
      ...prev,
      digestSettings: { ...prev.digestSettings, ...newSettings }
    }));
  }, []);

  // Filter items based on current filter settings
  const filteredItems = useCallback(() => {
    const { filters } = state;
    
    return state.items.filter(item => {
      // Filter by sources
      if (filters.sources.length > 0 && !filters.sources.includes(item.source)) {
        return false;
      }
      
      // Filter by industries
      if (filters.industries.length > 0 && !item.industries.some(ind => filters.industries.includes(ind))) {
        return false;
      }
      
      // Filter by departments
      if (filters.departments.length > 0 && !item.departments.some(dep => filters.departments.includes(dep))) {
        return false;
      }
      
      // Filter by geographies
      if (filters.geographies.length > 0 && !item.geographies.some(geo => filters.geographies.includes(geo))) {
        return false;
      }
      
      // Filter by topics
      if (filters.topics.length > 0 && !item.topics.some(topic => filters.topics.includes(topic))) {
        return false;
      }
      
      // Filter by alert level
      if (filters.alertLevel && filters.alertLevel.length > 0 && !filters.alertLevel.includes(item.alertLevel)) {
        return false;
      }
      
      // Filter by relevance threshold
      if (filters.relevanceThreshold && item.relevanceScore < filters.relevanceThreshold) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateRange) {
        const publishedDate = new Date(item.publishedAt);
        if (filters.dateRange.from && publishedDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to && publishedDate > filters.dateRange.to) {
          return false;
        }
      }
      
      return true;
    });
  }, [state]);

  // Toggle save item
  const toggleSaveItem = useCallback((id: string) => {
    setState(prev => {
      // Update in main items list
      const updatedItems = prev.items.map(item => 
        item.id === id ? { ...item, saved: !item.saved } : item
      );
      
      // Update saved items list
      const item = updatedItems.find(i => i.id === id);
      let savedItems = [...prev.savedItems];
      
      if (item && item.saved) {
        savedItems = [...savedItems, item];
      } else {
        savedItems = savedItems.filter(i => i.id !== id);
      }
      
      return {
        ...prev,
        items: updatedItems,
        savedItems
      };
    });
  }, []);

  // Toggle forward item
  const forwardItem = useCallback((id: string, emails?: string[]) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, forwarded: true } : item
      )
    }));
    
    // In a real app, this would send an email
    console.log(`Forwarded item ${id} to ${emails?.join(', ') || 'team'}`);
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    ...state,
    filteredItems: filteredItems(),
    updateFilters,
    updateDigestSettings,
    toggleSaveItem,
    forwardItem,
    refreshData
  };
};
