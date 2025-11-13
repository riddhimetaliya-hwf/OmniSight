
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  Calendar, 
  Zap, 
  MessageSquare,
  Sun,
  Brain
} from 'lucide-react';
import { useCopilotContext } from '../context/CopilotContext';
import InsightsTab from './InsightsTab';
import RecommendationsTab from './RecommendationsTab';
import SmartBriefings from './SmartBriefings';
import ContextualCards from './ContextualCards';
import QuickActions from './QuickActions';

interface CopilotBodyProps {
  isExpanded: boolean;
}

const CopilotBody: React.FC<CopilotBodyProps> = ({ isExpanded }) => {
  const { insights, recommendations, recentQueries } = useCopilotContext();
  const [activeTab, setActiveTab] = useState('briefings');

  return (
    <div className="flex-1 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="mx-4 mt-4 mb-0 grid grid-cols-5 bg-white/10 backdrop-blur-xl">
          <TabsTrigger value="briefings" className="flex items-center gap-1.5 text-xs">
            <Sun className="h-3.5 w-3.5" />
            <span className={isExpanded ? 'inline' : 'hidden sm:inline'}>Briefings</span>
          </TabsTrigger>
          <TabsTrigger value="context" className="flex items-center gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span className={isExpanded ? 'inline' : 'hidden sm:inline'}>Context</span>
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex items-center gap-1.5 text-xs">
            <Zap className="h-3.5 w-3.5" />
            <span className={isExpanded ? 'inline' : 'hidden sm:inline'}>Actions</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-1.5 text-xs">
            <Lightbulb className="h-3.5 w-3.5" />
            <span className={isExpanded ? 'inline' : 'hidden sm:inline'}>Insights</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-1.5 text-xs">
            <Brain className="h-3.5 w-3.5" />
            <span className={isExpanded ? 'inline' : 'hidden sm:inline'}>Rec</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <TabsContent value="briefings" className="mt-4 space-y-4">
            <SmartBriefings />
          </TabsContent>
          
          <TabsContent value="context" className="mt-4 space-y-4">
            <ContextualCards />
          </TabsContent>
          
          <TabsContent value="actions" className="mt-4 space-y-4">
            <QuickActions />
          </TabsContent>
          
          <TabsContent value="insights" className="mt-4 space-y-4">
            <InsightsTab insights={insights} />
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-4 space-y-4">
            <RecommendationsTab recommendations={recommendations} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CopilotBody;
