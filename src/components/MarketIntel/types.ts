
export type NewsSource = 'business' | 'regulatory' | 'market' | 'social';
export type AlertLevel = 'low' | 'medium' | 'high' | 'critical';
export type DigestFrequency = 'daily' | 'weekly' | 'realtime';
export type FilterType = 'industry' | 'department' | 'geography' | 'topic';

export interface IntelligenceItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: NewsSource;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  relevanceScore: number;
  alertLevel: AlertLevel;
  industries: string[];
  departments: string[];
  geographies: string[];
  topics: string[];
  sentiment?: number;
  imageUrl?: string;
  saved: boolean;
  forwarded: boolean;
}

export interface FilterOptions {
  sources: NewsSource[];
  industries: string[];
  departments: string[];
  geographies: string[];
  topics: string[];
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  alertLevel?: AlertLevel[];
  relevanceThreshold?: number;
}

export interface Filters {
  sources: NewsSource[];
  industries: string[];
  departments: string[];
  geographies: string[];
  topics: string[];
  alertLevel: AlertLevel[];
  relevanceThreshold: number;
}

export interface DigestSettings {
  enabled: boolean;
  frequency: DigestFrequency;
  emailAddresses: string[];
  filters: FilterOptions;
}

export interface MarketIntelState {
  items: IntelligenceItem[];
  isLoading: boolean;
  error: string | null;
  filters: FilterOptions;
  digestSettings: DigestSettings;
  savedItems: IntelligenceItem[];
}
