
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Eye,
  AlertCircle
} from 'lucide-react';
import { ExecutiveRole } from '@/types/executive-roles';

interface StrategicGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  deadline: Date;
  status: 'on-track' | 'at-risk' | 'behind';
  category: string;
  owner: string;
}

interface ScenarioData {
  id: string;
  name: string;
  probability: number;
  impact: 'high' | 'medium' | 'low';
  revenue_impact: number;
  cost_impact: number;
  timeline: string;
}

interface StrategicPlanningToolsProps {
  role: ExecutiveRole;
}

const StrategicPlanningTools: React.FC<StrategicPlanningToolsProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'goals' | 'resources'>('scenarios');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const mockGoals: Record<ExecutiveRole, StrategicGoal[]> = {
    CEO: [
      {
        id: '1',
        title: 'Market Expansion - Southeast Asia',
        description: 'Establish operations in 3 key Southeast Asian markets',
        progress: 65,
        target: 100,
        deadline: new Date('2024-12-31'),
        status: 'on-track',
        category: 'Growth',
        owner: 'Regional VP'
      },
      {
        id: '2',
        title: 'Digital Transformation Initiative',
        description: 'Complete company-wide digital transformation',
        progress: 42,
        target: 100,
        deadline: new Date('2024-09-30'),
        status: 'at-risk',
        category: 'Technology',
        owner: 'CTO'
      }
    ],
    CFO: [
      {
        id: '3',
        title: 'Operating Margin Improvement',
        description: 'Achieve 25% operating margin through cost optimization',
        progress: 78,
        target: 100,
        deadline: new Date('2024-12-31'),
        status: 'on-track',
        category: 'Financial',
        owner: 'CFO'
      }
    ],
    COO: [
      {
        id: '4',
        title: 'Supply Chain Resilience',
        description: 'Establish redundant supply chain with 99.5% reliability',
        progress: 55,
        target: 100,
        deadline: new Date('2024-10-31'),
        status: 'on-track',
        category: 'Operations',
        owner: 'COO'
      }
    ],
    CTO: [
      {
        id: '5',
        title: 'Cloud Migration Phase 2',
        description: 'Migrate 80% of legacy systems to cloud infrastructure',
        progress: 34,
        target: 100,
        deadline: new Date('2024-11-30'),
        status: 'behind',
        category: 'Technology',
        owner: 'CTO'
      }
    ],
    CMO: [
      {
        id: '6',
        title: 'Brand Awareness Campaign',
        description: 'Increase brand awareness to 75% in target markets',
        progress: 89,
        target: 100,
        deadline: new Date('2024-08-31'),
        status: 'on-track',
        category: 'Marketing',
        owner: 'CMO'
      }
    ]
  };

  const scenarios: ScenarioData[] = [
    {
      id: '1',
      name: 'Economic Downturn',
      probability: 35,
      impact: 'high',
      revenue_impact: -15,
      cost_impact: 8,
      timeline: '6-12 months'
    },
    {
      id: '2',
      name: 'Market Expansion Success',
      probability: 65,
      impact: 'high',
      revenue_impact: 25,
      cost_impact: 12,
      timeline: '12-18 months'
    },
    {
      id: '3',
      name: 'Competitor Disruption',
      probability: 45,
      impact: 'medium',
      revenue_impact: -8,
      cost_impact: 5,
      timeline: '3-6 months'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'success';
      case 'at-risk':
        return 'warning';
      case 'behind':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const goals = mockGoals[role] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Strategic Planning Tools</h3>
            <p className="text-sm text-muted-foreground">Scenario planning, goal tracking, and resource optimization</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { id: 'scenarios', label: 'Scenarios', icon: BarChart3 },
          { id: 'goals', label: 'Goals', icon: Target },
          { id: 'resources', label: 'Resources', icon: DollarSign }
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(id as any)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What-If Scenarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedScenario === scenario.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{scenario.name}</h4>
                    <Badge variant={getImpactColor(scenario.impact)} size="sm">
                      {scenario.impact} impact
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Probability:</span>
                      <span>{scenario.probability}%</span>
                    </div>
                    <Progress value={scenario.probability} className="h-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedScenario && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scenario Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const scenario = scenarios.find(s => s.id === selectedScenario);
                  if (!scenario) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Revenue Impact</span>
                          </div>
                          <div className={`text-lg font-bold ${scenario.revenue_impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {scenario.revenue_impact > 0 ? '+' : ''}{scenario.revenue_impact}%
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">Cost Impact</span>
                          </div>
                          <div className="text-lg font-bold text-orange-600">
                            +{scenario.cost_impact}%
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Timeline</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{scenario.timeline}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Eye className="h-4 w-4" />
                        View Detailed Analysis
                      </Button>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Strategic Goals Tracking</h4>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{goal.title}</h4>
                        <Badge variant={getStatusColor(goal.status)} size="sm">
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{goal.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Owner: {goal.owner}</span>
                        <span>Due: {goal.deadline.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resource Allocation Optimizer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-lg font-bold">$12.4M</div>
                  <div className="text-xs text-muted-foreground">Available Budget</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-lg font-bold">340</div>
                  <div className="text-xs text-muted-foreground">Team Members</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-lg font-bold">12</div>
                  <div className="text-xs text-muted-foreground">Active Projects</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h5 className="font-medium text-sm">Optimization Recommendations</h5>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Budget Reallocation Opportunity</p>
                      <p className="text-muted-foreground text-xs">Moving $2M from Project Alpha to Beta could increase ROI by 34%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Resource Optimization</p>
                      <p className="text-muted-foreground text-xs">Cross-training 15 team members could improve utilization by 18%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StrategicPlanningTools;
