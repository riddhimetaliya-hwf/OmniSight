
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Check, X, AlertTriangle, Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

type ValidationRuleStatus = 'active' | 'inactive' | 'failed';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  query: string;
  status: ValidationRuleStatus;
  lastRun: string;
  dataSource: string;
  failureCount: number;
}

const mockRules: ValidationRule[] = [
  {
    id: '1',
    name: 'Date Range Validation',
    description: 'Ensures all dates are within acceptable ranges',
    query: "SELECT * FROM sales WHERE date < '2015-01-01'",
    status: 'active',
    lastRun: '2023-07-15T09:30:00',
    dataSource: 'Sales Data',
    failureCount: 0,
  },
  {
    id: '2',
    name: 'Numeric Range Check',
    description: 'Validates that numeric values fall within expected ranges',
    query: 'SELECT * FROM inventory WHERE quantity < 0',
    status: 'failed',
    lastRun: '2023-07-14T14:45:00',
    dataSource: 'Inventory Data',
    failureCount: 23,
  },
  {
    id: '3',
    name: 'Required Fields Check',
    description: 'Ensures all required fields have values',
    query: 'SELECT * FROM customers WHERE email IS NULL OR phone IS NULL',
    status: 'active',
    lastRun: '2023-07-15T11:15:00',
    dataSource: 'Customer Data',
    failureCount: 0,
  },
  {
    id: '4',
    name: 'Referential Integrity',
    description: 'Verifies foreign key relationships are maintained',
    query: 'SELECT * FROM orders WHERE customer_id NOT IN (SELECT id FROM customers)',
    status: 'inactive',
    lastRun: '2023-07-10T08:20:00', 
    dataSource: 'Orders Data',
    failureCount: 0,
  },
];

const DataValidationRules: React.FC = () => {
  const [rules, setRules] = useState<ValidationRule[]>(mockRules);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<ValidationRule>>({
    name: '',
    description: '',
    query: '',
    dataSource: '',
  });
  const { toast } = useToast();

  const handleAddRule = () => {
    if (!newRule.name || !newRule.query) {
      toast({
        title: "Missing information",
        description: "Please provide at least a rule name and query.",
        variant: "destructive",
      });
      return;
    }

    const rule: ValidationRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name,
      description: newRule.description || '',
      query: newRule.query,
      status: 'active',
      lastRun: new Date().toISOString(),
      dataSource: newRule.dataSource || 'Default',
      failureCount: 0,
    };

    setRules([...rules, rule]);
    setNewRule({
      name: '',
      description: '',
      query: '',
      dataSource: '',
    });
    setShowAddRule(false);

    toast({
      title: "Rule created",
      description: "Validation rule has been added successfully.",
    });
  };

  const toggleRuleStatus = (id: string) => {
    setRules(rules.map(rule => {
      if (rule.id === id) {
        const newStatus: ValidationRuleStatus = rule.status === 'active' ? 'inactive' : 'active';
        return { ...rule, status: newStatus };
      }
      return rule;
    }));

    toast({
      title: "Rule status updated",
      description: "The validation rule status has been toggled.",
    });
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    
    toast({
      title: "Rule deleted",
      description: "The validation rule has been removed.",
    });
  };

  const getStatusBadge = (status: ValidationRuleStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium">Data Validation Rules</h2>
          <p className="text-muted-foreground">Define rules to validate your data quality</p>
        </div>
        <Button onClick={() => setShowAddRule(true)} disabled={showAddRule}>
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </div>

      {showAddRule && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Validation Rule</CardTitle>
            <CardDescription>
              Define a new rule to validate your data quality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Rule Name *</Label>
                <Input
                  id="rule-name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="E.g., Date Range Check"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-source">Data Source</Label>
                <Input
                  id="data-source"
                  value={newRule.dataSource}
                  onChange={(e) => setNewRule({ ...newRule, dataSource: e.target.value })}
                  placeholder="E.g., Sales Data"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                placeholder="Describe what this rule validates"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="query">SQL Query *</Label>
              <Input
                id="query"
                value={newRule.query}
                onChange={(e) => setNewRule({ ...newRule, query: e.target.value })}
                placeholder="SQL query to find invalid data"
              />
              <p className="text-xs text-muted-foreground">
                Write a query that returns records that violate your validation rule
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowAddRule(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRule}>
              Create Rule
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card key={rule.id} className={rule.status === 'failed' ? 'border-red-200' : ''}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {rule.name}
                    {rule.status === 'failed' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </CardTitle>
                  <CardDescription>{rule.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(rule.status)}
                  <Badge variant="outline">{rule.dataSource}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="bg-muted p-2 rounded text-sm font-mono overflow-x-auto">
                {rule.query}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Last run: {new Date(rule.lastRun).toLocaleString()}
                {rule.status === 'failed' && (
                  <span className="ml-2 text-red-500">
                    Failed records: {rule.failureCount}
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <div className="flex items-center">
                  <Checkbox 
                    id={`active-${rule.id}`}
                    checked={rule.status === 'active'}
                    onCheckedChange={() => toggleRuleStatus(rule.id)}
                  />
                  <Label htmlFor={`active-${rule.id}`} className="ml-2">
                    Active
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DataValidationRules;
