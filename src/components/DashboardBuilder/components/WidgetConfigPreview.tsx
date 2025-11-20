
import React, { useState } from "react";
import { Widget, WidgetType, WidgetCategory, WidgetSize } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import DashboardWidget from "../DashboardWidget";
import { Textarea } from "@/components/ui/textarea";

interface WidgetConfigPreviewProps {
  widget: Widget;
  onSave: (widget: Widget) => void;
  onCancel: () => void;
}

const WidgetConfigPreview: React.FC<WidgetConfigPreviewProps> = ({
  widget,
  onSave,
  onCancel
}) => {
  const [editedWidget, setEditedWidget] = useState<Widget>({
    ...widget,
    category: widget.category || 'uncategorized' as WidgetCategory
  });
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    onSave(editedWidget);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedWidget(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedWidget(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  const handleTypeChange = (value: string) => {
    setEditedWidget(prev => ({
      ...prev,
      type: value as WidgetType
    }));
  };

  const handleCategoryChange = (value: string) => {
    setEditedWidget(prev => ({
      ...prev,
      category: value as WidgetCategory
    }));
  };

  const handleSizeChange = (value: string) => {
    setEditedWidget(prev => ({
      ...prev,
      size: value as WidgetSize
    }));
  };

  const handleHeightChange = (value: number[]) => {
    setEditedWidget(prev => ({
      ...prev,
      config: {
        ...prev.config,
        height: value[0]
      }
    }));
  };

  const handleToggleDataQuality = (checked: boolean) => {
    setEditedWidget(prev => ({
      ...prev,
      config: {
        ...prev.config,
        showDataQuality: checked
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Widget Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
              <TabsTrigger value="display" className="flex-1">Display</TabsTrigger>
              <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="widget-title">Title</Label>
                <Input 
                  id="widget-title" 
                  value={editedWidget.title} 
                  onChange={handleTitleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="widget-description">Description</Label>
                <Textarea 
                  id="widget-description" 
                  value={editedWidget.description || ''} 
                  onChange={handleDescriptionChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="widget-type">Widget Type</Label>
                <Select 
                  value={editedWidget.type} 
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger id="widget-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lineChart">Line Chart</SelectItem>
                    <SelectItem value="barChart">Bar Chart</SelectItem>
                    <SelectItem value="pieChart">Pie Chart</SelectItem>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="kpi">KPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="widget-category">Category</Label>
                <Select 
                  value={editedWidget.category || 'uncategorized'} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="widget-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="uncategorized">Uncategorized</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="display" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="widget-size">Size</Label>
                <Select 
                  value={editedWidget.size || 'medium'} 
                  onValueChange={handleSizeChange}
                >
                  <SelectTrigger id="widget-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label htmlFor="widget-height">Height (pixels)</Label>
                  <span className="text-sm text-muted-foreground">
                    {editedWidget.config?.height || 300}px
                  </span>
                </div>
                <Slider 
                  id="widget-height"
                  defaultValue={[editedWidget.config?.height || 300]} 
                  max={600}
                  min={100}
                  step={10}
                  onValueChange={handleHeightChange}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-data-quality" 
                  checked={editedWidget.config?.showDataQuality || false}
                  onCheckedChange={handleToggleDataQuality}
                />
                <Label htmlFor="show-data-quality">Show data quality indicator</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Advanced settings will be available in a future update.
              </p>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <Card className="bg-muted/20 border-2 border-dashed overflow-hidden">
            <DashboardWidget
              widget={editedWidget}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggleFavorite={() => {}}
              onExplainMetric={() => {}}
              preview
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WidgetConfigPreview;
