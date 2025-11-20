export interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'syncing' | 'failed';
  logoSrc: string;
  lastSync: string;
  dataPoints: number;
  connectionType: string;
  healthScore: number;
  syncProgress?: number;
  dataFlow: {
    incoming: number;
    outgoing: number;
  };
  category: string;
  syncFrequency: string;
  enableNotifications: boolean;
  enableDataValidation: boolean;
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  count: number;
  popular?: boolean;
  recommended?: boolean;
}

export interface IntegrationData {
  integrations: Integration[];
  categories: Category[];
  lastUpdated: string;
}

class IntegrationService {
  private readonly dataUrl = '/integration.json';

  /**
   * Fetch all integration data from localStorage or JSON file
   */
  async fetchIntegrationData(): Promise<IntegrationData> {
    try {
      // First try to get data from localStorage (user's changes)
      const cachedData = this.getCachedData();
      if (cachedData) {
        console.log('Using cached integration data from localStorage');
        return cachedData;
      }

      // Fallback to the original JSON file
      const response = await fetch(this.dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch integration data: ${response.statusText}`);
      }
      const data: IntegrationData = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching integration data:', error);
      throw error;
    }
  }

  /**
   * Get all integrations
   */
  async getIntegrations(): Promise<Integration[]> {
    const data = await this.fetchIntegrationData();
    return data.integrations;
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const data = await this.fetchIntegrationData();
    return data.categories;
  }

  /**
   * Get integration by ID
   */
  async getIntegrationById(id: string): Promise<Integration | null> {
    const integrations = await this.getIntegrations();
    return integrations.find(integration => integration.id === id) || null;
  }

  /**
   * Add a new integration
   */
  async addIntegration(integration: Omit<Integration, 'id' | 'createdAt'>, autoDownload: boolean = false): Promise<Integration> {
    try {
      const data = await this.fetchIntegrationData();
      
      const newIntegration: Integration = {
        ...integration,
        id: `integration-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      // Add to integrations array
      data.integrations.push(newIntegration);
      
      // Update category counts
      this.updateCategoryCounts(data);
      
      // Update lastUpdated timestamp
      data.lastUpdated = new Date().toISOString();

      // Save updated data
      await this.saveIntegrationData(data, autoDownload);

      return newIntegration;
    } catch (error) {
      console.error('Error adding integration:', error);
      throw error;
    }
  }

  /**
   * Update an existing integration
   */
  async updateIntegration(id: string, updates: Partial<Integration>, autoDownload: boolean = false): Promise<Integration> {
    try {
      const data = await this.fetchIntegrationData();
      
      const integrationIndex = data.integrations.findIndex(integration => integration.id === id);
      if (integrationIndex === -1) {
        throw new Error(`Integration with ID ${id} not found`);
      }

      // Update the integration
      data.integrations[integrationIndex] = {
        ...data.integrations[integrationIndex],
        ...updates
      };

      // Update category counts
      this.updateCategoryCounts(data);
      
      // Update lastUpdated timestamp
      data.lastUpdated = new Date().toISOString();

      // Save updated data
      await this.saveIntegrationData(data, autoDownload);

      return data.integrations[integrationIndex];
    } catch (error) {
      console.error('Error updating integration:', error);
      throw error;
    }
  }

  /**
   * Delete an integration
   */
  async deleteIntegration(id: string, autoDownload: boolean = false): Promise<void> {
    try {
      const data = await this.fetchIntegrationData();
      
      const integrationIndex = data.integrations.findIndex(integration => integration.id === id);
      if (integrationIndex === -1) {
        throw new Error(`Integration with ID ${id} not found`);
      }

      // Remove the integration
      data.integrations.splice(integrationIndex, 1);

      // Update category counts
      this.updateCategoryCounts(data);
      
      // Update lastUpdated timestamp
      data.lastUpdated = new Date().toISOString();

      // Save updated data
      await this.saveIntegrationData(data, autoDownload);
    } catch (error) {
      console.error('Error deleting integration:', error);
      throw error;
    }
  }

  /**
   * Update multiple integrations
   */
  async updateMultipleIntegrations(updates: Array<{ id: string; updates: Partial<Integration> }>): Promise<Integration[]> {
    try {
      const data = await this.fetchIntegrationData();
      
      const updatedIntegrations: Integration[] = [];

      for (const { id, updates: integrationUpdates } of updates) {
        const integrationIndex = data.integrations.findIndex(integration => integration.id === id);
        if (integrationIndex !== -1) {
          data.integrations[integrationIndex] = {
            ...data.integrations[integrationIndex],
            ...integrationUpdates
          };
          updatedIntegrations.push(data.integrations[integrationIndex]);
        }
      }

      // Update category counts
      this.updateCategoryCounts(data);
      
      // Update lastUpdated timestamp
      data.lastUpdated = new Date().toISOString();

      // Save updated data
      await this.saveIntegrationData(data);

      return updatedIntegrations;
    } catch (error) {
      console.error('Error updating multiple integrations:', error);
      throw error;
    }
  }

  /**
   * Filter integrations by search term and category
   */
  async filterIntegrations(searchText: string, selectedCategory: string): Promise<Integration[]> {
    const integrations = await this.getIntegrations();
    
    return integrations.filter(integration => {
      const matchesSearch = integration.name.toLowerCase().includes(searchText.toLowerCase()) ||
                           integration.description.toLowerCase().includes(searchText.toLowerCase()) ||
                           integration.connectionType?.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesCategory = !selectedCategory || 
                             selectedCategory === 'all' ||
                             integration.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  /**
   * Update category counts based on current integrations
   */
  private updateCategoryCounts(data: IntegrationData): void {
    // Count integrations per category
    const categoryCounts: Record<string, number> = {};
    
    data.integrations.forEach(integration => {
      categoryCounts[integration.category] = (categoryCounts[integration.category] || 0) + 1;
    });

    // Update category counts
    data.categories.forEach(category => {
      if (category.id === 'all') {
        category.count = data.integrations.length;
      } else {
        category.count = categoryCounts[category.id] || 0;
      }
    });
  }

  /**
   * Save integration data to localStorage and optionally provide export functionality
   * Note: In a real application, this would be handled by a backend API
   * For demo purposes, we'll use localStorage and provide export functionality
   */
  private async saveIntegrationData(data: IntegrationData, autoDownload: boolean = false): Promise<void> {
    try {
      // Save to localStorage for persistence
      localStorage.setItem('integrationData', JSON.stringify(data));
      
      // Update the lastUpdated timestamp
      data.lastUpdated = new Date().toISOString();
      
      // Optionally download the updated JSON file
      if (autoDownload) {
        this.downloadUpdatedJson(data);
      }
      
      console.log('Integration data saved successfully:', data);
      
    } catch (error) {
      console.error('Error saving integration data:', error);
      throw error;
    }
  }

  /**
   * Download the updated integration.json file
   */
  private downloadUpdatedJson(data: IntegrationData): void {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'integration.json';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      console.log('Updated integration.json file downloaded');
    } catch (error) {
      console.error('Error downloading JSON file:', error);
    }
  }

  /**
   * Get cached data from localStorage (for demo purposes)
   */
  getCachedData(): IntegrationData | null {
    try {
      const cached = localStorage.getItem('integrationData');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error reading cached data:', error);
      return null;
    }
  }

  /**
   * Export current integration data as JSON file
   */
  async exportIntegrationData(): Promise<void> {
    try {
      const data = await this.fetchIntegrationData();
      this.downloadUpdatedJson(data);
    } catch (error) {
      console.error('Error exporting integration data:', error);
      throw error;
    }
  }

  /**
   * Clear cached data
   */
  clearCache(): void {
    localStorage.removeItem('integrationData');
  }
}

export const integrationService = new IntegrationService(); 