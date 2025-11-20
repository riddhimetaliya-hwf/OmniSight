
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmailInputProps {
  newEmail: string;
  onEmailChange: (email: string) => void;
  onAddEmail: () => void;
  isValidEmail: boolean;
  isExistingEmail: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({
  newEmail,
  onEmailChange,
  onAddEmail,
  isValidEmail,
  isExistingEmail
}) => {
  return (
    <div className="space-y-2">
      <Label>Recipients</Label>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Add email address"
          value={newEmail}
          onChange={(e) => onEmailChange(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={onAddEmail} 
          disabled={!newEmail || !isValidEmail || isExistingEmail}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {!isValidEmail && newEmail && (
        <p className="text-xs text-destructive">Please enter a valid email address</p>
      )}
    </div>
  );
};

export default EmailInput;
