
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useKPIContext } from './context/KPIContext';
import { Department, BusinessUnit, KPITimeframe } from './types';

const CreateKPIModal: React.FC = () => {
  const { isCreatingKPI, setIsCreatingKPI, addKPI } = useKPIContext();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<Department>('sales');
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit>('global');
  const [timeframe, setTimeframe] = useState<KPITimeframe>('monthly');
  const [target, setTarget] = useState('');
  const [actual, setActual] = useState('');
  const [unit, setUnit] = useState('currency');
  const [prefix, setPrefix] = useState('$');
  const [formatDecimals, setFormatDecimals] = useState('0');
  const [previousPeriod, setPreviousPeriod] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date();
    let startDate: Date;
    let endDate: Date;
    
    switch (timeframe) {
      case 'monthly':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'quarterly':
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        endDate = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
        break;
      case 'annual':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
    }
    
    addKPI({
      name,
      description,
      department,
      businessUnit,
      timeframe,
      target: parseFloat(target),
      actual: parseFloat(actual),
      unit: unit as 'currency' | 'percentage',
      prefix: unit === 'currency' ? prefix : undefined,
      formatDecimals: parseInt(formatDecimals),
      previousPeriod: previousPeriod ? parseFloat(previousPeriod) : undefined,
      startDate,
      endDate,
      status: 'on-track', // This will be calculated in addKPI
      trend: 'flat', // This will be calculated in addKPI
    });
    
    resetForm();
    setIsCreatingKPI(false);
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setDepartment('sales');
    setBusinessUnit('global');
    setTimeframe('monthly');
    setTarget('');
    setActual('');
    setUnit('currency');
    setPrefix('$');
    setFormatDecimals('0');
    setPreviousPeriod('');
  };

  return (
    <Dialog open={isCreatingKPI} onOpenChange={setIsCreatingKPI}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New KPI</DialogTitle>
            <DialogDescription>
              Define a new key performance indicator to track against targets.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">KPI Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g., Monthly Revenue"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this KPI"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={(value) => setDepartment(value as Department)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="businessUnit">Business Unit</Label>
                <Select value={businessUnit} onValueChange={(value) => setBusinessUnit(value as BusinessUnit)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      <SelectItem value="latin-america">Latin America</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="timeframe">Time Frame</Label>
                <Select value={timeframe} onValueChange={(value) => setTimeframe(value as KPITimeframe)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit Type</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="currency">Currency</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {unit === 'currency' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="prefix">Currency Symbol</Label>
                  <Input 
                    id="prefix" 
                    value={prefix} 
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="e.g., $"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="formatDecimals">Decimal Places</Label>
                  <Input 
                    id="formatDecimals" 
                    type="number" 
                    min="0" 
                    max="3"
                    value={formatDecimals} 
                    onChange={(e) => setFormatDecimals(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="target">Target Value</Label>
                <Input 
                  id="target" 
                  type="number" 
                  step="0.01"
                  value={target} 
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder={unit === 'percentage' ? 'e.g., 25' : 'e.g., 10000'}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="actual">Current Value</Label>
                <Input 
                  id="actual" 
                  type="number"
                  step="0.01" 
                  value={actual} 
                  onChange={(e) => setActual(e.target.value)}
                  placeholder={unit === 'percentage' ? 'e.g., 22' : 'e.g., 8500'}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="previousPeriod">Previous Period Value (Optional)</Label>
              <Input 
                id="previousPeriod" 
                type="number"
                step="0.01" 
                value={previousPeriod} 
                onChange={(e) => setPreviousPeriod(e.target.value)}
                placeholder="Value from previous period for trend calculation"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreatingKPI(false)}>
              Cancel
            </Button>
            <Button type="submit">Create KPI</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateKPIModal;
