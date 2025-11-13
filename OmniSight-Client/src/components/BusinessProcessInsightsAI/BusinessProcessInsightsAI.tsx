import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ProcessInsightsList from './components/ProcessInsightsList';
import ProcessInsightsPrompt from './components/ProcessInsightsPrompt';
import VoiceCommandButton from './components/VoiceCommandButton';
import { useProcessInsights } from './hooks/useProcessInsights';
import { Lightbulb, Search, Zap, Terminal, Clock, TrendingDown, TrendingUp, Users } from 'lucide-react';

const BusinessProcessInsightsAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState('order-flow');
  const { 
    insights, 
    isLoading, 
    submitPrompt, 
    generateInsight, 
    recommendedPrompts 
  } = useProcessInsights();

  const handlePromptSubmit = (prompt: string) => {
    submitPrompt(prompt);
  };

  const handleVoiceCommand = (transcript: string) => {
    submitPrompt(transcript);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            Business Process Insights AI
          </h2>
          <p className="text-muted-foreground">
            AI-generated explanations for business process metrics and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <VoiceCommandButton onTranscript={handleVoiceCommand} />
          <Button 
            variant="outline" 
            onClick={() => generateInsight('performance_trend')}
            className="gap-1"
          >
            <Zap className="h-4 w-4" />
            <span>Generate Insight</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex gap-2 bg-white/70 dark:bg-card/70 rounded-full shadow-lg p-1 w-fit">
          <TabsTrigger 
            value="order-flow"
            className="px-6 py-2 rounded-full font-semibold text-base transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
          >Order Flow</TabsTrigger>
          <TabsTrigger 
            value="talent-onboard"
            className="px-6 py-2 rounded-full font-semibold text-base transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
          >Talent Onboard</TabsTrigger>
          <TabsTrigger 
            value="client-care"
            className="px-6 py-2 rounded-full font-semibold text-base transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
          >Client Care</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <ProcessInsightsPrompt 
            onSubmit={handlePromptSubmit} 
            recommendedPrompts={recommendedPrompts[activeTab]}
            isLoading={isLoading}
          />
        </div>

        <TabsContent value="order-flow" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Order Flow Performance Insights</CardTitle>
                  <CardDescription>
                    AI-powered explanations for order process metrics
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Clock className="h-3.5 w-3.5 mr-1" /> Order Flow
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ProcessInsightsList 
                insights={insights.filter(i => i.processArea === 'order-flow')}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="talent-onboard" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Talent Onboarding Performance Insights</CardTitle>
                  <CardDescription>
                    AI-powered explanations for talent acquisition and onboarding metrics
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Users className="h-3.5 w-3.5 mr-1" /> Talent Onboard
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ProcessInsightsList 
                insights={insights.filter(i => i.processArea === 'talent-onboard')}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="client-care" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Client Care Performance Insights</CardTitle>
                  <CardDescription>
                    AI-powered explanations for client service metrics
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" /> Client Care
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ProcessInsightsList 
                insights={insights.filter(i => i.processArea === 'client-care')}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessProcessInsightsAI;
