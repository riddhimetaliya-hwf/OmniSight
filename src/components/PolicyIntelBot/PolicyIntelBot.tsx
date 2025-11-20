
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Flag, 
  Bell, 
  FileText,
  List,
  Info,
  Building,
  Mail,
  Search 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { PolicyCategory, PolicyPriority, PolicyUpdate } from './types';
import { mockPolicyUpdates, mockDepartments } from './mockData';
import PolicyFeed from './PolicyFeed';
import DepartmentImpact from './DepartmentImpact';
import PolicyFilters from './PolicyFilters';
import PolicyAlert from './PolicyAlert';

const PolicyIntelBot: React.FC = () => {
  const [policyUpdates, setPolicyUpdates] = useState<PolicyUpdate[]>(mockPolicyUpdates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<PolicyCategory[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<PolicyPriority[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyUpdate | null>(null);
  const [showDepartmentImpact, setShowDepartmentImpact] = useState(false);
  
  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (categories: PolicyCategory[]) => {
    setSelectedCategories(categories);
  };

  const handlePriorityChange = (priorities: PolicyPriority[]) => {
    setSelectedPriorities(priorities);
  };

  const handlePolicyClick = (policy: PolicyUpdate) => {
    // Mark policy as viewed
    if (!policy.viewed) {
      const updatedPolicies = policyUpdates.map(p => 
        p.id === policy.id ? { ...p, viewed: true } : p
      );
      setPolicyUpdates(updatedPolicies);
    }
    
    setSelectedPolicy(policy);
    setShowDepartmentImpact(false);
  };

  const showImpactAnalysis = () => {
    setShowDepartmentImpact(true);
  };

  const setupAlert = (policy: PolicyUpdate) => {
    toast({
      title: "Alert set up",
      description: `You'll be notified of updates to "${policy.title}"`,
    });
  };

  const filteredPolicies = policyUpdates.filter(policy => {
    // Apply search filter
    if (searchQuery && !policy.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !policy.summary.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (selectedCategories.length > 0 && 
        !policy.categories.some(category => selectedCategories.includes(category))) {
      return false;
    }
    
    // Apply priority filter
    if (selectedPriorities.length > 0 && !selectedPriorities.includes(policy.priority)) {
      return false;
    }
    
    return true;
  });

  const unreadCount = policyUpdates.filter(p => !p.viewed).length;
  const criticalCount = policyUpdates.filter(p => p.priority === 'critical').length;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <Flag className="mr-2 h-5 w-5 text-primary" />
              Policy Intelligence
            </CardTitle>
            <CardDescription>
              Stay updated on regulatory changes and policy impacts
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Bell className="h-4 w-4" />
              Manage Alerts
            </Button>
            <PolicyAlert count={unreadCount} criticalCount={criticalCount} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="feed" className="space-y-4">
          <div className="flex justify-between items-start">
            <TabsList>
              <TabsTrigger value="feed" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                Feed
              </TabsTrigger>
              <TabsTrigger value="departments" className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                Department View
              </TabsTrigger>
            </TabsList>
            
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search policies..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <PolicyFilters
                selectedCategories={selectedCategories}
                selectedPriorities={selectedPriorities}
                onCategoryChange={handleCategoryChange}
                onPriorityChange={handlePriorityChange}
              />
              
              <TabsContent value="feed" className="m-0">
                <PolicyFeed 
                  policies={filteredPolicies}
                  selectedPolicy={selectedPolicy}
                  onPolicyClick={handlePolicyClick}
                />
              </TabsContent>
              
              <TabsContent value="departments" className="m-0">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      Departments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="space-y-2">
                      {mockDepartments.map(department => (
                        <div 
                          key={department.id}
                          className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                        >
                          <span className="text-sm">{department.name}</span>
                          <Badge variant="secondary">
                            {department.policies.length}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              {selectedPolicy ? (
                showDepartmentImpact ? (
                  <DepartmentImpact 
                    policy={selectedPolicy}
                    departments={mockDepartments}
                    onBack={() => setShowDepartmentImpact(false)}
                  />
                ) : (
                  <Card>
                    <CardHeader className="pb-2 relative">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              className={
                                selectedPolicy.priority === 'critical' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                                selectedPolicy.priority === 'high' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                                selectedPolicy.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                'bg-green-100 text-green-800 hover:bg-green-100'
                              }
                            >
                              {selectedPolicy.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {selectedPolicy.source.toUpperCase()}
                            </Badge>
                          </div>
                          <CardTitle>{selectedPolicy.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <span>Source: {selectedPolicy.sourceName}</span>
                            <span>•</span>
                            <span>
                              Published: {new Date(selectedPolicy.datePublished).toLocaleDateString()}
                            </span>
                            {selectedPolicy.effectiveDate && (
                              <>
                                <span>•</span>
                                <span>
                                  Effective: {new Date(selectedPolicy.effectiveDate).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Summary</h4>
                        <p className="text-sm">{selectedPolicy.summary}</p>
                      </div>
                      
                      {selectedPolicy.fullContent && (
                        <div>
                          <h4 className="font-medium mb-2">Details</h4>
                          <p className="text-sm whitespace-pre-line">{selectedPolicy.fullContent}</p>
                        </div>
                      )}
                      
                      {selectedPolicy.requiredActions && selectedPolicy.requiredActions.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Required Actions</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedPolicy.requiredActions.map((action, index) => (
                              <li key={index} className="text-sm">{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button onClick={showImpactAnalysis} className="gap-1">
                          <Info className="h-4 w-4" />
                          How Does This Impact Me?
                        </Button>
                        <Button variant="outline" onClick={() => setupAlert(selectedPolicy)} className="gap-1">
                          <Bell className="h-4 w-4" />
                          Set Alert
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-[400px] border rounded-md p-4">
                  <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No policy selected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a policy from the feed to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PolicyIntelBot;
