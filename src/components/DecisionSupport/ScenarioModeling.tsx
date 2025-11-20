
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Lightbulb, Play, Save, Share2 } from 'lucide-react';

const ScenarioModeling: React.FC = () => {
  const [scenario, setScenario] = useState('baseline');
  const [growthRate, setGrowthRate] = useState(5);
  const [costReduction, setCostReduction] = useState(3);
  const [marketExpansion, setMarketExpansion] = useState(10);
  
  // Mock data for different scenarios
  const baselineData = [
    { month: 'Jan', revenue: 1000, profit: 200, customers: 150 },
    { month: 'Feb', revenue: 1200, profit: 250, customers: 160 },
    { month: 'Mar', revenue: 1100, profit: 230, customers: 165 },
    { month: 'Apr', revenue: 1300, profit: 280, customers: 180 },
    { month: 'May', revenue: 1400, profit: 300, customers: 200 },
    { month: 'Jun', revenue: 1500, profit: 320, customers: 220 }
  ];
  
  const calculateScenarioData = () => {
    return baselineData.map((item, index) => {
      const monthOffset = index + 1;
      const growthFactor = 1 + (growthRate / 100) * (monthOffset / 6);
      const costFactor = 1 - (costReduction / 100) * (monthOffset / 6);
      const expansionFactor = 1 + (marketExpansion / 100) * (monthOffset / 6);
      
      return {
        month: item.month,
        revenue: Math.round(item.revenue * growthFactor * expansionFactor),
        profit: Math.round(item.profit * growthFactor * expansionFactor * (2 - costFactor)),
        customers: Math.round(item.customers * expansionFactor)
      };
    });
  };
  
  const scenarioData = calculateScenarioData();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Scenario Modeling
          </CardTitle>
          <CardDescription>
            Model different business scenarios and visualize potential outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={scenario} onValueChange={setScenario}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="baseline">Baseline</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
              <TabsTrigger value="custom">Custom Scenario</TabsTrigger>
            </TabsList>
            
            <TabsContent value="baseline" className="space-y-6">
              <div className="text-sm text-muted-foreground">
                This is your current business trajectory based on historical data and current performance.
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={baselineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
                    <Line type="monotone" dataKey="customers" stroke="#ffc658" name="Customers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="growth" className="space-y-6">
              <div className="text-sm text-muted-foreground">
                Growth scenario assumes optimistic market conditions and successful execution of planned initiatives.
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...baselineData, 
                    { month: 'Jul', revenue: 1700, profit: 380, customers: 240 },
                    { month: 'Aug', revenue: 1900, profit: 420, customers: 260 },
                    { month: 'Sep', revenue: 2100, profit: 470, customers: 290 }
                  ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
                    <Line type="monotone" dataKey="customers" stroke="#ffc658" name="Customers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="growth-rate">Growth Rate (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      id="growth-rate"
                      value={[growthRate]} 
                      min={-10} 
                      max={30} 
                      step={1} 
                      onValueChange={(values) => setGrowthRate(values[0])}
                      className="flex-1"
                    />
                    <span className="w-10 text-center">{growthRate}%</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cost-reduction">Cost Reduction (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      id="cost-reduction"
                      value={[costReduction]} 
                      min={0} 
                      max={20} 
                      step={1} 
                      onValueChange={(values) => setCostReduction(values[0])}
                      className="flex-1"
                    />
                    <span className="w-10 text-center">{costReduction}%</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="market-expansion">Market Expansion (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      id="market-expansion"
                      value={[marketExpansion]} 
                      min={0} 
                      max={50} 
                      step={1} 
                      onValueChange={(values) => setMarketExpansion(values[0])}
                      className="flex-1"
                    />
                    <span className="w-10 text-center">{marketExpansion}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center my-4">
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  Run Simulation
                </Button>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scenarioData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
                    <Line type="monotone" dataKey="customers" stroke="#ffc658" name="Customers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Scenario
                </Button>
                <Button variant="outline" className="gap-1">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioModeling;
