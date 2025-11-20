
import { IntelligenceItem, NewsSource, AlertLevel } from './types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to create a date string for a specific number of days ago
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// List of mock industries
const industries = [
  'Technology', 'Finance', 'Healthcare', 'Manufacturing', 
  'Retail', 'Energy', 'Telecommunications', 'Transportation'
];

// List of mock departments
const departments = [
  'Executive', 'Finance', 'HR', 'IT', 
  'Marketing', 'Operations', 'R&D', 'Sales'
];

// List of mock geographies
const geographies = [
  'North America', 'Europe', 'Asia Pacific', 'Latin America', 
  'Middle East', 'Africa', 'Global'
];

// List of mock topics
const topics = [
  'Acquisitions', 'IPOs', 'Market Trends', 'Partnerships', 
  'Product Launches', 'Regulations', 'Research', 'Strategy'
];

// Function to generate a random subset of a string array
const getRandomSubset = <T>(array: T[], min = 1, max = 3): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate mock intelligence items
export const generateMockItems = (count: number): IntelligenceItem[] => {
  const sources: NewsSource[] = ['business', 'regulatory', 'market', 'social'];
  const alertLevels: AlertLevel[] = ['low', 'medium', 'high', 'critical'];
  const sourceNames = {
    business: ['Bloomberg', 'Financial Times', 'Wall Street Journal', 'CNBC'],
    regulatory: ['SEC', 'EU Commission', 'FTC', 'FDA'],
    market: ['Reuters', 'MarketWatch', 'S&P Global', 'Forbes'],
    social: ['Twitter', 'LinkedIn', 'Reddit', 'Facebook']
  };
  
  return Array.from({ length: count }, (_, i) => {
    const source = sources[Math.floor(Math.random() * sources.length)] as NewsSource;
    const sourceName = sourceNames[source][Math.floor(Math.random() * sourceNames[source].length)];
    const alertLevel = alertLevels[Math.floor(Math.random() * alertLevels.length)] as AlertLevel;
    
    const selectedIndustries = getRandomSubset(industries);
    const selectedDepartments = getRandomSubset(departments);
    const selectedGeographies = getRandomSubset(geographies);
    const selectedTopics = getRandomSubset(topics);
    
    const title = `${selectedTopics[0]} Update: ${selectedIndustries[0]} Sector in ${selectedGeographies[0]}`;
    
    return {
      id: uuidv4(),
      title,
      summary: `Recent developments in ${selectedIndustries[0]} affecting ${selectedDepartments[0]} departments across ${selectedGeographies[0]}.`,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Aenean et justo lorem. Donec eget eros eget urna aliquam vulputate. Cras suscipit cursus libero, eget tincidunt velit hendrerit at. In hac habitasse platea dictumst. Sed fringilla, enim quis aliquam convallis, risus risus rutrum libero, nec aliquam magna nunc vel tellus.`,
      source,
      sourceUrl: `https://example.com/${source}/${i}`,
      sourceName,
      publishedAt: daysAgo(Math.floor(Math.random() * 7)),
      relevanceScore: Math.floor(Math.random() * 100) + 1,
      alertLevel,
      industries: selectedIndustries,
      departments: selectedDepartments,
      geographies: selectedGeographies,
      topics: selectedTopics,
      sentiment: Math.random() * 2 - 1, // -1 to 1
      imageUrl: i % 3 === 0 ? `https://picsum.photos/seed/${i}/400/200` : undefined,
      saved: false,
      forwarded: false
    };
  });
};

// Generate initial mock data
export const mockIntelligenceItems = generateMockItems(20);

// Mock filter options
export const mockFilterOptions = {
  sources: ['business', 'regulatory', 'market', 'social'] as NewsSource[],
  industries,
  departments,
  geographies,
  topics,
  alertLevel: ['medium', 'high', 'critical'] as AlertLevel[],
  relevanceThreshold: 50
};

// Mock digest settings
export const mockDigestSettings = {
  enabled: true,
  frequency: 'daily' as const,
  emailAddresses: ['executive@example.com', 'team@example.com'],
  filters: {
    ...mockFilterOptions,
    alertLevel: ['high', 'critical'] as AlertLevel[],
    relevanceThreshold: 75
  }
};
