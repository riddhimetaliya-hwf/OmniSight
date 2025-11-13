
import React, { useState } from 'react';
import { IntelligenceItem } from '../types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { 
  ExternalLink, 
  Star, 
  Share2, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  Clock,
  Zap,
  TrendingUp,
  Building,
  Globe,
  Users,
  Brain,
  Link,
  Sparkles
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IntelligenceCardProps {
  item: IntelligenceItem;
  onToggleSave: (id: string) => void;
  onForward: (id: string) => void;
  relatedItems?: IntelligenceItem[];
}

export const IntelligenceCard: React.FC<IntelligenceCardProps> = ({
  item,
  onToggleSave,
  onForward,
  relatedItems = []
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  
  const alertConfig = {
    critical: {
      colors: 'border-red-300 bg-gradient-to-br from-red-50 to-rose-50',
      badgeColors: 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-0',
      icon: AlertTriangle,
      pulse: 'animate-pulse'
    },
    high: {
      colors: 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50',
      badgeColors: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0',
      icon: TrendingUp,
      pulse: ''
    },
    medium: {
      colors: 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50',
      badgeColors: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0',
      icon: TrendingUp,
      pulse: ''
    },
    low: {
      colors: 'border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50',
      badgeColors: 'bg-gradient-to-r from-slate-500 to-gray-500 text-white border-0',
      icon: TrendingUp,
      pulse: ''
    }
  };

  const sourceConfig = {
    business: { icon: Building, color: 'text-blue-600', bg: 'bg-blue-100 hover:bg-blue-200' },
    regulatory: { icon: Globe, color: 'text-purple-600', bg: 'bg-purple-100 hover:bg-purple-200' },
    market: { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100 hover:bg-green-200' },
    social: { icon: Users, color: 'text-pink-600', bg: 'bg-pink-100 hover:bg-pink-200' }
  };

  const config = alertConfig[item.alertLevel];
  const sourceInfo = sourceConfig[item.source];
  const SourceIcon = sourceInfo.icon;
  const AlertIcon = config.icon;
  
  const formattedDate = formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true });

  // Generate AI summary (mock)
  const generateAISummary = () => {
    return `AI Analysis: This ${item.alertLevel}-priority intelligence suggests potential impacts on ${item.industries.slice(0, 2).join(' and ')} sectors. Key implications include regulatory compliance requirements and strategic positioning considerations. Recommended action: Monitor developments and assess internal readiness.`;
  };

  return (
    <TooltipProvider>
      {/* Hover Card for Quick Preview */}
      <HoverCard openDelay={500} closeDelay={300}>
        <HoverCardTrigger asChild>
          <Card 
            className={`overflow-hidden transition-all duration-400 cursor-pointer relative group ${
              config.colors
            } ${
              isHovered ? 'holographic-card transform-gpu scale-102' : 'executive-glass-card'
            } ${
              item.alertLevel === 'critical' ? 'ring-2 ring-red-200 ring-opacity-50' : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Priority Indicator Strip */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${
              item.alertLevel === 'critical' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
              item.alertLevel === 'high' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
              item.alertLevel === 'medium' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
              'bg-gradient-to-r from-slate-400 to-gray-400'
            }`} />

            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 space-y-3">
                  {/* Source and Alert Level */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className={`${sourceInfo.bg} border-0 font-semibold text-xs`}>
                      <SourceIcon className={`h-3 w-3 mr-1 ${sourceInfo.color}`} />
                      {item.sourceName}
                    </Badge>
                    
                    {item.alertLevel !== 'low' && (
                      <Badge className={`${config.badgeColors} text-xs font-bold`}>
                        <AlertIcon className={`h-3 w-3 mr-1 ${config.pulse}`} />
                        {item.alertLevel.toUpperCase()}
                      </Badge>
                    )}

                    {item.alertLevel === 'critical' && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        URGENT
                      </Badge>
                    )}

                    {relatedItems.length > 0 && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                        <Link className="h-3 w-3 mr-1" />
                        {relatedItems.length} related
                      </Badge>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h3 className={`font-bold leading-tight transition-all duration-300 ${
                    item.alertLevel === 'critical' ? 'text-lg' : 'text-base'
                  } ${
                    isHovered ? 'text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text' : 'text-slate-800'
                  }`}>
                    {item.title}
                  </h3>
                </div>
                
                {/* Save Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(item.id);
                      }}
                      className={`transition-all duration-300 hover:scale-110 ${
                        item.saved 
                          ? 'text-amber-500 hover:text-amber-600 bg-amber-50' 
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Star className="h-4 w-4" fill={item.saved ? 'currentColor' : 'none'} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{item.saved ? 'Remove from saved' : 'Save item'}</TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            
            <CardContent className="pb-3">
              <div className="space-y-4">
                {/* Summary */}
                <p className="text-slate-700 leading-relaxed text-sm font-medium">
                  {item.summary}
                </p>

                {/* AI Summary */}
                {showAISummary && (
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 animate-fadeInUp">
                    <div className="flex items-center mb-2">
                      <Brain className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                        AI Business Impact Analysis
                      </span>
                    </div>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {generateAISummary()}
                    </p>
                  </div>
                )}
                
                {/* Expanded Content */}
                {expanded && (
                  <div className="space-y-4 animate-fadeInUp">
                    {item.imageUrl && (
                      <div className="relative overflow-hidden rounded-xl">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    )}
                    
                    <div className="prose prose-sm">
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                    
                    {/* Topics */}
                    {item.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.topics.map(topic => (
                          <Badge key={topic} variant="outline" className="bg-slate-50 hover:bg-slate-100 text-xs">
                            #{topic}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Related Items */}
                    {relatedItems.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Link className="h-4 w-4 text-slate-500 mr-2" />
                          <span className="text-sm font-medium text-slate-700">Related Intelligence</span>
                        </div>
                        <div className="space-y-2">
                          {relatedItems.slice(0, 2).map(related => (
                            <div key={related.id} className="p-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                              <p className="text-xs font-medium text-slate-800 line-clamp-1">{related.title}</p>
                              <p className="text-xs text-slate-500 mt-1">{related.sourceName}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Timestamp */}
                <div className="flex items-center text-xs text-slate-500 font-medium">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0 flex justify-between items-center">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs hover:bg-slate-100 transition-all duration-300 hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                >
                  {expanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Read more
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAISummary(!showAISummary);
                  }}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Analysis
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs hover:bg-slate-100 transition-all duration-300 hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        onForward(item.id);
                      }}
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Forward this intelligence</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs hover:bg-slate-100 transition-all duration-300 hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.sourceUrl, '_blank');
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View original source</TooltipContent>
                </Tooltip>
              </div>
            </CardFooter>
          </Card>
        </HoverCardTrigger>

        {/* Quick Preview Hover Card */}
        <HoverCardContent className="w-80 p-4 bg-white/95 backdrop-blur-sm border border-slate-200/60 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className={config.badgeColors}>
                <AlertIcon className="h-3 w-3 mr-1" />
                {item.alertLevel}
              </Badge>
              <Badge variant="outline" className={sourceInfo.bg}>
                <SourceIcon className={`h-3 w-3 mr-1 ${sourceInfo.color}`} />
                {item.sourceName}
              </Badge>
            </div>
            
            <h4 className="font-semibold text-slate-800 leading-tight">{item.title}</h4>
            
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
              {item.content || item.summary}
            </p>
            
            {item.topics.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.topics.slice(0, 3).map(topic => (
                  <Badge key={topic} variant="outline" className="text-xs">
                    #{topic}
                  </Badge>
                ))}
                {item.topics.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.topics.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{formattedDate}</span>
              <span>Relevance: {item.relevanceScore}%</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </TooltipProvider>
  );
};

export default IntelligenceCard;
