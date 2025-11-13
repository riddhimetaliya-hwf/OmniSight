import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  UserPreferences, 
  UserProfile, 
  NotificationPreference,
  ThemeMode,
  AppTheme,
  Language,
  DateFormat,
  TimeFormat,
  UserPrefsContextType
} from '../types';

// Default user preferences
const defaultPreferences: UserPreferences = {
  theme: 'system',
  colorScheme: 'default',
  fontSize: 'medium',
  notifications: {
    email: true,
    browser: true,
    mobile: false,
    digest: true
  },
  defaultDashboards: ['dash1', 'dash2'],
  defaultWidgets: ['widget1', 'widget3', 'widget4'],
  language: 'en',
  timeZone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  voiceAssistant: {
    enabled: false,
    volume: 80,
    wakeWord: 'Hey Omni',
    voice: 'default'
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    largeText: false
  },
  savedViews: [],
  collaborationSettings: {
    defaultVisibility: 'private',
    autoShare: false,
    notifyOnMention: true
  },
  highContrast: false,
  animations: true,
  recentModules: [
    {
      id: '1',
      name: 'Dashboard Builder',
      path: '/dashboards',
      accessedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'KPI Tracker',
      path: '/kpi-tracker',
      accessedAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '3',
      name: 'Analytics',
      path: '/analytics',
      accessedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

const defaultProfile: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  department: 'Product',
  role: 'Product Manager',
  avatar: ''
};

// Create context with default values
const UserPrefsContext = createContext<UserPrefsContextType | undefined>(undefined);

export const UserPrefsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state from localStorage or use defaults
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const savedPrefs = localStorage.getItem('userPreferences');
      return savedPrefs ? JSON.parse(savedPrefs) : defaultPreferences;
    } catch (e) {
      console.error('Error loading preferences from localStorage', e);
      return defaultPreferences;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
    } catch (e) {
      console.error('Error loading profile from localStorage', e);
      return defaultProfile;
    }
  });

  // Update preferences and save to localStorage
  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updatedPrefs = { ...prev, ...newPrefs };
      localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
      return updatedPrefs;
    });
  };

  // Update profile and save to localStorage
  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => {
      const updatedProfile = { ...prev, ...newProfile };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  };

  // Specific update methods for different parts of the preferences
  const updateThemeMode = (mode: ThemeMode) => {
    updatePreferences({ theme: mode });
  };

  const updateThemeColor = (color: AppTheme) => {
    updatePreferences({ colorScheme: color });
  };

  const updateNotifications = (notificationPrefs: NotificationPreference[]) => {
    // Convert new notification format to the old format
    const notifications = {
      email: notificationPrefs.some(n => n.channel === 'email' && n.enabled),
      browser: notificationPrefs.some(n => n.channel === 'browser' && n.enabled),
      mobile: notificationPrefs.some(n => n.channel === 'mobile' && n.enabled),
      digest: notificationPrefs.some(n => n.channel === 'digest' && n.enabled)
    };
    
    updatePreferences({ notifications });
  };

  const updateLanguage = (language: Language) => {
    updatePreferences({ language });
  };

  const updateDateFormat = (dateFormat: DateFormat) => {
    updatePreferences({ dateFormat });
  };

  const updateTimeFormat = (timeFormat: TimeFormat) => {
    updatePreferences({ timeFormat });
  };

  const updateDefaultDashboards = (defaultDashboards: string[]) => {
    updatePreferences({ defaultDashboards });
  };

  const updateDefaultWidgets = (defaultWidgets: string[]) => {
    updatePreferences({ defaultWidgets });
  };

  return (
    <UserPrefsContext.Provider 
      value={{ 
        preferences, 
        profile,
        isLoading,
        updatePreferences, 
        updateProfile,
        updateThemeMode,
        updateThemeColor,
        updateNotifications,
        updateLanguage,
        updateDateFormat,
        updateTimeFormat,
        updateDefaultDashboards,
        updateDefaultWidgets
      }}
    >
      {children}
    </UserPrefsContext.Provider>
  );
};

// Custom hook to use the user preferences context
export const useUserPrefs = () => {
  const context = useContext(UserPrefsContext);
  if (context === undefined) {
    throw new Error('useUserPrefs must be used within a UserPrefsProvider');
  }
  return context;
};
