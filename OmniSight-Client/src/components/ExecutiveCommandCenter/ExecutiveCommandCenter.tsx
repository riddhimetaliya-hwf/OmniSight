import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  AlertCircle, 
  Lightbulb, 
  ClipboardList,
  Globe,
  Target,
  Bell} from 'lucide-react';
import RoleHeader from './components/RoleHeader';
import RoleSpecificKPIs from './components/RoleSpecificKPIs';
import ExecutiveInsights from './components/ExecutiveInsights';
import AlertsSection from './components/AlertsSection';
import RecommendationsSection from './components/RecommendationsSection';
import CompetitiveAnalysis from './components/CompetitiveAnalysis';
import GlobalTrends from './components/GlobalTrends';
import StrategicPlanningTools from './components/StrategicPlanningTools';
import SmartNotifications from './components/SmartNotifications';
import ModernCommandHeader from './components/ModernCommandHeader';
import VoiceCommandPanel from './components/VoiceCommandPanel';
import AdaptiveLayout from './components/AdaptiveLayout';
import Loading from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { ExecutiveRole } from '@/types/executive-roles';
import { roleConfigurations } from '@/data/executive-roles-data';

const ExecutiveCommandCenter: React.FC = () => {
  const [activeRole, setActiveRole] = useState<ExecutiveRole>('CEO');
  const [activeTab, setActiveTab] = useState('insights');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'compact' | 'comfortable' | 'spacious'>('spacious');
  const { toast } = useToast();

  const handleRoleChange = (role: ExecutiveRole) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setActiveRole(role);
      setIsLoading(false);
      
      toast({
        title: `${role} Dashboard Loaded`,
        description: `Viewing ${roleConfigurations[role].displayName} perspective`,
      });
    }, 800);
  };



  const currentConfig = roleConfigurations[activeRole];

  if (isLoading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-muted/30">
        <div className="text-center space-y-4 glass-effect p-8 rounded-2xl">
          <Loading variant="spinner" size="lg" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading {activeRole} Dashboard</h3>
            <p className="text-muted-foreground">Preparing executive insights and analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdaptiveLayout layoutMode={layoutMode}>
      <div className="space-y-6 w-full animate-fade-in-up">
        {/* Modern Command Header */}
        <ModernCommandHeader
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
          voiceEnabled={voiceEnabled}
          onVoiceToggle={setVoiceEnabled}
          layoutMode={layoutMode}
          onLayoutChange={setLayoutMode}
        />

        {/* Voice Command Section */}
        {voiceEnabled && (
          <div className="space-y-4 animate-slide-up">
            <VoiceCommandPanel role={activeRole} />
          </div>
        )}

        {/* Role-Specific Header */}
        <div className="glass-effect rounded-2xl p-6 border border-white/10 bg-gradient-to-r from-white/5 to-white/10">
          <RoleHeader
            role={currentConfig.role}
            displayName={currentConfig.displayName}
            description={currentConfig.description}
            roleColor={currentConfig.primaryColor}
            focusAreas={currentConfig.focusAreas}
          />
        </div>

        {/* Role-Specific KPIs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Key Performance Indicators
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Auto-refresh in 30s</span>
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="animate-scale-in">
            <RoleSpecificKPIs 
              kpis={currentConfig.kpis} 
              roleColor={currentConfig.primaryColor}
            />
          </div>
        </div>

        {/* Enhanced Executive Tools & Analytics Tabs */}
        <div className="glass-effect rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-r from-white/5 to-white/10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-0 bg-transparent backdrop-blur-xl border-b border-border/20 p-2 grid grid-cols-4 lg:grid-cols-7 rounded-none">
              <TabsTrigger 
                value="insights" 
                className="data-[state=active]:bg-white/10 data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-xl transition-all duration-300 hover:bg-white/5"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Strategic Insights</span>
                <span className="sm:hidden">Insights</span>
              </TabsTrigger>
              <TabsTrigger 
                value="planning" 
                className="data-[state=active]:bg-white/10 data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-xl transition-all duration-300 hover:bg-white/5"
              >
                <Target className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Planning</span>
                <span className="sm:hidden">Plan</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-white/10 data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-xl transition-all duration-300 hover:bg-white/5"
              >
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Alerts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="alerts" 
                className="data-[state=active]:bg-white/10 data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-xl transition-all duration-300 hover:bg-white/5"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Alerts</span>
                <span className="sm:hidden">Alert</span>
              </TabsTrigger>
              <TabsTrigger 
                value="recommendations" 
                className="data-[state=active]:bg-white/10 data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-xl transition-all duration-300 hover:bg-white/5"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Recommendations</span>
                <span className="sm:hidden">Rec</span>
              </TabsTrigger>
              <TabsTrigger 
                value="competitive" 
                className="data-[state=active]:bg-white/10 data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-xl transition-all duration-300 hover:bg-white/5"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Competitive</span>
                <span className="sm:hidden">Comp</span>
              </TabsTrigger>
              <TabsTrigger 
                value="trends" 
                className="data-[state=active]:bg-white/10 data-[state=active]:shadow-lg data-[state=active]:backdrop-blur-xl transition-all duration-300 hover:bg-white/5"
              >
                <Globe className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Trends</span>
                <span className="sm:hidden">Trend</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="insights" className="mt-0 animate-fade-in">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Executive Insights
                  </h3>
                  <ExecutiveInsights 
                    insights={currentConfig.insights} 
                    roleColor={currentConfig.primaryColor}
                  />
                </div>
              </TabsContent>
              <TabsContent value="planning" className="mt-0 animate-fade-in">
                <StrategicPlanningTools role={activeRole} />
              </TabsContent>
              <TabsContent value="notifications" className="mt-0 animate-fade-in">
                <SmartNotifications role={activeRole} />
              </TabsContent>
              <TabsContent value="alerts" className="mt-0 animate-fade-in">
                <AlertsSection role={activeRole} />
              </TabsContent>
              <TabsContent value="recommendations" className="mt-0 animate-fade-in">
                <RecommendationsSection role={activeRole} />
              </TabsContent>
              <TabsContent value="competitive" className="mt-0 animate-fade-in">
                <CompetitiveAnalysis role={activeRole} />
              </TabsContent>
              <TabsContent value="trends" className="mt-0 animate-fade-in">
                <GlobalTrends role={activeRole} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AdaptiveLayout>
  );
};

export default ExecutiveCommandCenter;
