
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Flag, ThumbsUp, Reply, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Annotation {
  id: string;
  elementId: string;
  content: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  replies?: AnnotationReply[];
  reactions?: {
    [key: string]: string[]; // userId[]
  };
  isResolved?: boolean;
}

export interface AnnotationReply {
  id: string;
  content: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}

interface AnnotationSystemProps {
  elementId: string;
  annotations: Annotation[];
  onAddAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
  onReplyToAnnotation: (annotationId: string, reply: Omit<AnnotationReply, 'id' | 'createdAt'>) => void;
  onResolveAnnotation: (annotationId: string) => void;
  onDeleteAnnotation: (annotationId: string) => void;
  onAddReaction: (annotationId: string, reaction: string) => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

const AnnotationSystem: React.FC<AnnotationSystemProps> = ({
  elementId,
  annotations,
  onAddAnnotation,
  onReplyToAnnotation,
  onResolveAnnotation,
  onDeleteAnnotation,
  onAddReaction,
  position = 'right'
}) => {
  const [newAnnotation, setNewAnnotation] = useState('');
  const [replyContent, setReplyContent] = useState<{[key: string]: string}>({});
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const { toast } = useToast();
  
  const filteredAnnotations = annotations.filter(a => a.elementId === elementId);
  
  const handleAddAnnotation = () => {
    if (!newAnnotation.trim()) {
      toast({
        title: "Empty annotation",
        description: "Please enter some content for your annotation.",
        variant: "destructive"
      });
      return;
    }
    
    onAddAnnotation({
      elementId,
      content: newAnnotation,
      createdBy: {
        id: 'current-user', // This would come from authentication
        name: 'Current User', // This would come from authentication
      },
      replies: [],
      reactions: {},
      isResolved: false
    });
    
    setNewAnnotation('');
    toast({
      title: "Annotation added",
      description: "Your annotation has been added successfully."
    });
  };
  
  const handleReply = (annotationId: string) => {
    const reply = replyContent[annotationId];
    if (!reply || !reply.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter some content for your reply.",
        variant: "destructive"
      });
      return;
    }
    
    onReplyToAnnotation(annotationId, {
      content: reply,
      createdBy: {
        id: 'current-user', // This would come from authentication
        name: 'Current User', // This would come from authentication
      }
    });
    
    // Clear the reply field
    setReplyContent(prev => ({...prev, [annotationId]: ''}));
    
    toast({
      title: "Reply added",
      description: "Your reply has been added successfully."
    });
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };
  
  return (
    <div className="annotation-system">
      <Popover open={activeAnnotation === 'new'} onOpenChange={(open) => setActiveAnnotation(open ? 'new' : null)}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setActiveAnnotation('new')}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{filteredAnnotations.length > 0 ? `${filteredAnnotations.length} Comments` : 'Add Comment'}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side={position} className="w-80 p-0" sideOffset={5}>
          <div className="p-4 border-b">
            <h4 className="font-medium mb-2">Add New Comment</h4>
            <Textarea
              value={newAnnotation}
              onChange={(e) => setNewAnnotation(e.target.value)}
              placeholder="What are your thoughts?"
              className="min-h-24 mb-2"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveAnnotation(null)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleAddAnnotation}
              >
                Add Comment
              </Button>
            </div>
          </div>
          
          {filteredAnnotations.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {filteredAnnotations.map((annotation) => (
                <div key={annotation.id} className={`p-4 border-b ${annotation.isResolved ? 'bg-muted/30' : ''}`}>
                  <div className="flex items-start gap-2 mb-2">
                    <Avatar className="h-8 w-8">
                      {annotation.createdBy.avatar && (
                        <AvatarImage src={annotation.createdBy.avatar} alt={annotation.createdBy.name} />
                      )}
                      <AvatarFallback>{annotation.createdBy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{annotation.createdBy.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(annotation.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{annotation.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-10 mb-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => onAddReaction(annotation.id, 'like')}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => onResolveAnnotation(annotation.id)}
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive"
                      onClick={() => onDeleteAnnotation(annotation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Replies */}
                  {annotation.replies && annotation.replies.length > 0 && (
                    <div className="ml-10 mb-3 space-y-3">
                      {annotation.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <Avatar className="h-6 w-6">
                            {reply.createdBy.avatar && (
                              <AvatarImage src={reply.createdBy.avatar} alt={reply.createdBy.name} />
                            )}
                            <AvatarFallback>{reply.createdBy.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium text-sm">{reply.createdBy.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm mt-0.5">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Reply input */}
                  <div className="ml-10 flex gap-2 items-start">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        value={replyContent[annotation.id] || ''}
                        onChange={(e) => setReplyContent({...replyContent, [annotation.id]: e.target.value})}
                        placeholder="Reply to this comment..."
                        className="min-h-8 text-sm"
                      />
                      <div className="flex justify-end mt-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReply(annotation.id)}
                          className="h-6"
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AnnotationSystem;
