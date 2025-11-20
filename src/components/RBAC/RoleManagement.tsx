
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Search,
  PlusCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  InfoIcon,
  EyeIcon
} from "lucide-react";
import { roles, permissions } from "@/mock/rbacData";

export const RoleManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getRoleIcon = (type: string) => {
    switch (type) {
      case "admin":
        return <ShieldCheck className="h-5 w-5 text-red-500" />;
      case "executive":
        return <ShieldCheck className="h-5 w-5 text-purple-500" />;
      case "department_head":
        return <ShieldAlert className="h-5 w-5 text-blue-500" />;
      case "analyst":
        return <ShieldQuestion className="h-5 w-5 text-green-500" />;
      case "viewer":
        return <EyeIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <Users className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search roles..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={() => setIsAddRoleDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map(role => (
          <Card key={role.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getRoleIcon(role.type)}
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Role
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 mb-3">
                {role.permissions.length} permissions assigned
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(groupedPermissions).map(module => {
                  const modulePermissions = groupedPermissions[module];
                  const hasPermissions = modulePermissions.some(p => role.permissions.includes(p.id));
                  if (!hasPermissions) return null;
                  
                  return (
                    <div key={module} className="text-xs bg-gray-100 border border-gray-200 rounded-full px-2.5 py-1 capitalize">
                      {module.replace(/_/g, ' ')}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleName" className="text-right">
                Role Name
              </Label>
              <Input id="roleName" placeholder="e.g. Marketing Manager" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Input 
                id="description" 
                placeholder="Brief description of this role's purpose" 
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-right">
                <Label className="inline-block mb-1">Permissions</Label>
                <div className="text-xs text-gray-500">Select access privileges</div>
              </div>
              <div className="col-span-3 space-y-4">
                {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                  <div key={module} className="space-y-2 border rounded-md p-3">
                    <div className="font-medium capitalize flex items-center gap-2">
                      {module.replace(/_/g, ' ')}
                      <div className="group relative">
                        <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                        <div className="absolute left-0 top-6 w-64 bg-white p-2 rounded shadow-lg border text-xs text-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
                          Permissions for all {module.replace(/_/g, ' ')} related functions and data.
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {modulePermissions.map(permission => (
                        <div 
                          key={permission.id} 
                          className="flex items-center space-x-2 text-sm"
                        >
                          <Checkbox id={permission.id} />
                          <Label 
                            htmlFor={permission.id} 
                            className="cursor-pointer capitalize"
                          >
                            {permission.action}: {permission.description}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddRoleDialogOpen(false)}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
