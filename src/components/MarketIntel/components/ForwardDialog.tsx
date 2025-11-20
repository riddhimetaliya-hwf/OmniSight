
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, Plus, Users } from 'lucide-react';
import { IntelligenceItem } from '../types';
import { useToast } from '@/components/ui/use-toast';

interface ForwardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onForward: (id: string, emails: string[]) => void;
  item: IntelligenceItem | null;
}

export const ForwardDialog: React.FC<ForwardDialogProps> = ({
  isOpen,
  onClose,
  onForward,
  item
}) => {
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const { toast } = useToast();
  
  const handleAddEmail = () => {
    if (!email) return;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    if (emails.includes(email)) {
      toast({
        title: "Email already added",
        description: "This email is already in the list",
        variant: "destructive"
      });
      return;
    }
    
    setEmails([...emails, email]);
    setEmail('');
  };
  
  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };
  
  const handleSubmit = () => {
    if (!item) return;
    
    if (emails.length === 0) {
      toast({
        title: "No recipients",
        description: "Please add at least one email recipient",
        variant: "destructive"
      });
      return;
    }
    
    onForward(item.id, emails);
    
    toast({
      title: "Intelligence forwarded",
      description: `The item has been forwarded to ${emails.length} recipient${emails.length > 1 ? 's' : ''}`,
    });
    
    setEmails([]);
    setNote('');
    onClose();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forward Intelligence</DialogTitle>
          <DialogDescription>
            Share this intelligence item with your team members or stakeholders
          </DialogDescription>
        </DialogHeader>
        
        {item && (
          <div className="py-4">
            <div className="mb-4 p-3 bg-muted/40 rounded-md">
              <div className="text-sm font-medium mb-1">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.summary}</div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddEmail}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {emails.map(email => (
                    <Badge key={email} variant="secondary" className="px-2 py-1 text-xs">
                      {email}
                      <button 
                        className="ml-1 p-0.5"
                        onClick={() => handleRemoveEmail(email)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {emails.length === 0 && (
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      Add recipients to forward this intelligence
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a note (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={emails.length === 0}>
            <Send className="h-4 w-4 mr-2" />
            Forward
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForwardDialog;
