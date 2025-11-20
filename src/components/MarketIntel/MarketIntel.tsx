import React, { useState } from 'react';
import { IntelligenceItem, Filters } from './types';
import { useMarketIntel } from './hooks/useMarketIntel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Bookmark, RefreshCw, Bell, Settings, Plus } from 'lucide-react';
import { mockFilterOptions } from './mockData';
import IntelligenceCard from './components/IntelligenceCard';
import DigestSettingsPanel from './components/DigestSettingsPanel';
import ForwardDialog from './components/ForwardDialog';
import FloatingActionMenu from './components/FloatingActionMenu';
import AIInsightsPanel from './components/AIInsightsPanel';
import SmartSearchBar from './components/SmartSearchBar';

const MarketIntel: React.FC = () => {
  const { 
    filteredItems, 
    savedItems,
    isLoading, 
    error,
    filters,
    digestSettings,
    updateFilters, 
    updateDigestSettings,
    toggleSaveItem,
    forwardItem,
    refreshData
  } = useMarketIntel();
  
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IntelligenceItem | null>(null);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleForwardClick = (id: string) => {
    const item = filteredItems.find(item => item.id === id) || 
               savedItems.find(item => item.id === id);
    
    if (item) {
      setSelectedItem(item);
      setForwardDialogOpen(true);
    }
  };
  
  const highAlertItems = filteredItems.filter(
    item => item.alertLevel === 'high' || item.alertLevel === 'critical'
  );

  const criticalItems = filteredItems.filter(item => item.alertLevel === 'critical');
  const highItems = filteredItems.filter(item => item.alertLevel === 'high');
  
  // Filter items based on search query
  const searchFilteredItems = (items: IntelligenceItem[]) => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query) ||
      item.sourceName.toLowerCase().includes(query) ||
      item.topics.some(topic => topic.toLowerCase().includes(query)) ||
      item.industries.some(industry => industry.toLowerCase().includes(query))
    );
  };
  
  const renderItems = () => {
    const baseItems = activeTab === 'all' ? filteredItems : savedItems;
    const items = searchFilteredItems(baseItems);
    
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="mb-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ));
    }
    
    if (error) {
      return (
        <Card className="mb-6 border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="font-medium">{error}</p>
            </div>
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={refreshData}
                className="executive-btn-secondary"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    if (items.length === 0) {
      return (
        <Card className="mb-6 executive-glass-card">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 mb-4 font-medium">
                {searchQuery ? 'No intelligence items match your search' :
                 activeTab === 'all' 
                  ? 'No intelligence items match your current filters' 
                  : 'No saved intelligence items yet'}
              </p>
              {activeTab === 'all' && !searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => updateFilters({
                    sources: ['business', 'regulatory', 'market', 'social'],
                    industries: [],
                    departments: [],
                    geographies: [],
                    topics: [],
                    alertLevel: ['low', 'medium', 'high', 'critical'],
                    relevanceThreshold: 0
                  })}
                  className="executive-btn-secondary"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    // Smart Grid Layout - Critical items get priority positioning
    const sortedItems = [...items].sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.alertLevel] - priorityOrder[a.alertLevel];
    });
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
        {sortedItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`animate-fadeInUp stagger-${Math.min(index + 1, 4)} ${
              item.alertLevel === 'critical' ? 'xl:col-span-2' : ''
            }`}
          >
            <IntelligenceCard
              item={item}
              onToggleSave={toggleSaveItem}
              onForward={handleForwardClick}
              relatedItems={filteredItems.filter(related => 
                related.id !== item.id && 
                (related.industries.some(ind => item.industries.includes(ind)) ||
                 related.topics.some(topic => item.topics.includes(topic)))
              ).slice(0, 3)}
            />
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 relative overflow-hidden">
      {/* Particle Background */}
      <div className="particle-container">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 25}s`,
              animationDuration: `${25 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Simplified Header */}
        <div className="executive-glass-card border-b border-slate-200/60 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold executive-title bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Market Intelligence
                </h1>
                <p className="executive-subtitle mt-1">
                  Real-time business intelligence across markets, regulations, and industry trends
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="badge-modern">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live Updates
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAIInsights(!showAIInsights)}
                  className={`executive-btn-secondary ${showAIInsights ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  AI Insights
                </Button>
                <DigestSettingsPanel 
                  settings={digestSettings}
                  onUpdateSettings={updateDigestSettings}
                  availableFilters={{
                    sources: mockFilterOptions.sources || ['business', 'regulatory', 'market', 'social'],
                    industries: mockFilterOptions.industries || [],
                    departments: mockFilterOptions.departments || [],
                    geographies: mockFilterOptions.geographies || [],
                    topics: mockFilterOptions.topics || [],
                    alertLevel: ['low', 'medium', 'high', 'critical']
                  }}
                />
              </div>
            </div>

            {/* Smart Search Bar */}
            <SmartSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              suggestions={filteredItems.slice(0, 5)}
            />
          </div>
        </div>

        {/* AI Insights Panel */}
        {showAIInsights && (
          <AIInsightsPanel
            items={filteredItems}
            onClose={() => setShowAIInsights(false)}
          />
        )}

        {/* Critical Alerts Banner */}
        {highAlertItems.length > 0 && (
          <div className="p-6 border-b border-slate-200/60">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criticalItems.length > 0 && (
                <Card className="border-red-300 bg-gradient-to-br from-red-50 to-rose-50 holographic-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center text-red-700">
                      <AlertTriangle className="h-4 w-4 mr-2 animate-pulse" />
                      Critical Alerts ({criticalItems.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {criticalItems.slice(0, 2).map(item => (
                        <div key={item.id} className="p-3 bg-white rounded-lg border border-red-200 shadow-sm">
                          <p className="text-sm font-semibold text-red-800 truncate">{item.title}</p>
                          <p className="text-xs text-red-600 mt-1">{item.sourceName}</p>
                        </div>
                      ))}
                      {criticalItems.length > 2 && (
                        <Button variant="link" size="sm" className="text-xs text-red-600 p-0">
                          +{criticalItems.length - 2} more critical alerts
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {highItems.length > 0 && (
                <Card className="border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 holographic-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center text-amber-700">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      High Priority ({highItems.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {highItems.slice(0, 2).map(item => (
                        <div key={item.id} className="p-3 bg-white rounded-lg border border-amber-200 shadow-sm">
                          <p className="text-sm font-semibold text-amber-800 truncate">{item.title}</p>
                          <p className="text-xs text-amber-600 mt-1">{item.sourceName}</p>
                        </div>
                      ))}
                      {highItems.length > 2 && (
                        <Button variant="link" size="sm" className="text-xs text-amber-600 p-0">
                          +{highItems.length - 2} more high priority alerts
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'saved')}>
              <div className="flex justify-between items-center mb-6">
                <TabsList className="executive-glass-card border border-slate-200/60">
                  <TabsTrigger value="all" className="font-semibold">
                    All Intelligence
                    <Badge variant="secondary" className="ml-2 px-2 py-0">
                      {searchFilteredItems(filteredItems).length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="font-semibold">
                    Saved
                    {savedItems.length > 0 && (
                      <Badge variant="secondary" className="ml-2 px-2 py-0">
                        {searchFilteredItems(savedItems).length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                {renderItems()}
              </TabsContent>
              
              <TabsContent value="saved" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold executive-title flex items-center">
                    <Bookmark className="h-5 w-5 mr-2 text-amber-500" />
                    Saved Intelligence
                  </h2>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                    disabled={isLoading}
                    className="executive-btn-secondary"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                
                {renderItems()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Action Menu with Quick Filters */}
      <FloatingActionMenu 
        onRefresh={refreshData}
        onQuickFilter={(level) => updateFilters({ 
          ...filters,
          alertLevel: [level as 'critical' | 'high'] 
        })}
        isLoading={isLoading}
        filters={filters}
        onFilterChange={updateFilters}
        availableFilters={{
          sources: mockFilterOptions.sources || ['business', 'regulatory', 'market', 'social'],
          industries: mockFilterOptions.industries || [],
          departments: mockFilterOptions.departments || [],
          geographies: mockFilterOptions.geographies || [],
          topics: mockFilterOptions.topics || [],
          alertLevel: ['low', 'medium', 'high', 'critical']
        }}
      />
      
      <ForwardDialog 
        isOpen={forwardDialogOpen}
        onClose={() => setForwardDialogOpen(false)}
        onForward={forwardItem}
        item={selectedItem}
      />
    </div>
  );
};

export default MarketIntel;
