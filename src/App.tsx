import React from "react";
import { Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Insights from "./pages/Insights";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Workflows from "./pages/Workflows";
import WorkflowStudioPage from "./pages/WorkflowStudioPage";
import Reports from "./pages/Reports";
import ExecCopilotPage from "./pages/ExecCopilotPage";
import CommandCenter from "./pages/CommandCenter";
import InsightsPage from "./pages/InsightsPage";
import KPITrackerPage from "./pages/KPITrackerPage";
import AlertManagerPage from "./pages/AlertManagerPage";
import AutoPilotPage from "./pages/AutoPilotPage";
import RBACManager from "./pages/RBACManager";
import MarketIntelPage from "./pages/MarketIntelPage";
import SmartSyncBriefingPage from "./pages/SmartSyncBriefingPage";
import SystemLinkMapPage from "./pages/SystemLinkMapPage";
import { PreBuiltTemplates } from "./components/n8nWorkFlow/components/PreBuiltTemplates";
import WorkflowBuilderPage from "./pages/WorkflowBuilderPage";
import OmniCommandPage from "./pages/OmniCommandPage";
import VoiceDashboardPage from "./pages/VoiceDashboardPage";
import PromptToAppBuilder from "./pages/PromptToAppBuilder";
import DataCleaningPage from "./pages/DataCleaningPage";
import PolicyIntelPage from "./pages/PolicyIntelPage";
import PerformanceAnalyticsPage from "./pages/PerformanceAnalyticsPage";
import DecisionSupportPage from "./pages/DecisionSupportPage";
import UserFeedbackPage from "./pages/UserFeedbackPage";
import LearningResourcesPage from "./pages/LearningResourcesPage";
import PerformanceHubPage from "./pages/PerformanceHubPage";
import ITServicesPage from "./pages/ITServicesPage";
import ITCostPulsePage from "./pages/ITCostPulsePage";
import ProcessPulsePage from "./pages/ProcessPulsePage";
import OpportunityResponderPage from "./pages/OpportunityResponderPage";
import PerformanceBriefingAIPage from "./pages/PerformanceBriefingAIPage";
import OrderFlowTrackerPage from "./pages/OrderFlowTrackerPage";
import TalentOnboardPulsePage from "./pages/TalentOnboardPulsePage";
import ClientCarePerformancePage from "./pages/ClientCarePerformancePage";
import IntegrationsPage from "./pages/IntegrationsPage";
import { OmniGuideProvider } from "./components/OmniGuide/context/OmniGuideContext";
import { AutoSummaryProvider } from "./components/AutoSummaryAI/context/AutoSummaryProvider";
import { KPIProvider } from "./components/KPITracker/context/KPIContext";
import { Toaster } from "./components/ui/toaster";
import OverViewPage from "./components/OverViewPage/pages/index";

import "./App.css";

function App() {
  return (
    <>
      <Toaster />
      <OmniGuideProvider>
        <AutoSummaryProvider>
          <KPIProvider>
            <AppShell>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/insights-engine" element={<InsightsPage />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/alert-manager" element={<AlertManagerPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/workflows" element={<Workflows />} />
                <Route
                  path="/workflow-studio"
                  element={<WorkflowStudioPage />}
                />
                <Route path="/autopilot" element={<AutoPilotPage />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/exec-copilot" element={<ExecCopilotPage />} />
                <Route path="/command-center" element={<CommandCenter />} />
                <Route path="/kpi-tracker" element={<KPITrackerPage />} />
                <Route path="/rbac" element={<RBACManager />} />
                <Route path="/market-intel" element={<MarketIntelPage />} />
                <Route
                  path="/data-briefings"
                  element={<SmartSyncBriefingPage />}
                />
                <Route
                  path="/system-link-map"
                  element={<SystemLinkMapPage />}
                />
                <Route
                  path="/workflows-template"
                  element={<PreBuiltTemplates />}
                />
                <Route
                  path="/workflow-builder"
                  element={<WorkflowBuilderPage />}
                />
                <Route path="overview-page" element={<OverViewPage />} />
                <Route path="/omni-command" element={<OmniCommandPage />} />
                <Route
                  path="/voice-dashboard"
                  element={<VoiceDashboardPage />}
                />
                <Route path="/prompt-to-app" element={<PromptToAppBuilder />} />
                <Route path="/data-cleaning" element={<DataCleaningPage />} />
                <Route path="/policy-intel" element={<PolicyIntelPage />} />
                <Route
                  path="/performance-analytics"
                  element={<PerformanceAnalyticsPage />}
                />

                <Route
                  path="/performance-hub"
                  element={<PerformanceHubPage />}
                />
                <Route path="/it-metrics" element={<ITServicesPage />} />
                <Route path="/it-cost-pulse" element={<ITCostPulsePage />} />
                <Route path="/process-pulse" element={<ProcessPulsePage />} />
                <Route
                  path="/opportunity-responder"
                  element={<OpportunityResponderPage />}
                />
                <Route
                  path="/performance-briefing"
                  element={<PerformanceBriefingAIPage />}
                />

                {/* Core Business Performance Routes */}
                <Route
                  path="/order-flow-tracker"
                  element={<OrderFlowTrackerPage />}
                />
                <Route
                  path="/talent-onboard-pulse"
                  element={<TalentOnboardPulsePage />}
                />
                <Route
                  path="/client-care-performance"
                  element={<ClientCarePerformancePage />}
                />

                <Route
                  path="/decision-support"
                  element={<DecisionSupportPage />}
                />
                <Route path="/user-feedback" element={<UserFeedbackPage />} />
                <Route
                  path="/learning-resources"
                  element={<LearningResourcesPage />}
                />

                {/* Add the new integrations page route */}
                <Route path="/integrations" element={<IntegrationsPage />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppShell>
          </KPIProvider>
        </AutoSummaryProvider>
      </OmniGuideProvider>
    </>
  );
}

export default App;
