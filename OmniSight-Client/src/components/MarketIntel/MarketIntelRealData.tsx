import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Bookmark, RefreshCw, Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMarketIntelData } from '@/hooks/useMarketIntelData';
import MarketIntelCard from './components/MarketIntelCard';
import { useToast } from '@/hooks/use-toast';

const MarketIntelRealData: React.FC = () => {
  const { toast } = useToast();
  const {
    items,
    loading,
    error,
    lastUpdated,
    refreshData,
    filterItems,
    getUniqueCompanies,
    getUniqueNewsTypes
  } = useMarketIntelData();

  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedNewsTypes, setSelectedNewsTypes] = useState<string[]>([]);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Get filter options
  const companies = getUniqueCompanies();
  const newsTypes = getUniqueNewsTypes();

  // Filter items based on search and filters
  const filteredItems = filterItems(searchQuery, {
    companies: selectedCompanies.length > 0 ? selectedCompanies : undefined,
    newsTypes: selectedNewsTypes.length > 0 ? selectedNewsTypes : undefined
  });

  // Get items to display based on active tab
  const displayItems = activeTab === 'all' ? filteredItems : 
    filteredItems.filter(item => savedItems.has(item.id));

  // Pagination logic
  const totalPages = Math.ceil(displayItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = displayItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCompanies, selectedNewsTypes, activeTab]);

  const handleSaveItem = (id: string) => {
    setSavedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        toast({
          title: 'Item Removed',
          description: 'Item removed from saved items',
        });
      } else {
        newSet.add(id);
        toast({
          title: 'Item Saved',
          description: 'Item added to saved items',
        });
      }
      return newSet;
    });
  };

  const handleShareItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      // Copy URL to clipboard
      navigator.clipboard.writeText(item["URL reference"]);
      toast({
        title: 'Link Copied',
        description: 'Article link copied to clipboard',
      });
    }
  };

  const handleRefresh = async () => {
    await refreshData();
    toast({
      title: 'Data Refreshed',
      description: 'Market intelligence data has been refreshed',
    });
  };

  const handleExportData = () => {
    const dataToExport = {
      items: displayItems,
      lastUpdated: lastUpdated,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'market-intelligence-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Data Exported',
      description: 'Market intelligence data has been exported',
    });
  };

  const renderItems = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="font-medium">{error}</p>
            </div>
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (displayItems.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 mb-4 font-medium">
                {searchQuery || selectedCompanies.length > 0 || selectedNewsTypes.length > 0
                  ? 'No items match your current filters'
                  : activeTab === 'all'
                  ? 'No market intelligence items available'
                  : 'No saved items yet'}
              </p>
              {(searchQuery || selectedCompanies.length > 0 || selectedNewsTypes.length > 0) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCompanies([]);
                    setSelectedNewsTypes([]);
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <MarketIntelCard
              key={item.id}
              item={item}
              onSave={handleSaveItem}
              onShare={handleShareItem}
              saved={savedItems.has(item.id)}
            />
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, displayItems.length)} of {displayItems.length} items
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <p className="text-muted-foreground">
              Real-time market insights and competitive intelligence
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search market intelligence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            {companies.slice(0, 5).map((company) => (
              <Badge
                key={company}
                variant={selectedCompanies.includes(company) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCompanies(prev => 
                  prev.includes(company) 
                    ? prev.filter(c => c !== company)
                    : [...prev, company]
                )}
              >
                {company}
              </Badge>
            ))}
            
            {newsTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedNewsTypes.includes(type) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedNewsTypes(prev => 
                  prev.includes(type) 
                    ? prev.filter(t => t !== type)
                    : [...prev, type]
                )}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'saved')}>
        <TabsList>
          <TabsTrigger value="all">
            All Intelligence ({displayItems.length})
          </TabsTrigger>
          <TabsTrigger value="saved">
            Saved ({displayItems.filter(item => savedItems.has(item.id)).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderItems()}
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          {renderItems()}
        </TabsContent>
      </Tabs>

      {/* Last Updated Info */}
      {lastUpdated && (
        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default MarketIntelRealData; 