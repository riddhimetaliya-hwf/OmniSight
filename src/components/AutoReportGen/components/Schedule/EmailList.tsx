
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailListProps {
  emails: string[];
  onRemoveEmail: (email: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({ emails, onRemoveEmail }) => {
  if (emails.length === 0) {
    return (
      <p className="text-sm text-muted-foreground p-2">
        No recipients added yet
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {emails.map((email) => (
        <div 
          key={email} 
          className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
        >
          {email}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 w-5 p-0"
            onClick={() => onRemoveEmail(email)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default EmailList;
