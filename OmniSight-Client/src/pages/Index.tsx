import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { CopilotProvider } from '@/components/ExecCopilot';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  FileText, 
  Flag, 
  HelpCircle, 
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Sparkles,
  Brain
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SmartTooltip from '@/components/OmniGuide/components/SmartTooltip';
import TourButton from '@/components/OmniGuide/components/TourButton';
import FeaturesAccessButton from '@/components/FeaturesAccess/FeaturesAccessButton';
import DashboardBuilder from '@/components/DashboardBuilder/DashboardBuilder';
import InsightsEngine from '@/components/InsightsEngine/InsightsEngine';
import { AICommandCenter } from '@/components/AICommandCenter';
import EnhancedMetricCard from '@/components/EnhancedMetricCard/EnhancedMetricCard';
import { SmartTooltip as ModernTooltip } from '@/components/ui/smart-tooltip';
import DataVisualization from '@/components/ui/data-visualization';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Sample data for the new DataVisualization component
  const performanceData = [
    { label: 'Revenue Growth', value: 152, change: 15.2, target: 200, category: 'success' as const },
    { label: 'User Engagement', value: 89, change: 8.1, target: 100, category: 'primary' as const },
    { label: 'Conversion Rate', value: 65, change: -2.1, target: 80, category: 'warning' as const },
    { label: 'System Health', value: 99, change: 0.2, target: 100, category: 'success' as const }
  ];
  
  return (
    <CopilotProvider>
      <Layout title="" subtitle="">
        <div className="space-y-8">
          {/* Enhanced Hero Section with Glass Morphism */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 backdrop-blur-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative p-8 lg:p-12 text-center border border-white/10 backdrop-blur-xl shadow-2xl">
              <div className="flex justify-center mb-4">
                <Badge variant="gradient">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Platform
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
                Welcome to OmniSight
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                The comprehensive solution for enterprise intelligence and decision-making with advanced AI capabilities.
              </p>
              <div className="flex justify-center gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <ModernTooltip
                  title="AI Assistant"
                  description="Get intelligent insights and recommendations powered by advanced machine learning"
                  type="insight"
                  actionLabel="Learn More"
                  onAction={() => console.log('AI Assistant clicked')}
                >
                  <Button className="btn-enterprise gap-2">
                    <Brain className="h-4 w-4" />
                    Explore AI Features
                  </Button>
                </ModernTooltip>
              </div>
            </div>
          </div>
          
          {/* Enhanced Action Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50">
            <div className="space-y-2 animate-slide-up">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold font-outfit">Dashboard</h2>
                <Badge variant="glass" size="sm">Live</Badge>
              </div>
              <p className="text-muted-foreground text-base">Your data at a glance with real-time updates</p>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {!isMobile && (
                <>
                  {/* Removed Data Cleaning, Policy Intel, Dashboard Builder, and Features buttons as per user request */}
                </>
              )}
              
              <TourButton 
                tourId="dashboard-tour" 
                className="btn-enterprise gap-2 focus-ring"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Take Tour</span>
              </TourButton>
            </div>
          </div>

          {/* Combined Metrics and Data Visualization Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-stretch w-full">
            {/* Metric Cards Left */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                <EnhancedMetricCard
                  title="Total Revenue"
                  value="$2.4M"
                  change={{
                    value: "+15.2%",
                    type: "increase",
                    timeframe: "vs last month"
                  }}
                  trend="up"
                  status="success"
                  subtitle="Monthly recurring revenue"
                />
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <EnhancedMetricCard
                  title="Active Users"
                  value="12,847"
                  change={{
                    value: "+8.1%",
                    type: "increase",
                    timeframe: "vs last week"
                  }}
                  trend="up"
                  status="info"
                  subtitle="Daily active users"
                />
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <EnhancedMetricCard
                  title="Conversion Rate"
                  value="3.24%"
                  change={{
                    value: "-2.1%",
                    type: "decrease",
                    timeframe: "vs last month"
                  }}
                  trend="down"
                  status="warning"
                  subtitle="Lead to customer rate"
                />
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <EnhancedMetricCard
                  title="System Uptime"
                  value="99.9%"
                  change={{
                    value: "Stable",
                    type: "neutral",
                    timeframe: "Last 30 days"
                  }}
                  trend="neutral"
                  status="success"
                  subtitle="Infrastructure health"
                />
              </div>
            </div>
            {/* Data Visualization Progress Right */}
            <div className="flex-1 flex items-center justify-center">
              <div className="card-glass p-6 w-full max-w-xl animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <DataVisualization 
                  data={performanceData}
                  type="progress"
                  animated={true}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Tabs Section with Glass Effects */}
          <div className="p-2 rounded-3xl animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <Tabs defaultValue="insights" className="w-full">
              <TabsList className="flex justify-center gap-2 bg-white/70 dark:bg-card/70 rounded-full shadow-lg p-1 mx-auto w-fit">
                <TabsTrigger 
                  value="insights" 
                  className="px-6 py-2 rounded-full font-semibold text-base transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Insights Engine
                </TabsTrigger>
                <TabsTrigger 
                  value="dashboard" 
                  className="px-6 py-2 rounded-full font-semibold text-base transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard Builder
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="insights">
                <div className="rounded-2xl overflow-hidden">
                  <InsightsEngine />
                </div>
              </TabsContent>
              
              <TabsContent value="dashboard">
                <div className="rounded-2xl overflow-hidden">
                  <DashboardBuilder />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </CopilotProvider>
  );
};

export default Index;
