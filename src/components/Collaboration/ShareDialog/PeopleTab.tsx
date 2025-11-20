
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SharedUser } from './types';

interface PeopleTabProps {
  users: SharedUser[];
  setUsers: React.Dispatch<React.SetStateAction<SharedUser[]>>;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const PeopleTab: React.FC<PeopleTabProps> = ({ users = [], setUsers }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor' | 'admin'>('viewer');
  const { toast } = useToast();

  const teamMembers: TeamMember[] = [
    { id: 'user1', name: 'Alex Johnson', email: 'alex@example.com', avatar: '' },
    { id: 'user2', name: 'Sam Smith', email: 'sam@example.com', avatar: '' },
    { id: 'user3', name: 'Taylor Wilson', email: 'taylor@example.com', avatar: '' },
    { id: 'user4', name: 'Jordan Lee', email: 'jordan@example.com', avatar: '' },
  ];

  const handleAddUser = () => {
    if (!email.trim()) return;
    
    if (users && users.some(u => u.email === email)) {
      toast({
        title: "User already added",
        description: "This user is already on the sharing list.",
        variant: "destructive"
      });
      return;
    }
    
    const newUser: SharedUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role
    };
    
    setUsers(users ? [...users, newUser] : [newUser]);
    setEmail('');
    
    toast({
      title: "User added",
      description: `${email} has been added with ${role} permissions.`
    });
  };

  const handleRemoveUser = (userId: string) => {
    if (!users) return;
    
    setUsers(users.filter(u => u.id !== userId));
    
    toast({
      title: "User removed",
      description: "User removed from sharing list."
    });
  };

  const handleUpdateUserRole = (userId: string, newRole: 'viewer' | 'editor' | 'admin') => {
    if (!users) return;
    
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    
    toast({
      title: "Permission updated",
      description: "User permission level has been updated."
    });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-end gap-2 mb-4">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">
            Add people
          </label>
          <Input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as any)}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Access level</SelectLabel>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleAddUser}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">
          Suggested people
        </label>
        <ScrollArea className="h-24">
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    {member.avatar ? (
                      <AvatarImage src={member.avatar} alt={member.name} />
                    ) : (
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEmail(member.email);
                  }}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {users && users.length > 0 ? (
        <div>
          <label className="text-sm font-medium mb-2 block">
            People with access
          </label>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 rounded-md border">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleUpdateUserRole(user.id, value as any)}
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="text-center p-4 border rounded-md text-muted-foreground">
          No users have been added yet
        </div>
      )}
    </div>
  );
};

export default PeopleTab;
