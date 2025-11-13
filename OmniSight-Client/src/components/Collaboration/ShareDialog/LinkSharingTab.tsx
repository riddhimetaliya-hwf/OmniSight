
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Copy, Mail, Link } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AccessLevel } from './types';

interface LinkSharingTabProps {
  accessLevel: AccessLevel;
  setAccessLevel: React.Dispatch<React.SetStateAction<AccessLevel>>;
  sharingLink: string;
  title: string;
  type: 'dashboard' | 'report' | 'insight';
}

const LinkSharingTab: React.FC<LinkSharingTabProps> = ({ 
  accessLevel, 
  setAccessLevel,
  sharingLink,
  title,
  type
}) => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharingLink);
    toast({
      title: "Link copied",
      description: "Sharing link copied to clipboard."
    });
  };

  return (
    <div className="space-y-4 py-4">
      <div>
        <label className="text-sm font-medium mb-2 block">
          General access
        </label>
        <Select
          value={accessLevel}
          onValueChange={(value) => setAccessLevel(value as AccessLevel)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Private - Only people you invite</SelectItem>
            <SelectItem value="team">Team - Anyone in your team</SelectItem>
            <SelectItem value="organization">Organization - Anyone in your organization</SelectItem>
            <SelectItem value="public">Public - Anyone with the link</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium mb-2 block">
          Sharing link
        </label>
        <div className="flex gap-2">
          <Input
            value={sharingLink}
            readOnly
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => {
            const emailSubject = `Check out this ${type}: ${title}`;
            const emailBody = `I wanted to share this ${type} with you: ${sharingLink}`;
            window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
          }}
        >
          <Mail className="h-4 w-4" />
          Email
        </Button>
      </div>
    </div>
  );
};

export default LinkSharingTab;
