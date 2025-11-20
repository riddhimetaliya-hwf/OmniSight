
import React, { useState, useEffect } from 'react';
import { IntelligenceItem } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  Brain, 
  TrendingUp, 
  Target, 
  Users, 
  AlertTriangle,
  Lightbulb,
  BarChart3,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AIInsightsPanelProps {
  items: IntelligenceItem[];
  onClose: () => void;
}

interface AIInsight {
  id: string;
  type: 'summary' | 'trend' | 'prediction' | 'impact';
  title: string;
  description: string;
  confidence: number;
  relatedItems: string[];
  actionable: boolean;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  items,
  onClose
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    generateAIInsights();
  }, [items]);
  
  const generateAIInsights = async () => {
    setIsGenerating(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock AI insights based on the data
    const generatedInsights: AIInsight[] = [];
    
    // Executive Summary
    if (items.length > 0) {
      generatedInsights.push({
        id: 'summary-1',
        type: 'summary',
        title: 'Executive Summary',
        description: `Analyzed ${items.length} intelligence items. Critical themes include regulatory changes in ${getTopIndustries(items).slice(0, 2).join(' and ')}, with ${items.filter(i => i.alertLevel === 'high' || i.alertLevel === 'critical').length} high-priority alerts requiring immediate attention.`,
        confidence: 92,
        relatedItems: items.slice(0, 3).map(i => i.id),
        actionable: true
      });
    }
    
    // Trend Analysis
    const trendInsight = analyzeTrends(items);
    if (trendInsight) {
      generatedInsights.push(trendInsight);
    }
    
    // Predictive Insights
    const predictionInsight = generatePrediction(items);
    if (predictionInsight) {
      generatedInsights.push(predictionInsight);
    }
    
    // Business Impact Analysis
    const impactInsight = analyzeBusinessImpact(items);
    if (impactInsight) {
      generatedInsights.push(impactInsight);
    }
    
    setInsights(generatedInsights);
    setIsGenerating(false);
  };
  
  const getTopIndustries = (items: IntelligenceItem[]) => {
    const industryCount = items.reduce((acc, item) => {
      item.industries.forEach(industry => {
        acc[industry] = (acc[industry] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(industryCount)
      .sort(([,a], [,b]) => b - a)
      .map(([industry]) => industry);
  };
  
  const analyzeTrends = (items: IntelligenceItem[]): AIInsight | null => {
    if (items.length < 3) return null;
    
    const topics = items.flatMap(item => item.topics);
    const topicCount = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const trendingTopic = Object.entries(topicCount)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (!trendingTopic) return null;
    
    return {
      id: 'trend-1',
      type: 'trend',
      title: 'Emerging Trend Detected',
      description: `"${trendingTopic[0]}" is trending across ${trendingTopic[1]} intelligence items, representing a 35% increase from last week. This suggests growing market attention and potential strategic implications.`,
      confidence: 87,
      relatedItems: items.filter(item => item.topics.includes(trendingTopic[0])).slice(0, 3).map(i => i.id),
      actionable: true
    };
  };
  
  const generatePrediction = (items: IntelligenceItem[]): AIInsight | null => {
    const criticalItems = items.filter(item => item.alertLevel === 'critical');
    if (criticalItems.length === 0) return null;
    
    return {
      id: 'prediction-1',
      type: 'prediction',
      title: 'Predictive Analysis',
      description: `Based on current critical alerts, there's a 78% probability of significant market shifts in the next 30 days. Recommended actions include portfolio rebalancing and stakeholder communication.`,
      confidence: 78,
      relatedItems: criticalItems.slice(0, 2).map(i => i.id),
      actionable: true
    };
  };
  
  const analyzeBusinessImpact = (items: IntelligenceItem[]): AIInsight | null => {
    const highImpactItems = items.filter(item => 
      item.alertLevel === 'high' || item.alertLevel === 'critical'
    );
    
    if (highImpactItems.length === 0) return null;
    
    return {
      id: 'impact-1',
      type: 'impact',
      title: 'Business Impact Assessment',
      description: `${highImpactItems.length} high-impact intelligence items could affect quarterly projections. Estimated potential impact: Medium to High. Cross-functional coordination recommended.`,
      confidence: 84,
      relatedItems: highImpactItems.slice(0, 3).map(i => i.id),
      actionable: true
    };
  };
  
  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'summary': return Brain;
      case 'trend': return TrendingUp;
      case 'prediction': return Target;
      case 'impact': return BarChart3;
      default: return Lightbulb;
    }
  };
  
  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'summary': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'trend': return 'text-green-600 bg-green-50 border-green-200';
      case 'prediction': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'impact': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="border-b border-slate-200/60 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">AI Intelligence Analysis</h3>
              <p className="text-sm text-slate-600">Automated insights and trend analysis</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-white/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {isGenerating ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="executive-glass-card animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight) => {
              const Icon = getInsightIcon(insight.type);
              const colorClasses = getInsightColor(insight.type);
              
              return (
                <Card key={insight.id} className="executive-glass-card hover:holographic-card transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${colorClasses}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-semibold text-slate-800">
                      {insight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {insight.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-slate-500">
                        <Users className="h-3 w-3 mr-1" />
                        {insight.relatedItems.length} related items
                      </div>
                      
                      {insight.actionable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2 hover:bg-blue-50"
                        >
                          View Details
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightsPanel;
