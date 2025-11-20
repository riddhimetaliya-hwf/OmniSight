
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Presentation, 
  Users, 
  Shield, 
  Scale, 
  Calendar,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Target
} from 'lucide-react';
import { useCopilotContext } from '../context/CopilotContext';

interface BoardMeetingPrep {
  agenda: string[];
  keyMetrics: Array<{ name: string; value: string; trend: 'up' | 'down' | 'stable' }>;
  talkingPoints: string[];
  risks: string[];
}

interface CompetitorData {
  id: string;
  name: string;
  marketShare: number;
  recentNews: string;
  threat: 'low' | 'medium' | 'high';
}

interface RiskAssessment {
  id: string;
  category: string;
  description: string;
  probability: number;
  impact: number;
  riskScore: number;
  mitigation: string;
}

const ExecutiveFeatures: React.FC = () => {
  const { generateBriefing, isLoading } = useCopilotContext();
  const [activeTab, setActiveTab] = useState('board-prep');

  const [boardPrep] = useState<BoardMeetingPrep>({
    agenda: [
      'Q4 Financial Review',
      'Strategic Initiative Updates',
      'Market Position Analysis',
      'Risk Assessment Review',
      'Q1 Planning Overview'
    ],
    keyMetrics: [
      { name: 'Revenue', value: '$2.4M', trend: 'up' },
      { name: 'Growth Rate', value: '+12%', trend: 'up' },
      { name: 'Market Share', value: '18%', trend: 'stable' },
      { name: 'Customer Retention', value: '94%', trend: 'up' }
    ],
    talkingPoints: [
      'Strong Q4 performance exceeded targets by 12%',
      'Enterprise segment showing accelerated growth',
      'New product line generating positive market response',
      'Operational efficiency improvements yielding cost savings'
    ],
    risks: [
      'Supply chain constraints in Q1',
      'Competitive pressure in key markets',
      'Regulatory changes pending approval'
    ]
  });

  const [competitors] = useState<CompetitorData[]>([
    {
      id: '1',
      name: 'TechCorp Solutions',
      marketShare: 25,
      recentNews: 'Announced partnership with major cloud provider',
      threat: 'high'
    },
    {
      id: '2',
      name: 'InnovateTech',
      marketShare: 15,
      recentNews: 'Launched new AI-powered product suite',
      threat: 'medium'
    },
    {
      id: '3',
      name: 'GlobalTech Systems',
      marketShare: 12,
      recentNews: 'Expanding into European markets',
      threat: 'medium'
    }
  ]);

  const [riskAssessments] = useState<RiskAssessment[]>([
    {
      id: '1',
      category: 'Market Risk',
      description: 'Economic downturn affecting enterprise spending',
      probability: 35,
      impact: 70,
      riskScore: 25,
      mitigation: 'Diversify customer base and develop recession-resistant products'
    },
    {
      id: '2',
      category: 'Operational Risk',
      description: 'Key talent retention in competitive market',
      probability: 60,
      impact: 50,
      riskScore: 30,
      mitigation: 'Enhanced compensation packages and career development programs'
    },
    {
      id: '3',
      category: 'Technology Risk',
      description: 'Cybersecurity threats to core systems',
      probability: 25,
      impact: 90,
      riskScore: 23,
      mitigation: 'Multi-layered security framework and regular penetration testing'
    }
  ]);

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/30';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/30';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 30) return 'text-red-600';
    if (score >= 20) return 'text-amber-600';
    return 'text-green-600';
  };

  const generateBoardMaterials = async () => {
    await generateBriefing('weekly');
    // Additional board-specific generation logic would go here
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="board-prep">Board Prep</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          <TabsTrigger value="decisions">Decision Support</TabsTrigger>
        </TabsList>

        <TabsContent value="board-prep" className="space-y-4">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Presentation className="h-5 w-5 text-blue-500" />
                  Board Meeting Preparation
                </CardTitle>
                <Button onClick={generateBoardMaterials} disabled={isLoading} size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Materials
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Meeting Agenda</h4>
                <div className="space-y-2">
                  {boardPrep.agenda.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  {boardPrep.keyMetrics.map((metric, index) => (
                    <div key={index} className="p-3 rounded-lg border bg-background/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{metric.name}</span>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : metric.trend === 'down' ? (
                          <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <div className="text-lg font-bold">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Key Talking Points</h4>
                <div className="space-y-2">
                  {boardPrep.talkingPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-500" />
                Competitive Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {competitors.map((competitor) => (
                <div key={competitor.id} className="p-3 rounded-lg border bg-background/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{competitor.name}</h4>
                      <p className="text-xs text-muted-foreground">Market Share: {competitor.marketShare}%</p>
                    </div>
                    <Badge className={getThreatColor(competitor.threat)}>
                      {competitor.threat} threat
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{competitor.recentNews}</p>
                  <div className="mt-2">
                    <Progress value={competitor.marketShare} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Risk Assessment Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskAssessments.map((risk) => (
                <div key={risk.id} className="p-3 rounded-lg border bg-background/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{risk.category}</h4>
                      <p className="text-xs text-muted-foreground">{risk.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getRiskScoreColor(risk.riskScore)}`}>
                        {risk.riskScore}
                      </div>
                      <div className="text-xs text-muted-foreground">Risk Score</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                    <div>
                      <span className="text-muted-foreground">Probability:</span>
                      <Progress value={risk.probability} className="h-1 mt-1" />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Impact:</span>
                      <Progress value={risk.impact} className="h-1 mt-1" />
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Mitigation:</span>
                    <p className="mt-1">{risk.mitigation}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-green-500" />
                Decision Support System
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Decision Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ask me to analyze any business decision with pros, cons, and data-backed recommendations.
              </p>
              <Button variant="outline">
                Start Decision Analysis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveFeatures;
