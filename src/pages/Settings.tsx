
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IntegrationHub } from '@/components/IntegrationHub/Dashboard';
import { UserPrefs } from '@/components/UserPrefs';
import { UserPrefsProvider } from '@/components/UserPrefs/context/UserPrefsContext';
import { OmniGuideProvider } from '@/components/OmniGuide';
import TourManager from '@/components/OmniGuide/components/TourManager';

const Settings: React.FC = () => {
  return (
    <Layout title="Settings" subtitle="Preferences & Configuration">
      <Tabs defaultValue="personalization" className="w-full">
        <TabsList>
          <TabsTrigger value="personalization">Personalization</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personalization">
          <UserPrefsProvider>
            <UserPrefs />
          </UserPrefsProvider>
        </TabsContent>
        
        <TabsContent value="general">
          <div className="p-4">
            <h2 className="text-lg font-medium">General Settings</h2>
            <p className="text-muted-foreground mt-2">Configure system-wide settings</p>
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <div className="p-4">
            <h2 className="text-lg font-medium">Account Settings</h2>
            <p className="text-muted-foreground mt-2">Manage your account preferences</p>
          </div>
        </TabsContent>

        <TabsContent value="onboarding">
          <OmniGuideProvider>
            <TourManager />
          </OmniGuideProvider>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Settings;
