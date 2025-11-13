
export type PolicyCategory = 'finance' | 'legal' | 'procurement' | 'hr' | 'it' | 'general';
export type PolicyPriority = 'critical' | 'high' | 'medium' | 'low';
export type PolicySource = 'sec' | 'gdpr' | 'government' | 'industry' | 'internal';

export interface PolicyUpdate {
  id: string;
  title: string;
  summary: string;
  fullContent?: string;
  datePublished: Date;
  effectiveDate?: Date;
  categories: PolicyCategory[];
  priority: PolicyPriority;
  source: PolicySource;
  sourceName: string;
  sourceUrl?: string;
  impact?: string;
  requiredActions?: string[];
  departmentalImpact?: Record<string, string>;
  viewed: boolean;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  policies: string[]; // Policy IDs that affect this department
}
