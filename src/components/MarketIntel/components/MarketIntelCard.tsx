import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Bookmark, Share2, Clock, Building2, User } from 'lucide-react';
import { MarketIntelItem } from '@/services/marketIntelService';

interface MarketIntelCardProps {
  item: MarketIntelItem;
  onSave?: (id: string) => void;
  onShare?: (id: string) => void;
  saved?: boolean;
}

const MarketIntelCard: React.FC<MarketIntelCardProps> = ({
  item,
  onSave,
  onShare,
  saved = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getAlertLevel = (item: MarketIntelItem) => {
    const title = item["Headline Title"].toLowerCase();
    const description = item["Description Story"].toLowerCase();
    const businessImpact = item["Bussiness Impact"].toLowerCase();
    
    // Check for critical keywords
    if (title.includes('critical') || title.includes('urgent') || 
        description.includes('critical') || businessImpact.includes('critical')) {
      return 'critical';
    }
    
    // Check for high impact keywords
    if (title.includes('breakout') || title.includes('surge') || title.includes('jump') ||
        title.includes('record') || title.includes('high') || 
        description.includes('significant') || description.includes('major')) {
      return 'high';
    }
    
    // Check for medium impact
    if (title.includes('update') || title.includes('announce') || 
        description.includes('announce') || description.includes('launch')) {
      return 'medium';
    }
    
    return 'low';
  };

  const alertLevel = getAlertLevel(item);
  
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-xs font-medium ${getAlertColor(alertLevel)}`}>
                {alertLevel.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {item["Type Of News"]}
              </Badge>
            </div>
            
            <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">
              {item["Headline Title"]}
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onSave && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSave(item.id)}
                className="h-8 w-8 p-0"
              >
                <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
              </Button>
            )}
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(item.id)}
                className="h-8 w-8 p-0"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span>{item.Company}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{item["By Whom"]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(item["Date&Time"])}</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncateText(item["Description Story"], 200)}
          </p>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Business Impact</h4>
            <p className="text-sm text-blue-800 line-clamp-2">
              {truncateText(item["Bussiness Impact"], 150)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {item.Tags.split(',').slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(item["URL reference"], '_blank')}
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Read More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketIntelCard; 