
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Download, 
  Send, 
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { ExecutiveRole } from '@/types/executive-roles';

interface BriefingData {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'board' | 'executive';
  generatedAt: Date;
  keyMetrics: string[];
  decisionPoints: string[];
  risks: string[];
  opportunities: string[];
}

interface ExecutiveBriefingGeneratorProps {
  role: ExecutiveRole;
}

const ExecutiveBriefingGenerator: React.FC<ExecutiveBriefingGeneratorProps> = ({ role }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<'daily' | 'weekly' | 'board' | 'executive'>('daily');
  const [customPrompt, setCustomPrompt] = useState('');
  const [lastBriefing, setLastBriefing] = useState<BriefingData | null>(null);

  const mockBriefings: Record<ExecutiveRole, BriefingData> = {
    CEO: {
      id: '1',
      title: 'CEO Daily Executive Brief',
      type: 'daily',
      generatedAt: new Date(),
      keyMetrics: [
        'Revenue: $2.4M (+12% vs. yesterday)',
        'Market Share: 23.4% (+0.2% this week)',
        'Customer Acquisition: 340 new customers',
        'Brand Sentiment: 84% positive'
      ],
      decisionPoints: [
        'Board approval needed for Southeast Asia expansion ($50M investment)',
        'Strategic partnership proposal from TechCorp requires response by Friday',
        'Q3 budget reallocation decision pending for marketing initiatives'
      ],
      risks: [
        'Competitor launching similar product next month',
        'Key talent retention concerns in engineering',
        'Supply chain disruption risk in Q4'
      ],
      opportunities: [
        'M&A target identified with 340% ROI potential',
        'New market segment showing 25% growth rate',
        'AI automation could reduce costs by $12M annually'
      ]
    },
    CFO: {
      id: '2', 
      title: 'CFO Financial Brief',
      type: 'daily',
      generatedAt: new Date(),
      keyMetrics: [
        'Free Cash Flow: $47.2M (+18% QoQ)',
        'Operating Margin: 24.7% (+2.1% vs target)',
        'DSO: 32 days (-3 days improvement)',
        'Credit Exposure: $12.4M (-8% reduction)'
      ],
      decisionPoints: [
        'Credit facility renewal negotiation with primary bank',
        'Investment committee approval for $25M CapEx',
        'Audit committee review of new accounting standards'
      ],
      risks: [
        'Currency hedging exposure in emerging markets',
        'Compliance deadline for new tax regulations',
        'Interest rate sensitivity on floating debt'
      ],
      opportunities: [
        'Treasury optimization could yield $3M annually',
        'Tax strategy refinement potential savings: $8M',
        'Working capital optimization initiatives'
      ]
    },
    COO: {
      id: '3',
      title: 'COO Operations Brief',
      type: 'daily', 
      generatedAt: new Date(),
      keyMetrics: [
        'Process Efficiency: 92.4% (+4.1% improvement)',
        'Supply Chain Score: 87% (above target)',
        'Capacity Utilization: 89.2% (+5.3%)',
        'Quality Index: 96.8% (industry leading)'
      ],
      decisionPoints: [
        'New supplier qualification for critical components',
        'Facility expansion approval for West Coast operations',
        'Automation investment decision for Production Line 3'
      ],
      risks: [
        'Key supplier financial instability concerns',
        'Regulatory compliance audit next month',
        'Seasonal demand fluctuation planning'
      ],
      opportunities: [
        'Process automation ROI: 280% over 24 months',
        'Vendor consolidation savings: $4.2M annually',
        'Lean manufacturing implementation benefits'
      ]
    },
    CTO: {
      id: '4',
      title: 'CTO Technology Brief',
      type: 'daily',
      generatedAt: new Date(),
      keyMetrics: [
        'System Uptime: 99.97% (SLA exceeded)',
        'Security Score: 94.2% (+2.1% improvement)',
        'Technical Debt: $2.1M (-12% reduction)',
        'Innovation Pipeline: 14 active R&D projects'
      ],
      decisionPoints: [
        'Cloud migration Phase 2 budget approval',
        'Cybersecurity platform vendor selection',
        'AI/ML infrastructure investment strategy'
      ],
      risks: [
        'Legacy system EOL timeline concerns',
        'Cybersecurity threat landscape evolution',
        'Key technical talent competitive pressure'
      ],
      opportunities: [
        'AI implementation cost savings: $15M potential',
        'API monetization revenue stream: $8M ARR',
        'Patent portfolio licensing opportunities'
      ]
    },
    CMO: {
      id: '5',
      title: 'CMO Marketing Brief',
      type: 'daily',
      generatedAt: new Date(),
      keyMetrics: [
        'Brand Awareness: 67% (+8% improvement)',
        'Marketing ROI: 340% (above benchmark)',
        'Lead Quality Score: 8.2/10',
        'Customer Sentiment: 4.2/5 stars'
      ],
      decisionPoints: [
        'Q4 campaign budget reallocation across channels',
        'Influencer partnership contract negotiations',
        'Brand refresh project timeline approval'
      ],
      risks: [
        'Privacy regulation impact on attribution',
        'Competitive campaign intensity increasing',
        'Economic downturn affecting B2B demand'
      ],
      opportunities: [
        'Video content 3x conversion improvement',
        'International market expansion potential',
        'Marketing automation efficiency gains'
      ]
    }
  };

  const generateBriefing = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setLastBriefing(mockBriefings[role]);
      setIsGenerating(false);
    }, 2000);
  };

  const briefingTypes = [
    { value: 'daily', label: 'Daily Brief', icon: Clock },
    { value: 'weekly', label: 'Weekly Summary', icon: Calendar },
    { value: 'board', label: 'Board Presentation', icon: Users },
    { value: 'executive', label: 'Executive Summary', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Executive Briefing Generator</h3>
            <p className="text-sm text-muted-foreground">AI-powered briefing and presentation creation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generate New Briefing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Briefing Type</label>
              <div className="grid grid-cols-2 gap-2">
                {briefingTypes.map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={selectedType === value ? "default" : "outline"}
                    size="sm"
                    className="justify-start gap-2"
                    onClick={() => setSelectedType(value as any)}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Instructions (Optional)</label>
              <Textarea
                placeholder="e.g., Focus on Q3 performance, include competitive analysis..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Button 
              onClick={generateBriefing}
              disabled={isGenerating}
              className="w-full gap-2"
            >
              <FileText className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Briefing'}
            </Button>
          </CardContent>
        </Card>

        {lastBriefing && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{lastBriefing.title}</CardTitle>
                <Badge variant="success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Generated
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Generated {lastBriefing.generatedAt.toLocaleTimeString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Key Metrics
                  </h4>
                  <ul className="text-xs space-y-1">
                    {lastBriefing.keyMetrics.slice(0, 2).map((metric, i) => (
                      <li key={i} className="text-muted-foreground">• {metric}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Decision Points
                  </h4>
                  <ul className="text-xs space-y-1">
                    {lastBriefing.decisionPoints.slice(0, 2).map((point, i) => (
                      <li key={i} className="text-muted-foreground">• {point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Download className="h-3 w-3" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Send className="h-3 w-3" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExecutiveBriefingGenerator;
