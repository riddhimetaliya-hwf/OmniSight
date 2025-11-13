
// Data source types
export type CopilotSource = 'all' | 'crm' | 'finance' | 'hr' | 'operations' | 'market-intel';

// Insight types
export type InsightType = 'risk' | 'win' | 'anomaly' | 'summary' | 'action' | 'predictive';
export type ImportanceLevel = 'low' | 'medium' | 'high' | 'critical';

// Multi-modal input types
export type InputType = 'text' | 'voice' | 'image' | 'document';

export interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

// Main data types
export interface CopilotInsight {
  id: string;
  title: string;
  description: string;
  type: InsightType;
  importance: ImportanceLevel;
  source: CopilotSource;
  timestamp: string;
  data?: any;
  hasAlert?: boolean;
  isPredictive?: boolean;
  confidence?: number;
}

export interface CopilotRecommendation {
  id: string;
  title: string;
  description: string;
  impact: ImportanceLevel;
  source: CopilotSource;
  actionable: boolean;
  predictedOutcome?: string;
  confidence?: number;
}

export interface CopilotQuery {
  id: string;
  text: string;
  timestamp: string;
  inputType: InputType;
  files?: FileUpload[];
  response?: string;
  context?: any;
}

// Voice integration types
export interface VoiceSettings {
  wakeWordEnabled: boolean;
  wakeWord: string;
  language: string;
  voiceBiometricsEnabled: boolean;
  ambientListening: boolean;
  voiceThreshold: number;
}

export interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  category: 'navigation' | 'analysis' | 'control' | 'query';
  language: string;
  confidence: number;
}

// Settings and preferences
export interface CopilotSettings {
  enableVoice: boolean;
  dailyBriefingEnabled: boolean;
  weeklyBriefingEnabled: boolean;
  notificationChannels: ('email' | 'in-app' | 'slack')[];
  prioritySources: CopilotSource[];
  voiceSettings: VoiceSettings;
  contextAwareness: boolean;
  predictiveInsights: boolean;
  realTimeIntegration: boolean;
}

// Real-time integration types
export interface DataConnection {
  id: string;
  name: string;
  type: 'erp' | 'crm' | 'bi' | 'financial' | 'communication';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
}

// Context awareness types
export interface ConversationContext {
  sessionId: string;
  history: CopilotQuery[];
  userPreferences: any;
  businessContext: any;
  currentFocus: string[];
}
