
import React from 'react';
import { ITIssue } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, CheckCircle, Clock, Database, Shield, Ticket, User } from 'lucide-react';

interface IssueCardProps {
  issue: ITIssue;
  onResolve?: (issue: ITIssue) => void;
  onAssign?: (issue: ITIssue) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onResolve, onAssign }) => {
  const getCategoryIcon = () => {
    switch (issue.category) {
      case 'service_desk':
        return <Ticket className="h-4 w-4 text-blue-500" />;
      case 'security':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'infrastructure':
        return <Database className="h-4 w-4 text-purple-500" />;
      case 'itil':
        return <Clock className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = () => {
    switch (issue.severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (issue.status) {
      case 'open':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Open</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Resolved</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-center">
            {getCategoryIcon()}
            <h3 className="font-medium">{issue.title}</h3>
          </div>
          <div className="flex gap-1">
            {getSeverityBadge()}
            {getStatusBadge()}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">{issue.description}</p>
        
        <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
          </div>
          
          {issue.assignedTo && (
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{issue.assignedTo}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-3">
          {issue.status !== 'resolved' && (
            <>
              {!issue.assignedTo && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={() => onAssign?.(issue)}
                >
                  <User className="h-3.5 w-3.5 mr-1" />
                  Assign
                </Button>
              )}
              <Button 
                variant="default" 
                size="sm" 
                className="text-xs h-8"
                onClick={() => onResolve?.(issue)}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                {issue.status === 'open' ? 'Start' : 'Resolve'}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;

