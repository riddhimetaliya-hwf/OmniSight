
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  colorScheme: string;
  fontSize: 'small' | 'medium' | 'large';
  notifications: {
    email: boolean;
    browser: boolean;
    mobile: boolean;
    digest: boolean;
  };
  defaultDashboards: string[];
  defaultWidgets: string[];
  language: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h'; // Added timeFormat
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
  };
  voiceAssistant: {
    enabled: boolean;
    volume: number;
    wakeWord: string;
    voice: string;
  };
  savedViews: SavedView[];
  collaborationSettings: {
    defaultVisibility: 'private' | 'team' | 'organization';
    autoShare: boolean;
    notifyOnMention: boolean;
  };
  highContrast?: boolean; // Added highContrast at the root level
  animations?: boolean; // Added animations property
  recentModules: RecentModule[]; // Added recentModules array
}

export interface RecentModule {
  id: string;
  name: string;
  path: string;
  accessedAt: string;
}

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  type: 'dashboard' | 'report' | 'insight';
  config: any;
  filters: any;
  layout: any;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

// Additional types needed for the UserPrefsContext
export interface UserProfile {
  name: string;
  email: string;
  department: string;
  role: string;
  avatar: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type AppTheme = 'default' | 'blue' | 'green' | 'purple' | 'orange';
export type Language = string;
export type DateFormat = string;
export type TimeFormat = '12h' | '24h';

export type NotificationChannel = 'email' | 'browser' | 'mobile' | 'digest' | 'in-app' | 'slack' | 'teams';

export interface NotificationPreference {
  channel: NotificationChannel;
  enabled: boolean;
  frequency?: 'immediate' | 'daily' | 'weekly';
  type?: string; // Adding type property
}

export interface UserPrefsContextType {
  preferences: UserPreferences;
  profile: UserProfile;
  isLoading: boolean;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateThemeMode: (mode: ThemeMode) => void;
  updateThemeColor: (color: AppTheme) => void;
  updateNotifications: (notifications: NotificationPreference[]) => void;
  updateLanguage: (language: Language) => void;
  updateDateFormat: (dateFormat: DateFormat) => void;
  updateTimeFormat: (timeFormat: TimeFormat) => void;
  updateDefaultDashboards: (dashboards: string[]) => void;
  updateDefaultWidgets: (widgets: string[]) => void;
}

export interface VoiceAssistantSettings {
  enabled: boolean;
  volume: number;
  wakeWord: string;
  voice: string;
}
