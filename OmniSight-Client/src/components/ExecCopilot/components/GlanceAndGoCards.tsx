
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Brain
} from 'lucide-react';

interface MetricData {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  additionalContext: string;
  priority: 'high' | 'medium' | 'low';
  insight: string;
}

const mockMetrics: MetricData[] = [
  {
    id: '1',
    label: 'Revenue Impact',
    value: '$3.2M',
    change: '+18.5%',
    trend: 'up',
    icon: DollarSign,
    additionalContext: 'Q4 target: $3.8M | Exceeding forecasts by 12%',
    priority: 'high',
    insight: 'New product launch driving exceptional growth'
  },
  {
    id: '2',
    label: 'Team Excellence',
    value: '96%',
    change: '+12.3%',
    trend: 'up',
    icon: Users,
    additionalContext: 'Top performer: AI Division (99%) | Strategic focus: Sales enablement',
    priority: 'medium',
    insight: 'AI integration boosting team productivity significantly'
  },
  {
    id: '3',
    label: 'Client Satisfaction',
    value: '4.9/5',
    change: '+0.4',
    trend: 'up',
    icon: Target,
    additionalContext: 'NPS Score: 84 | Client retention at all-time high of 98%',
    priority: 'high',
    insight: 'Premium support model delivering exceptional results'
  },
  {
    id: '4',
    label: 'Efficiency Gains',
    value: '34%',
    change: '-8.2%',
    trend: 'down',
    icon: BarChart3,
    additionalContext: 'AI automation savings: $280K | Cloud optimization: $150K',
    priority: 'medium',
    insight: 'Operational excellence through intelligent automation'
  }
];

export const GlanceAndGoCards: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {mockMetrics.map((metric) => {
        const Icon = metric.icon;
        const isHovered = hoveredCard === metric.id;
        
        return (
          <Card
            key={metric.id}
            className={`glance-card hover-reveal cursor-pointer transition-all duration-400 ${
              isHovered ? 'holographic-card' : ''
            }`}
            onMouseEnter={() => setHoveredCard(metric.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                isHovered 
                  ? 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 shadow-lg transform scale-110' 
                  : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600'
              }`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge 
                  variant="outline"
                  className={`text-xs font-semibold px-2 py-1 transition-all duration-300 ${
                    metric.priority === 'high' 
                      ? 'border-red-200 text-red-600 bg-gradient-to-br from-red-50 to-pink-50' 
                      : metric.priority === 'medium'
                      ? 'border-amber-200 text-amber-600 bg-gradient-to-br from-amber-50 to-yellow-50'
                      : 'border-slate-200 text-slate-600 bg-gradient-to-br from-slate-50 to-gray-50'
                  }`}
                >
                  {metric.priority}
                </Badge>
                {isHovered && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 animate-fade-in">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Insight
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="metric-label text-sm font-semibold text-slate-600 uppercase tracking-wide">
                {metric.label}
              </p>
              <div className="flex items-end justify-between">
                <span className={`metric-value text-3xl font-bold transition-all duration-300 ${
                  isHovered ? 'text-transparent bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text' : 'text-slate-800'
                }`}>
                  {metric.value}
                </span>
                <div className={`metric-change flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  metric.trend === 'up' 
                    ? 'positive bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' 
                    : metric.trend === 'down'
                    ? 'negative bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                    : 'neutral bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : metric.trend === 'down' ? (
                    <ArrowDownRight className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-current opacity-50" />
                  )}
                  {metric.change}
                </div>
              </div>
              
              {isHovered && (
                <div className="mt-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      AI Analysis
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 font-medium leading-relaxed">
                    {metric.insight}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Context - Revealed on Hover */}
            <div className="additional-context">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                  Executive Context
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {metric.additionalContext}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
