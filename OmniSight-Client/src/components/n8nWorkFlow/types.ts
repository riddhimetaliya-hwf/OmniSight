import { Json } from "@/lib/database.types";

export interface Workflow {
  filename: string;
  name: string;
  description: string;
  category: string;
  trigger_type: string;
  complexity: string;
  node_count: number;
  integrations: string[];
  tags: string[];
  active: boolean;
  download_url: string;
  searchable_text: string;
  raw_json?: Json; 
  diagram?: string; 
}

export interface SearchIndex {
  workflows: Workflow[];
  categories: string[];
  stats: {
    total_workflows: number;
    active_workflows: number;
    unique_integrations: number;
    categories: number;
  };
}

export interface SearchFilters {
  category: string;
  complexity: string;
  trigger: string;
}