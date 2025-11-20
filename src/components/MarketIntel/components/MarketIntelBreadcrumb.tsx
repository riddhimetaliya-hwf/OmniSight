
import React from 'react';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Home, ChevronRight } from 'lucide-react';
import { Filters } from '../types';

interface MarketIntelBreadcrumbProps {
  filters: Filters;
  activeTab: 'all' | 'saved';
}

export const MarketIntelBreadcrumb: React.FC<MarketIntelBreadcrumbProps> = ({
  filters,
  activeTab
}) => {
  const getFilterDescription = () => {
    const parts = [];
    
    if (filters.sources && filters.sources.length > 0 && filters.sources.length < 4) {
      parts.push(`Sources: ${filters.sources.join(', ')}`);
    }
    
    if (filters.alertLevel && filters.alertLevel.length > 0 && filters.alertLevel.length < 4) {
      parts.push(`Alert: ${filters.alertLevel.join(', ')}`);
    }
    
    if (filters.industries && filters.industries.length > 0) {
      parts.push(`Industries: ${filters.industries.slice(0, 2).join(', ')}${filters.industries.length > 2 ? '...' : ''}`);
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'All Intelligence';
  };

  const hasActiveFilters = () => {
    if (!filters) return false;
    
    const sourceCount = filters.sources ? filters.sources.length : 0;
    const alertCount = filters.alertLevel ? filters.alertLevel.length : 0;
    const industryCount = filters.industries ? filters.industries.length : 0;
    const departmentCount = filters.departments ? filters.departments.length : 0;
    const geoCount = filters.geographies ? filters.geographies.length : 0;
    const topicCount = filters.topics ? filters.topics.length : 0;
    
    return (sourceCount > 0 && sourceCount < 4) ||
           (alertCount > 0 && alertCount < 4) ||
           industryCount > 0 ||
           departmentCount > 0 ||
           geoCount > 0 ||
           topicCount > 0 ||
           (filters.relevanceThreshold && filters.relevanceThreshold > 0);
  };

  return (
    <div className="flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="h-3.5 w-3.5 mr-1" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-3.5 w-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/market-intel" className="hover:text-blue-600 transition-colors">
              Market Intelligence
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-3.5 w-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">
              {activeTab === 'saved' ? 'Saved Items' : getFilterDescription()}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {hasActiveFilters() && (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
          Filtered View
        </Badge>
      )}
    </div>
  );
};

export default MarketIntelBreadcrumb;
