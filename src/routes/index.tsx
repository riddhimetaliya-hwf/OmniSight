import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Core pages
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Settings from '@/pages/Settings';
import Admin from '@/pages/Admin';

// Analytics & Insights
import Insights from '@/pages/Insights';
import InsightsPage from '@/pages/InsightsPage';
import PerformanceAnalyticsPage from '@/pages/PerformanceAnalyticsPage';
import PerformanceHubPage from '@/pages/PerformanceHubPage';

// Alerts & Notifications
import Alerts from '@/pages/Alerts';
import AlertManagerPage from '@/pages/AlertManagerPage';

// Workflows & Automation
import Workflows from '@/pages/Workflows';
import WorkflowStudioPage from '@/pages/WorkflowStudioPage';
import AutoPilotPage from '@/pages/AutoPilotPage';

// Reports & Briefings
import Reports from '@/pages/Reports';
import SmartSyncBriefingPage from '@/pages/SmartSyncBriefingPage';
import PerformanceBriefingAIPage from '@/pages/PerformanceBriefingAIPage';

// AI & Copilot Features
import ExecCopilotPage from '@/pages/ExecCopilotPage';
import CommandCenter from '@/pages/CommandCenter';
import OmniCommandPage from '@/pages/OmniCommandPage';
import VoiceDashboardPage from '@/pages/VoiceDashboardPage';
import PromptToAppBuilder from '@/pages/PromptToAppBuilder';

// KPI & Metrics
import KPITrackerPage from '@/pages/KPITrackerPage';

// Access Control
import RBACManager from '@/pages/RBACManager';

// Market & Business Intelligence
import MarketIntelPage from '@/pages/MarketIntelPage';
import PolicyIntelPage from '@/pages/PolicyIntelPage';

// System & Infrastructure
import SystemLinkMapPage from '@/pages/SystemLinkMapPage';
import ITServicesPage from '@/pages/ITServicesPage';
import ITCostPulsePage from '@/pages/ITCostPulsePage';
import ProcessPulsePage from '@/pages/ProcessPulsePage';

// Data & Integration
import DataCleaningPage from '@/pages/DataCleaningPage';
import IntegrationsPage from '@/pages/IntegrationsPage';

// Business Operations
import DecisionSupportPage from '@/pages/DecisionSupportPage';
import OpportunityResponderPage from '@/pages/OpportunityResponderPage';
import OrderFlowTrackerPage from '@/pages/OrderFlowTrackerPage';
import TalentOnboardPulsePage from '@/pages/TalentOnboardPulsePage';
import ClientCarePerformancePage from '@/pages/ClientCarePerformancePage';

// User Experience
import UserFeedbackPage from '@/pages/UserFeedbackPage';
import LearningResourcesPage from '@/pages/LearningResourcesPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Core Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/admin" element={<Admin />} />
      
      {/* Analytics & Insights Routes */}
      <Route path="/insights" element={<Insights />} />
      <Route path="/insights-engine" element={<InsightsPage />} />
      <Route path="/performance-analytics" element={<PerformanceAnalyticsPage />} />
      <Route path="/performance-hub" element={<PerformanceHubPage />} />
      
      {/* Alerts & Notifications Routes */}
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/alert-manager" element={<AlertManagerPage />} />
      
      {/* Workflows & Automation Routes */}
      <Route path="/workflows" element={<Workflows />} />
      <Route path="/workflow-studio" element={<WorkflowStudioPage />} />
      <Route path="/autopilot" element={<AutoPilotPage />} />
      
      {/* Reports & Briefings Routes */}
      <Route path="/reports" element={<Reports />} />
      <Route path="/data-briefings" element={<SmartSyncBriefingPage />} />
      <Route path="/performance-briefing" element={<PerformanceBriefingAIPage />} />
      
      {/* AI & Copilot Routes */}
      <Route path="/exec-copilot" element={<ExecCopilotPage />} />
      <Route path="/command-center" element={<CommandCenter />} />
      <Route path="/omni-command" element={<OmniCommandPage />} />
      <Route path="/voice-dashboard" element={<VoiceDashboardPage />} />
      <Route path="/prompt-to-app" element={<PromptToAppBuilder />} />
      
      {/* KPI & Metrics Routes */}
      <Route path="/kpi-tracker" element={<KPITrackerPage />} />
      
      {/* Access Control Routes */}
      <Route path="/rbac" element={<RBACManager />} />
      
      {/* Market & Business Intelligence Routes */}
      <Route path="/market-intel" element={<MarketIntelPage />} />
      <Route path="/policy-intel" element={<PolicyIntelPage />} />
      
      {/* System & Infrastructure Routes */}
      <Route path="/system-link-map" element={<SystemLinkMapPage />} />
      <Route path="/it-metrics" element={<ITServicesPage />} />
      <Route path="/it-cost-pulse" element={<ITCostPulsePage />} />
      <Route path="/process-pulse" element={<ProcessPulsePage />} />
      
      {/* Data & Integration Routes */}
      <Route path="/data-cleaning" element={<DataCleaningPage />} />
      <Route path="/integrations" element={<IntegrationsPage />} />
      
      {/* Business Operations Routes */}
      <Route path="/decision-support" element={<DecisionSupportPage />} />
      <Route path="/opportunity-responder" element={<OpportunityResponderPage />} />
      <Route path="/order-flow-tracker" element={<OrderFlowTrackerPage />} />
      <Route path="/talent-onboard-pulse" element={<TalentOnboardPulsePage />} />
      <Route path="/client-care-performance" element={<ClientCarePerformancePage />} />
      
      {/* User Experience Routes */}
      <Route path="/user-feedback" element={<UserFeedbackPage />} />
      <Route path="/learning-resources" element={<LearningResourcesPage />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}; 