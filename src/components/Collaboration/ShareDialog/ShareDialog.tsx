import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import PeopleTab from './PeopleTab';
import LinkSharingTab from './LinkSharingTab';
import { Copy, X } from 'lucide-react';
import { 
  SharedUser,
  AccessLevel,
  ShareDialogProps
} from './types';

const ShareDialog: React.FC<ShareDialogProps> = ({
  title,
  type,
  id,
  onShare,
  sharedWith = [],
  currentAccessLevel = 'private', 
  uniqueLink = `${window.location.origin}/shared/${type}/${id}`
}) => {
  const [selectedUsers, setSelectedUsers] = useState<SharedUser[]>(sharedWith || []);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(currentAccessLevel);
  const { toast } = useToast();

  const handleShare = () => {
    onShare(selectedUsers, accessLevel);
    toast({
      title: "Sharing preferences updated",
      description: `Your ${type} sharing settings have been updated.`
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(uniqueLink);
    toast({
      title: "Link copied",
      description: "Sharing link copied to clipboard."
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onShare(selectedUsers, accessLevel); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Share {type}</DialogTitle>
          <DialogDescription>
            Share "{title}" with others and set permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Tabs defaultValue="people">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="link">Link Sharing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="people">
              <PeopleTab 
                users={selectedUsers} 
                setUsers={setSelectedUsers} 
              />
            </TabsContent>
            
            <TabsContent value="link">
              <LinkSharingTab
                accessLevel={accessLevel}
                setAccessLevel={setAccessLevel}
                sharingLink={uniqueLink}
                title={title}
                type={type}
              />
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline"
            className="gap-2"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
          <Button onClick={handleShare}>
            Update sharing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
