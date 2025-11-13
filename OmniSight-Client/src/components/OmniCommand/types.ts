
import { CopilotInsight, CopilotRecommendation } from "../ExecCopilot/types";
import { Alert } from "../AlertManager/types";
import { KPI } from "../KPITracker/types";

export type ExecutiveRole = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO' | 'custom';

export interface PinnedItem {
  id: string;
  type: 'kpi' | 'snapshot' | 'alert' | 'recommendation';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CommandCenterSettings {
  role: ExecutiveRole;
  darkMode: boolean;
  pinnedItems: PinnedItem[];
  showAlerts: boolean;
  showRecommendations: boolean;
  showInsights: boolean;
}

export interface Snapshot {
  id: string;
  title: string;
  items: {
    id: string;
    text: string;
    status?: 'pending' | 'completed' | 'in-progress';
    dueDate?: string;
  }[];
  type: 'priorities' | 'decisions' | 'insights';
}

export interface KPIWidget {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  target: string;
  progress: number;
  period: string;
}

export interface OmniCommandContextProps {
  settings: CommandCenterSettings;
  kpis: KPI[];
  alerts: Alert[];
  recommendations: CopilotRecommendation[];
  insights: CopilotInsight[];
  snapshots: Snapshot[];
  updateSettings: (settings: Partial<CommandCenterSettings>) => void;
  togglePinItem: (item: PinnedItem) => void;
  switchRole: (role: ExecutiveRole) => void;
}
