
import React, { useState, useRef, useEffect } from 'react';
import { IntelligenceItem } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  X, 
  Clock, 
  Sparkles, 
  TrendingUp,
  Building,
  MapPin,
  Tag
} from 'lucide-react';

interface SmartSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  suggestions: IntelligenceItem[];
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  suggestions
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches] = useState([
    'regulatory changes',
    'market volatility',
    'competitive analysis',
    'industry trends'
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleFocus = () => {
    setIsExpanded(true);
    setShowSuggestions(true);
  };
  
  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    setShowSuggestions(value.length > 0 || true);
  };
  
  const clearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };
  
  const selectSuggestion = (suggestion: string) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
    setIsExpanded(false);
  };
  
  const getSmartSuggestions = () => {
    if (!searchQuery.trim()) {
      return {
        recent: recentSearches,
        trending: ['ESG compliance', 'AI regulation', 'supply chain'],
        suggestions: []
      };
    }
    
    const query = searchQuery.toLowerCase();
    const matchingSuggestions = suggestions.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.topics.some(topic => topic.toLowerCase().includes(query))
    );
    
    return {
      recent: recentSearches.filter(search => search.toLowerCase().includes(query)),
      trending: ['ESG compliance', 'AI regulation', 'supply chain'].filter(trend => 
        trend.toLowerCase().includes(query)
      ),
      suggestions: matchingSuggestions.slice(0, 3)
    };
  };
  
  const smartSuggestions = getSmartSuggestions();

  return (
    <div ref={searchContainerRef} className="relative">
      <div className={`relative transition-all duration-300 ${
        isExpanded ? 'transform scale-105' : ''
      }`}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={handleFocus}
            placeholder="Search intelligence... (try 'regulatory changes' or 'AI trends')"
            className={`pl-11 pr-10 py-3 text-sm executive-glass-card border-slate-200/60 focus:border-blue-300 focus:ring-blue-100 transition-all duration-300 ${
              isExpanded ? 'shadow-lg' : ''
            }`}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {/* AI Search Enhancement Indicator */}
        {searchQuery && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* Smart Suggestions Dropdown */}
      {showSuggestions && (isExpanded || searchQuery) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 executive-glass-card border-slate-200/60 shadow-xl animate-fadeInUp">
          <CardContent className="p-4 space-y-4">
            {/* Recent Searches */}
            {smartSuggestions.recent.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Clock className="h-3 w-3 text-slate-400 mr-2" />
                  <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                    Recent Searches
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {smartSuggestions.recent.map((search, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-50 text-xs"
                      onClick={() => selectSuggestion(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Trending Topics */}
            {smartSuggestions.trending.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-2" />
                  <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                    Trending Topics
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {smartSuggestions.trending.map((trend, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-green-50 border-green-200 text-green-700 text-xs"
                      onClick={() => selectSuggestion(trend)}
                    >
                      <TrendingUp className="h-2 w-2 mr-1" />
                      {trend}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Matching Intelligence Items */}
            {smartSuggestions.suggestions.length > 0 && searchQuery && (
              <div>
                <div className="flex items-center mb-2">
                  <Sparkles className="h-3 w-3 text-blue-500 mr-2" />
                  <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                    Related Intelligence
                  </span>
                </div>
                <div className="space-y-2">
                  {smartSuggestions.suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => selectSuggestion(item.title)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {item.summary}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center text-xs text-slate-400">
                              <Building className="h-3 w-3 mr-1" />
                              {item.sourceName}
                            </div>
                            {item.industries.length > 0 && (
                              <div className="flex items-center text-xs text-slate-400">
                                <Tag className="h-3 w-3 mr-1" />
                                {item.industries[0]}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`ml-2 text-xs ${
                            item.alertLevel === 'critical' ? 'border-red-200 text-red-700' :
                            item.alertLevel === 'high' ? 'border-amber-200 text-amber-700' :
                            'border-slate-200 text-slate-600'
                          }`}
                        >
                          {item.alertLevel}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* No Results */}
            {searchQuery && 
             smartSuggestions.recent.length === 0 && 
             smartSuggestions.trending.length === 0 && 
             smartSuggestions.suggestions.length === 0 && (
              <div className="text-center py-4">
                <div className="text-sm text-slate-500">
                  No suggestions found for "{searchQuery}"
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Try searching for industries, topics, or keywords
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartSearchBar;
