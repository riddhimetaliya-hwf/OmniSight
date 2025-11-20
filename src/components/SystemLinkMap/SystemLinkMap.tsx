import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Panel,
  addEdge,
  Connection,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import SystemNode from './nodes/SystemNode';
import { 
  mockNodes, 
  mockEdges, 
  mockAlerts, 
  mockAIInsights, 
  mockTimelineEvents,
  mockNetworkAnalysis,
  mockDataLineage,
  mockSavedViews,
  mockCollaborationSessions
} from './mockData';
import { 
  SystemNode as SystemNodeType, 
  EdgeType, 
  SystemMapFilter, 
  ViewMode,
  Alert,
  AIInsight,
  TimelineEvent,
  SavedView,
  CollaborationSession,
  UserPreferences,
  Annotation,
  SystemStatus,
  AlertSeverity
} from './types';

// Enhanced components
import EnhancedFilterPanel from './components/EnhancedFilterPanel';
import SystemNodeDetail from './SystemNodeDetail';
import AlertManager from './components/AlertManager';
import AIInsightsPanel from './components/AIInsightsPanel';
import TimelineView from './components/TimelineView';
import GeographicView from './components/GeographicView';
import NetworkAnalysisPanel from './components/NetworkAnalysisPanel';
import DataLineagePanel from './components/DataLineagePanel';
import CollaborationPanel from './components/CollaborationPanel';
import SystemManager from './components/SystemManager';
import ViewModeSelector from './components/ViewModeSelector';
import PerformanceDashboard from './components/PerformanceDashboard';
import ExportPanel from './components/ExportPanel';
import UserPreferencesPanel from './components/UserPreferencesPanel';

// Convert mock data to React Flow format
const initialNodes: Node[] = mockNodes.map(node => ({
  id: node.id,
  type: 'systemNode',
  data: { ...node },
  position: getRandomPosition(),
}));

const initialEdges: Edge[] = mockEdges.map(edge => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  animated: edge.animated,
  label: edge.label,
  data: { type: edge.type, dataPoints: edge.dataPoints, ...edge },
  style: getEdgeStyle(edge.type),
}));

function getRandomPosition() {
  return {
    x: Math.random() * 800,
    y: Math.random() * 600,
  };
}

function getEdgeStyle(type: EdgeType) {
  switch (type) {
    case 'data-flow':
      return { stroke: '#3b82f6', strokeWidth: 2 };
    case 'integration':
      return { stroke: '#10b981', strokeWidth: 2 };
    case 'dependency':
      return { stroke: '#f59e0b', strokeWidth: 2 };
    case 'bidirectional':
      return { stroke: '#8b5cf6', strokeWidth: 2 };
    default:
      return { stroke: '#64748b', strokeWidth: 1 };
  }
}

const SystemLinkMapContent: React.FC = () => {
  // Core state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<SystemNodeType | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  
  // View and display state
  const [viewMode, setViewMode] = useState<ViewMode>('2d');
  const [filters, setFilters] = useState<SystemMapFilter>({
    systems: [],
    departments: [],
    dataFlows: [],
    status: [],
    dateRange: undefined,
    healthScore: undefined,
    tags: [],
    owners: []
  });
  
  // Feature panels state
  const [showAlerts, setShowAlerts] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showGeographic, setShowGeographic] = useState(false);
  const [showNetworkAnalysis, setShowNetworkAnalysis] = useState(false);
  const [showDataLineage, setShowDataLineage] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showSystemManager, setShowSystemManager] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Real-time monitoring state
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>(mockAIInsights);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(mockTimelineEvents);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  
  // Collaboration state
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [collaborationSession, setCollaborationSession] = useState<CollaborationSession | null>(null);
  const [savedViews, setSavedViews] = useState<SavedView[]>(mockSavedViews);
  
  // User preferences
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: 'light',
    defaultView: '2d',
    autoRefresh: true,
    refreshInterval: 30000,
    notifications: {
      alerts: true,
      systemUpdates: true,
      performanceIssues: true
    },
    layout: {
      showMiniMap: true,
      showControls: true,
      showBackground: true
    }
  });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; type: 'node' | 'edge'; label: string }>>([]);
  
  // Inline editing state
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editPosition, setEditPosition] = useState({ x: 0, y: 0 });
  
  const nodeTypes: NodeTypes = {
    systemNode: SystemNode,
  };

  // Real-time monitoring effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate real-time updates
      updateSystemStatuses();
      checkForNewAlerts();
      generateAIInsights();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = [
      ...nodes.map(node => ({
        id: node.id,
        type: 'node' as const,
        label: (node.data as unknown as SystemNodeType).label
      })),
      ...edges.map(edge => ({
        id: edge.id,
        type: 'edge' as const,
        label: String(edge.label || `${edge.source} → ${edge.target}`)
      }))
    ].filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  }, [nodes, edges]);

  // Filter functionality
  const handleFilterChange = useCallback((newFilters: SystemMapFilter) => {
    setFilters(newFilters);
    
    // Apply filters to nodes
    const filteredNodes = initialNodes.filter(node => {
      const systemNode = node.data as unknown as SystemNodeType;
      
      // Filter by system type
      if (newFilters.systems && newFilters.systems.length > 0) {
        if (!newFilters.systems.includes(systemNode.type)) {
          return false;
        }
      }
      
      // Filter by department
      if (newFilters.departments && newFilters.departments.length > 0) {
        if (!systemNode.department || !newFilters.departments.includes(systemNode.department)) {
          return false;
        }
      }
      
      // Filter by status
      if (newFilters.status && newFilters.status.length > 0) {
        if (!systemNode.status || !newFilters.status.includes(systemNode.status)) {
          return false;
        }
      }
      
      // Filter by health score
      if (newFilters.healthScore) {
        if (!systemNode.healthScore || 
            systemNode.healthScore < newFilters.healthScore.min || 
            systemNode.healthScore > newFilters.healthScore.max) {
          return false;
        }
      }
      
      // Filter by tags
      if (newFilters.tags && newFilters.tags.length > 0) {
        if (!systemNode.tags || !newFilters.tags.some(tag => systemNode.tags!.includes(tag))) {
          return false;
        }
      }
      
      // Filter by owners
      if (newFilters.owners && newFilters.owners.length > 0) {
        if (!systemNode.owner || !newFilters.owners.includes(systemNode.owner)) {
          return false;
        }
      }
      
      return true;
    });
    
    // Apply filters to edges
    const filteredEdges = initialEdges.filter(edge => {
      // If node is filtered out, edge should be filtered too
      const sourceExists = filteredNodes.some(node => node.id === edge.source);
      const targetExists = filteredNodes.some(node => node.id === edge.target);
      
      if (!sourceExists || !targetExists) {
        return false;
      }
      
      // Filter by edge type
      if (newFilters.dataFlows && newFilters.dataFlows.length > 0) {
        const edgeType = edge.data?.type as EdgeType;
        if (!newFilters.dataFlows.includes(edgeType)) {
          return false;
        }
      }
      
      return true;
    });
    
    setNodes(filteredNodes);
    setEdges(filteredEdges);
  }, [setNodes, setEdges]);

  // Event handlers
  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    const systemNode = mockNodes.find(n => n.id === node.id);
    setSelectedNode(systemNode || null);
  };

  const handleEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge.id);
  };

  const handleCloseDetail = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  // Inline editing handlers
  const handleNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    const systemNode = node.data as unknown as SystemNodeType;
    setEditingNodeId(node.id);
    setEditValue(systemNode.label);
    setEditPosition({ x: event.clientX, y: event.clientY });
  };

  const handleEdgeDoubleClick = (event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setEditingEdgeId(edge.id);
    setEditValue(String(edge.label || `${edge.source} → ${edge.target}`));
    setEditPosition({ x: event.clientX, y: event.clientY });
  };

  const handleSaveEdit = () => {
    if (editingNodeId) {
      // Update node label
      setNodes(currentNodes => 
        currentNodes.map(node => {
          if (node.id === editingNodeId) {
            const systemNode = node.data as unknown as SystemNodeType;
            return {
              ...node,
              data: { ...systemNode, label: editValue }
            };
          }
          return node;
        })
      );
      
      // Update mock data
      const nodeIndex = mockNodes.findIndex(n => n.id === editingNodeId);
      if (nodeIndex !== -1) {
        mockNodes[nodeIndex].label = editValue;
      }
      
      setEditingNodeId(null);
    } else if (editingEdgeId) {
      // Update edge label
      setEdges(currentEdges => 
        currentEdges.map(edge => {
          if (edge.id === editingEdgeId) {
            return {
              ...edge,
              label: editValue
            };
          }
          return edge;
        })
      );
      
      // Update mock data
      const edgeIndex = mockEdges.findIndex(e => e.id === editingEdgeId);
      if (edgeIndex !== -1) {
        mockEdges[edgeIndex].label = editValue;
      }
      
      setEditingEdgeId(null);
    }
    
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingNodeId(null);
    setEditingEdgeId(null);
    setEditValue('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSaveEdit();
    } else if (event.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleCanvasClick = (event: React.MouseEvent) => {
    // Close editing if clicking outside the editing overlay
    if (editingNodeId || editingEdgeId) {
      const target = event.target as HTMLElement;
      if (!target.closest('.editing-overlay')) {
        handleCancelEdit();
      }
    }
  };

  const handleConnection = useCallback((params: Connection) => {
    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      source: params.source!,
      target: params.target!,
      type: 'data-flow',
      label: 'New Connection',
      data: { type: 'data-flow', dataPoints: [] },
      style: getEdgeStyle('data-flow')
    };
    
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  // Real-time update functions
  const updateSystemStatuses = () => {
    // Simulate status updates
    setNodes(currentNodes => 
      currentNodes.map(node => {
        const systemNode = node.data as unknown as SystemNodeType;
        // Random status changes for demo
        if (Math.random() < 0.1) {
          const newStatus = ['healthy', 'warning', 'error'][Math.floor(Math.random() * 3)] as SystemStatus;
          return {
            ...node,
            data: { ...systemNode, status: newStatus }
          };
        }
        return node;
      })
    );
  };

  const checkForNewAlerts = () => {
    // Simulate new alerts
    if (Math.random() < 0.05) {
      const newAlert: Alert = {
        id: `alert-${Date.now()}`,
        systemId: mockNodes[Math.floor(Math.random() * mockNodes.length)].id,
        title: 'New System Alert',
        description: 'Automatically generated alert for demonstration',
        severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as AlertSeverity,
        timestamp: new Date().toISOString(),
        acknowledged: false,
        resolved: false,
        category: 'performance'
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  const generateAIInsights = () => {
    // Simulate AI insights
    if (Math.random() < 0.03) {
      const newInsight: AIInsight = {
        id: `insight-${Date.now()}`,
        type: ['anomaly', 'optimization', 'prediction'][Math.floor(Math.random() * 3)] as 'anomaly' | 'optimization' | 'prediction',
        title: 'AI Generated Insight',
        description: 'Automatically generated insight for demonstration',
        confidence: Math.random() * 0.3 + 0.7,
        affectedSystems: [mockNodes[Math.floor(Math.random() * mockNodes.length)].id],
        timestamp: new Date().toISOString(),
        actionable: true,
        actions: ['Investigate', 'Monitor', 'Take Action']
      };
      setAIInsights(prev => [newInsight, ...prev]);
    }
  };

  // Save current view
  const saveCurrentView = (name: string, description?: string) => {
    const newView: SavedView = {
      id: `view-${Date.now()}`,
      name,
      description,
      filters,
      layout: {
        nodes: nodes.map(node => ({
          id: node.id,
          position: node.position
        }))
      },
      createdAt: new Date().toISOString(),
      createdBy: 'current-user',
      isPublic: false
    };
    setSavedViews(prev => [...prev, newView]);
  };

  // Load saved view
  const loadSavedView = (view: SavedView) => {
    setFilters(view.filters);
    setNodes(initialNodes.filter(node => 
      view.layout.nodes.some(savedNode => savedNode.id === node.id)
    ));
    setEdges(initialEdges.filter(edge => {
      const sourceExists = view.layout.nodes.some(node => node.id === edge.source);
      const targetExists = view.layout.nodes.some(node => node.id === edge.target);
      return sourceExists && targetExists;
    }));
  };

  // Add new system
  const addNewSystem = (systemData: Partial<SystemNodeType>) => {
    const newNode: SystemNodeType = {
      id: `system-${Date.now()}`,
      type: 'custom',
      label: systemData.label || 'New System',
      department: systemData.department,
      description: systemData.description,
      status: 'healthy',
      healthScore: 100,
      lastUpdated: new Date().toISOString(),
      owner: 'Current User',
      tags: systemData.tags || [],
      version: 'v1.0.0',
      metrics: systemData.metrics || [],
      ...systemData
    } as SystemNodeType;

    const flowNode: Node = {
      id: newNode.id,
      type: 'systemNode',
      data: newNode as unknown as Record<string, unknown>,
      position: getRandomPosition(),
    };

    setNodes(prev => [...prev, flowNode]);
    // Add to mock data for persistence
    mockNodes.push(newNode);
  };

  // Add new data flow
  const addNewDataFlow = (sourceId: string, targetId: string, flowData: Record<string, unknown>) => {
    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      source: sourceId,
      target: targetId,
      type: (flowData.type as EdgeType) || 'data-flow',
      label: (flowData.label as string) || 'New Data Flow',
      animated: (flowData.animated as boolean) || false,
      data: { 
        type: (flowData.type as EdgeType) || 'data-flow', 
        dataPoints: (flowData.dataPoints as string[]) || [],
        volume: flowData.volume,
        frequency: flowData.frequency,
        health: 100,
        lastSync: new Date().toISOString(),
        performance: {
          latency: 0,
          throughput: 0,
          errorRate: 0,
          lastSyncStatus: 'success'
        }
      },
      style: getEdgeStyle((flowData.type as EdgeType) || 'data-flow')
    };

    setEdges(prev => [...prev, newEdge]);
    // Add to mock data for persistence
    mockEdges.push(newEdge.data as unknown as typeof mockEdges[0]);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      systems: [],
      departments: [],
      dataFlows: [],
      status: [],
      dateRange: undefined,
      healthScore: undefined,
      tags: [],
      owners: []
    });
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  // Render different view modes
  const renderViewMode = () => {
    switch (viewMode) {
      case 'timeline':
        return (
          <TimelineView 
            events={timelineEvents}
            systems={mockNodes}
            onEventClick={(event) => console.log('Timeline event clicked:', event)}
          />
        );
      case 'geographic':
        return (
          <GeographicView 
            systems={mockNodes}
            onSystemClick={(system) => setSelectedNode(system)}
          />
        );
      default:
        return (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnection}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
            onEdgeDoubleClick={handleEdgeDoubleClick}
            onPaneClick={handleCanvasClick}
            fitView
            connectOnClick
            deleteKeyCode="Delete"
          >
            {userPreferences.layout.showControls && <Controls />}
            {userPreferences.layout.showBackground && (
              <Background color="#f8fafc" gap={16} />
            )}
            {userPreferences.layout.showMiniMap && (
              <MiniMap 
                nodeColor={(node) => {
                  const type = (node.data as unknown as SystemNodeType).type;
                  switch (type) {
                    case 'erp': return '#3b82f6';
                    case 'crm': return '#10b981';
                    case 'hr': return '#8b5cf6';
                    case 'marketing': return '#f97316';
                    case 'finance': return '#eab308';
                    case 'operations': return '#ec4899';
                    default: return '#64748b';
                  }
                }}
                maskColor="rgba(240, 240, 240, 0.6)"
              />
            )}
          </ReactFlow>
        );
    }
  };

  return (
    <div className="w-full h-screen bg-background flex flex-col">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">System Link Map</h1>
          <ViewModeSelector 
            currentMode={viewMode} 
            onModeChange={setViewMode} 
          />
          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            💡 Double-click to edit names
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search systems..."
            className="px-3 py-1.5 text-sm border rounded-md w-48"
          />
          
          <button
            onClick={() => setShowSystemManager(true)}
            className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add System
          </button>
          
          {/*<button
            onClick={() => setShowPreferences(true)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            ⚙️
          </button>*/}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Filters and panels */}
        <div className="w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-y-auto">
          <div className="p-4 space-y-4">
            <EnhancedFilterPanel 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onReset={resetFilters}
            />
            
            <div className="space-y-2">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Alerts</span>
                  <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    {alerts.filter(a => !a.acknowledged).length}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setShowAIInsights(!showAIInsights)}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">AI Insights</span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {aiInsights.length}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setShowPerformance(!showPerformance)}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent"
              >
                <span className="font-medium">Performance Dashboard</span>
              </button>
              
              <button
                onClick={() => setShowNetworkAnalysis(!showNetworkAnalysis)}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent"
              >
                <span className="font-medium">Network Analysis</span>
              </button>
              
              <button
                onClick={() => setShowDataLineage(!showDataLineage)}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent"
              >
                <span className="font-medium">Data Lineage</span>
              </button>
              
              <button
                onClick={() => setShowCollaboration(!showCollaboration)}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent"
              >
                <span className="font-medium">Collaboration</span>
              </button>
              
              <button
                onClick={() => setShowExport(!showExport)}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent"
              >
                <span className="font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main map area */}
        <div className="flex-1 relative">
          {renderViewMode()}
          
          {/* Inline editing overlay */}
          {(editingNodeId || editingEdgeId) && (
            <div 
              className="absolute z-50 bg-background border rounded-lg shadow-lg p-2 editing-overlay"
              style={{
                left: editPosition.x,
                top: editPosition.y,
                transform: 'translate(-50%, -100%)',
                marginTop: '-10px'
              }}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                  placeholder={editingNodeId ? "System name..." : "Data flow label..."}
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Press Enter to save, Esc to cancel
              </div>
            </div>
          )}
          
          {/* Floating action buttons */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button
              onClick={() => {
                // Simple fit view without useReactFlow
                const reactFlowInstance = document.querySelector('.react-flow') as HTMLElement & { fitView?: () => void };
                if (reactFlowInstance?.fitView) {
                  reactFlowInstance.fitView();
                }
              }}
              className="p-2 bg-background border rounded-lg shadow-sm hover:bg-accent"
              title="Fit to view"
            >
              🔍
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 border rounded-lg shadow-sm ${
                autoRefresh ? 'bg-green-100 text-green-800' : 'bg-background hover:bg-accent'
              }`}
              title={autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
            >
              🔄
            </button>
          </div>
        </div>

        {/* Right sidebar - Details and panels */}
        <div className="w-80 border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-y-auto">
          <div className="p-4 space-y-4">
            {showAlerts && (
              <AlertManager 
                alerts={alerts}
                onAcknowledge={(alertId) => {
                  setAlerts(prev => prev.map(a => 
                    a.id === alertId ? { ...a, acknowledged: true } : a
                  ));
                }}
                onResolve={(alertId) => {
                  setAlerts(prev => prev.map(a => 
                    a.id === alertId ? { ...a, resolved: true } : a
                  ));
                }}
              />
            )}
            
            {showAIInsights && (
              <AIInsightsPanel 
                insights={aiInsights}
                onAction={(insightId, action) => {
                  console.log('AI Insight action:', insightId, action);
                }}
              />
            )}
            
            {showPerformance && (
              <PerformanceDashboard 
                systems={mockNodes}
                edges={mockEdges}
              />
            )}
            
            {showNetworkAnalysis && (
              <NetworkAnalysisPanel 
                analysis={mockNetworkAnalysis}
                systems={mockNodes}
              />
            )}
            
            {showDataLineage && (
              <DataLineagePanel 
                lineage={mockDataLineage}
                systems={mockNodes}
              />
            )}
            
            {showCollaboration && (
              <CollaborationPanel 
                session={collaborationSession}
                annotations={annotations}
                savedViews={savedViews}
                onSaveView={saveCurrentView}
                onLoadView={loadSavedView}
                onAddAnnotation={(annotation) => {
                  setAnnotations(prev => [...prev, annotation]);
                }}
              />
            )}
            
            {showExport && (
              <ExportPanel 
                nodes={nodes}
                edges={edges}
                filters={filters}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals and overlays */}
      {selectedNode && (
        <SystemNodeDetail
          node={selectedNode}
          onClose={handleCloseDetail}
        />
      )}
      
      {showSystemManager && (
        <SystemManager 
          onClose={() => setShowSystemManager(false)}
          onAddSystem={addNewSystem}
          onAddDataFlow={addNewDataFlow}
          existingSystems={mockNodes}
          existingEdges={mockEdges}
        />
      )}
      
      {showPreferences && (
        <UserPreferencesPanel 
          preferences={userPreferences}
          onPreferencesChange={setUserPreferences}
          onClose={() => setShowPreferences(false)}
        />
      )}
    </div>
  );
};

const SystemLinkMap: React.FC = () => {
  return (
    <ReactFlowProvider>
      <SystemLinkMapContent />
    </ReactFlowProvider>
  );
};

export default SystemLinkMap;
