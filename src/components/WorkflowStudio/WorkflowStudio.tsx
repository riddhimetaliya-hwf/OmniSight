import React, { useState, useCallback } from 'react';
import { WorkflowProvider } from './context/WorkflowContext';
import { WorkflowHeader } from './components/WorkflowHeader';
import WorkflowCanvas from './components/WorkflowCanvas';
import { WorkflowSidebar } from './components/WorkflowSidebar';
import { NodeConfigPanel } from './components/NodeConfigPanel';
import { WorkflowActions } from './components/WorkflowActions';
import { WelcomeCard } from './components/WelcomeCard';
import { TourButton } from '@/components/OmniGuide';
import { useTour } from './hooks/useTour';
import { useWorkflowSimulation } from './hooks/useWorkflowSimulation';
import { ReactFlowProvider } from '@xyflow/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Save, FileCode, Play, Plus, LayoutTemplate, Download, Upload, Settings, CheckCircle2 } from 'lucide-react';

const WorkflowStudio: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('canvas');
  const { toast } = useToast();

  // Use the tour hook
  const { startTour, isTourActive } = useTour();
  
  // Use the simulation hook
  const { 
    simulating, 
    simulationProgress, 
    simulationPaused,
    handleStartSimulation,
    handlePauseSimulation,
    stopSimulation
  } = useWorkflowSimulation();

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNode(nodeId);
    setConfigPanelOpen(!!nodeId);
  }, []);

  const handleSaveWorkflow = useCallback(() => {
    toast({
      title: "Workflow saved",
      description: "Workflow has been saved successfully"
    });
    setShowSuccessDialog(true);
  }, [toast]);

  const handleNewWorkflow = useCallback(() => {
    if (simulating) {
      stopSimulation();
    }
    
    toast({
      title: "New workflow created",
      description: "Starting with a clean canvas"
    });
    
    // Reset workflow state
  }, [simulating, stopSimulation, toast]);
  
  const handleAddNode = useCallback(() => {
    toast({
      title: "Node added",
      description: "New node added to canvas"
    });
  }, [toast]);
  
  const handleRefresh = useCallback(() => {
    toast({
      title: "Canvas refreshed",
      description: "Workflow layout optimized"
    });
  }, [toast]);

  return (
    <DndProvider backend={HTML5Backend}>
      <ReactFlowProvider>
        <WorkflowProvider>
          <div className="flex flex-col h-full border rounded-md overflow-hidden bg-card">
            <WorkflowHeader 
              onNewWorkflow={handleNewWorkflow}
              onSaveWorkflow={handleSaveWorkflow}
              extraActions={
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1" 
                    onClick={() => setShowTemplatesDialog(true)}>
                    <LayoutTemplate className="h-4 w-4" />
                    <span className="hidden md:inline">Templates</span>
                  </Button>
                  <TourButton 
                    tourId="workflow-tour"
                    onStartTour={startTour}
                  />
                </>
              }
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b px-4">
                <TabsList className="h-10">
                  <TabsTrigger value="canvas" className="data-[state=active]:bg-background">Canvas</TabsTrigger>
                  <TabsTrigger value="code" className="data-[state=active]:bg-background">Code View</TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-background">Settings</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="canvas" className="flex-1 flex overflow-hidden p-0 m-0 data-[state=active]:flex">
                <WorkflowSidebar 
                  width={sidebarWidth}
                  onWidthChange={setSidebarWidth}
                  className="workflow-sidebar bg-background"
                />
                
                <div className="flex-1 relative workflow-canvas overflow-hidden flex flex-col">
                  <WorkflowActions
                    simulating={simulating}
                    simulationPaused={simulationPaused}
                    simulationProgress={simulationProgress}
                    onStartSimulation={handleStartSimulation}
                    onPauseSimulation={handlePauseSimulation}
                    onStopSimulation={stopSimulation}
                    onSaveWorkflow={handleSaveWorkflow}
                    onRefresh={handleRefresh}
                    onAddNode={handleAddNode}
                  />
                  
                  <div className="flex-1">
                    <WorkflowCanvas 
                      isReadOnly={false}
                    />
                  </div>
                  
                  {!selectedNode && !simulating && !isTourActive && (
                    <WelcomeCard 
                      onStartTour={startTour}
                      onNewWorkflow={handleNewWorkflow}
                    />
                  )}
                </div>
                
                {configPanelOpen && selectedNode && (
                  <NodeConfigPanel 
                    nodeId={selectedNode} 
                    onClose={() => {
                      setConfigPanelOpen(false);
                      setSelectedNode(null);
                    }}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="code" className="flex-1 overflow-auto p-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCode className="h-5 w-5" />
                      Workflow Definition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-md overflow-auto text-sm h-[500px]">
                      {`// Example workflow definition code
{
  "nodes": [
    {
      "id": "node-1",
      "type": "trigger",
      "position": { "x": 250, "y": 100 },
      "data": { "label": "Email Received" }
    },
    {
      "id": "node-2",
      "type": "condition",
      "position": { "x": 250, "y": 200 },
      "data": { "label": "Filter" }
    },
    {
      "id": "node-3",
      "type": "action",
      "position": { "x": 250, "y": 300 },
      "data": { "label": "Send Notification" }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "node-1",
      "target": "node-2"
    },
    {
      "id": "e2-3",
      "source": "node-2",
      "target": "node-3"
    }
  ]
}`}
                    </pre>
                    <div className="flex justify-end mt-4 gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export JSON
                      </Button>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import JSON
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="flex-1 overflow-auto p-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Workflow Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Execution Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm">Error Handling</label>
                          <select className="w-full border rounded px-3 py-2 text-sm">
                            <option>Stop on error</option>
                            <option>Continue on error</option>
                            <option>Retry (3x)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm">Execution Mode</label>
                          <select className="w-full border rounded px-3 py-2 text-sm">
                            <option>Sequential</option>
                            <option>Parallel where possible</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Notification Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm">Success Notification</label>
                          <select className="w-full border rounded px-3 py-2 text-sm">
                            <option>Email</option>
                            <option>None</option>
                            <option>Slack</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm">Error Notification</label>
                          <select className="w-full border rounded px-3 py-2 text-sm">
                            <option>Email</option>
                            <option>None</option>
                            <option>Slack</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button>Save Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Workflow Saved Successfully
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Your workflow has been saved and can now be accessed from the workflow dashboard.
                  Would you like to continue editing or go to the workflow list?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                <AlertDialogAction>Go to Workflows</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
            <AlertDialogContent className="max-w-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Workflow Templates</AlertDialogTitle>
                <AlertDialogDescription>
                  Choose a pre-built workflow template to start with
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                {[
                  { name: "Approval Process", desc: "Multi-step approval workflow with notifications" },
                  { name: "Data ETL", desc: "Extract, transform and load data workflow" },
                  { name: "Onboarding", desc: "Employee or customer onboarding process" },
                  { name: "Service Desk", desc: "IT service desk ticket flow" },
                  { name: "Document Review", desc: "Document review and approval workflow" },
                  { name: "Empty Workflow", desc: "Start with a blank canvas" }
                ].map((template, i) => (
                  <Card key={i} className="hover:bg-accent/50 cursor-pointer transition-colors">
                    <CardContent className="p-4">
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </WorkflowProvider>
      </ReactFlowProvider>
    </DndProvider>
  );
};

export default WorkflowStudio;
