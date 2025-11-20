export interface MarketIntelItem {
  id: string;
  Company: string;
  "Headline Title": string;
  "Description Story": string;
  "Date&Time": string;
  "By Whom": string;
  "Bussiness Impact": string;
  "URL reference": string;
  "Image URL": string;
  "Type Of News": string;
  Tags: string;
}

export interface MarketIntelData {
  items: MarketIntelItem[];
  lastUpdated: string;
}

class MarketIntelService {
  private data: MarketIntelData | null = null;

  async fetchMarketIntelData(): Promise<MarketIntelData> {
    try {
      // Try to get from localStorage first
      const cachedData = localStorage.getItem('marketIntelData');
      if (cachedData) {
        this.data = JSON.parse(cachedData);
        return this.data!;
      }

      // Fetch from JSON file
      const response = await fetch('/MarketIntel.json');
      if (!response.ok) {
        throw new Error('Failed to fetch market intelligence data');
      }

      const rawData = await response.json();
      
      // Transform the data to match our interface
      const transformedData: MarketIntelData = {
        items: rawData.map((item: MarketIntelItem, index: number) => ({
          ...item,
          id: `market-intel-${index}` // Add unique ID
        })),
        lastUpdated: new Date().toISOString()
      };

      // Cache the data
      localStorage.setItem('marketIntelData', JSON.stringify(transformedData));
      this.data = transformedData;

      return transformedData;
    } catch (error) {
      console.error('Error fetching market intelligence data:', error);
      throw error;
    }
  }

  async getMarketIntelItems(): Promise<MarketIntelItem[]> {
    const data = await this.fetchMarketIntelData();
    return data.items;
  }

  async getLastUpdated(): Promise<string> {
    const data = await this.fetchMarketIntelData();
    return data.lastUpdated;
  }

  // Filter items based on search criteria
  filterItems(items: MarketIntelItem[], searchQuery: string = '', filters: {
    companies?: string[];
    newsTypes?: string[];
    dateRange?: { from?: Date; to?: Date };
  } = {}): MarketIntelItem[] {
    let filtered = [...items];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item["Headline Title"].toLowerCase().includes(query) ||
        item["Description Story"].toLowerCase().includes(query) ||
        item["Bussiness Impact"].toLowerCase().includes(query) ||
        item.Company.toLowerCase().includes(query) ||
        item["By Whom"].toLowerCase().includes(query) ||
        item["Type Of News"].toLowerCase().includes(query) ||
        item.Tags.toLowerCase().includes(query)
      );
    }

    // Company filter
    if (filters.companies && filters.companies.length > 0) {
      filtered = filtered.filter(item => 
        filters.companies.includes(item.Company)
      );
    }

    // News type filter
    if (filters.newsTypes && filters.newsTypes.length > 0) {
      filtered = filtered.filter(item => 
        filters.newsTypes.includes(item["Type Of News"])
      );
    }

    // Date range filter
    if (filters.dateRange) {
      const { from, to } = filters.dateRange;
      filtered = filtered.filter(item => {
        const itemDate = new Date(item["Date&Time"]);
        if (from && itemDate < from) return false;
        if (to && itemDate > to) return false;
        return true;
      });
    }

    return filtered;
  }

  // Get unique companies
  getUniqueCompanies(items: MarketIntelItem[]): string[] {
    return [...new Set(items.map(item => item.Company))];
  }

  // Get unique news types
  getUniqueNewsTypes(items: MarketIntelItem[]): string[] {
    return [...new Set(items.map(item => item["Type Of News"]))];
  }

  // Get unique sources
  getUniqueSources(items: MarketIntelItem[]): string[] {
    return [...new Set(items.map(item => item["By Whom"]))];
  }

  // Clear cache
  clearCache(): void {
    localStorage.removeItem('marketIntelData');
    this.data = null;
  }

  // Refresh data
  async refreshData(): Promise<MarketIntelData> {
    this.clearCache();
    return await this.fetchMarketIntelData();
  }
}

export const marketIntelService = new MarketIntelService(); 