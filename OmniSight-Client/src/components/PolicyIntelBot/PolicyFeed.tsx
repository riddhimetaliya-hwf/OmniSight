
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { List, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { PolicyUpdate } from './types';

interface PolicyFeedProps {
  policies: PolicyUpdate[];
  selectedPolicy: PolicyUpdate | null;
  onPolicyClick: (policy: PolicyUpdate) => void;
}

const PolicyFeed: React.FC<PolicyFeedProps> = ({ 
  policies, 
  selectedPolicy,
  onPolicyClick
}) => {
  if (policies.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium mb-1">No policies found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center">
          <List className="mr-2 h-4 w-4" />
          Policy Updates
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="space-y-px">
            {policies.map(policy => (
              <div
                key={policy.id}
                className={`p-3 border-b last:border-0 hover:bg-muted cursor-pointer ${
                  selectedPolicy?.id === policy.id ? 'bg-muted' : ''
                }`}
                onClick={() => onPolicyClick(policy)}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${!policy.viewed ? 'text-primary' : ''}`}>
                      {policy.title}
                    </h4>
                  </div>
                  
                  {!policy.viewed && (
                    <Badge variant="default" className="ml-1 h-5 px-1">New</Badge>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {policy.summary}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Badge 
                      className={
                        policy.priority === 'critical' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                        policy.priority === 'high' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                        policy.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        'bg-green-100 text-green-800 hover:bg-green-100'
                      }
                    >
                      {policy.priority}
                    </Badge>
                    
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(policy.datePublished, { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="space-x-1">
                    {policy.categories.map(category => (
                      <Badge key={category} variant="outline" className="text-[10px] py-0 h-4">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PolicyFeed;
