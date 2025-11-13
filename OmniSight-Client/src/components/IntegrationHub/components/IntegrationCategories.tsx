
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MessageSquare, 
  Cloud,
  Star,
  Sparkles,
  Grid3X3
} from 'lucide-react';
import { Category } from '@/services/integrationService';

interface CategoryConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  count: number;
  popular?: boolean;
  recommended?: boolean;
}

interface IntegrationCategoriesProps {
  onCategorySelect: (category: string) => void;
  activeCategory?: string;
  categories?: Category[];
}

// Icon mapping for category icons
const iconMap: Record<string, React.ElementType> = {
  'Grid3X3': Grid3X3,
  'Building2': Building2,
  'TrendingUp': TrendingUp,
  'DollarSign': DollarSign,
  'Users': Users,
  'MessageSquare': MessageSquare,
  'Cloud': Cloud
};

// Convert Category to CategoryConfig
const convertCategoryToConfig = (category: Category): CategoryConfig => {
  const Icon = iconMap[category.icon] || Grid3X3;
  
  return {
    id: category.id,
    name: category.name,
    icon: Icon,
    color: category.color,
    bgColor: category.bgColor,
    count: category.count,
    popular: category.popular,
    recommended: category.recommended
  };
};

export const IntegrationCategories: React.FC<IntegrationCategoriesProps> = ({
  onCategorySelect,
  activeCategory,
  categories: propCategories
}) => {
  // Use provided categories or fallback to default categories
  const categoriesToUse = propCategories?.map(convertCategoryToConfig) || [
    {
      id: 'all',
      name: 'Show All',
      icon: Grid3X3,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      count: 0
    }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {categoriesToUse.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
                isActive ? 'ring-2 ring-blue-500 shadow-md' : ''
              } ${category.id === 'all' && !activeCategory ? 'ring-2 ring-blue-500 shadow-md' : ''}`}
              onClick={() => onCategorySelect(category.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center mx-auto mb-3 relative`}>
                  <Icon className={`h-6 w-6 ${category.color}`} />
                  {category.popular && (
                    <Badge className="absolute -top-2 -right-2 text-xs bg-orange-500">
                      <Star className="h-3 w-3" />
                    </Badge>
                  )}
                  {category.recommended && (
                    <Badge className="absolute -top-2 -right-2 text-xs bg-green-500">
                      <Sparkles className="h-3 w-3" />
                    </Badge>
                  )}
                  {category.id === 'all' && (
                    <Badge className="absolute -top-2 -right-2 text-xs bg-blue-500">
                      <Grid3X3 className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
                <h4 className="font-medium text-sm mb-1">{category.name}</h4>
                <p className="text-xs text-muted-foreground">{category.count} integrations</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationCategories;
