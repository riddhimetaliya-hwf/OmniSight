
export interface CleaningStep {
  id: string;
  command: string;
  timestamp: Date;
  changes: {
    before: any;
    after: any;
  };
  applied: boolean;
}

export interface CleanDataColumn {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
  data: any[];
}

export interface CleanDataset {
  id: string;
  name: string;
  columns: CleanDataColumn[];
}
