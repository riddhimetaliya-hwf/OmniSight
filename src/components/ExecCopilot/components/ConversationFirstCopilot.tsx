
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Sparkles,
  Mic,
  Send,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  BarChart3,
  Clock,
  ArrowRight,
  Brain,
  Zap,
  Activity,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useCopilotContext } from '../context/CopilotContext';
import { ExecutiveThemeProvider } from './ThemeProvider';
import ParticleBackground from './ParticleBackground';
import ConversationInterface from './ConversationInterface';
import ExecutiveContextSidebar from './ExecutiveContextSidebar';
import DynamicInsightsPanel from './DynamicInsightsPanel';

const ConversationFirstCopilot: React.FC = () => {
  const { isLoading } = useCopilotContext();
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const executiveName = "Sarah"; // This would come from user context

  return (
    <ExecutiveThemeProvider>
      <div className="h-[90vh] relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        {/* Modern gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-purple-50/30"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 h-full flex">
          {/* Left Sidebar - Executive Context */}
          <div className="w-80 border-r border-slate-200/40 bg-white/70 backdrop-blur-xl shadow-xl">
            <ExecutiveContextSidebar />
          </div>

          {/* Main Panel - Conversation Interface */}
          <div className="flex-1 flex flex-col">
            {/* Modern Header */}
            <div className="p-8 border-b border-slate-200/40 bg-white/80 backdrop-blur-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Modern AI Avatar */}
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    {/* Status indicator */}
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    {/* AI processing indicator */}
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Brain className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  
                  {/* Header content */}
                  <div className="space-y-1">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      {getCurrentTime()}, {executiveName}
                    </h1>
                    <p className="text-slate-600 font-medium">
                      Your AI Executive Assistant is ready
                    </p>
                  </div>
                </div>

                {/* Status badges */}
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 font-semibold shadow-sm">
                    <Brain className="h-4 w-4 mr-2" />
                    Neural AI Active
                  </Badge>
                  <Badge className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 font-semibold shadow-sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Live
                  </Badge>
                </div>
              </div>
            </div>

            {/* Main conversation area */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              <div className="flex-1 flex flex-col min-h-0">
                <ConversationInterface onInsightSelect={setSelectedInsight} />
              </div>
            </div>
          </div>

          {/* Right Panel - Dynamic Insights */}
          <div className="w-96 border-l border-slate-200/40 bg-white/70 backdrop-blur-xl shadow-xl">
            <DynamicInsightsPanel selectedInsight={selectedInsight} />
          </div>
        </div>
      </div>
    </ExecutiveThemeProvider>
  );
};

export default ConversationFirstCopilot;
