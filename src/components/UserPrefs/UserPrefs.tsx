
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from './components/ProfileSettings';
import AppearanceSettings from './components/AppearanceSettings';
import NotificationSettings from './components/NotificationSettings';
import DashboardSettings from './components/DashboardSettings';
import LocalizationSettings from './components/LocalizationSettings';
import VoiceSettings from './components/VoiceSettings';
import RecentModules from './components/RecentModules';
import { useUserPrefs } from './context/UserPrefsContext';

interface UserPrefsProps {
  defaultTab?: string;
}

const UserPrefs: React.FC<UserPrefsProps> = ({ defaultTab = "profile" }) => {
  const { isLoading } = useUserPrefs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spinner h-8 w-8 border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent rounded-full"></div>
        <span className="ml-3">Loading preferences...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
              <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
              <TabsTrigger value="localization">Localization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <AppearanceSettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="voice" className="space-y-4">
              <VoiceSettings />
            </TabsContent>
            
            <TabsContent value="dashboards" className="space-y-4">
              <DashboardSettings />
            </TabsContent>
            
            <TabsContent value="localization" className="space-y-4">
              <LocalizationSettings />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <RecentModules />
        </div>
      </div>
    </div>
  );
};

export default UserPrefs;
