
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roles, users, permissions } from "@/mock/rbacData";
import { PlusCircle, Save, HelpCircle } from "lucide-react";

const moduleDisplayNames: Record<string, string> = {
  integration_hub: "Integration Hub",
  data_warehouse: "Data Warehouse",
  analytics: "Analytics & Reporting",
  workflows: "Workflows & Automation",
  rbac: "Access Control",
  all: "All Modules"
};

const permissionDescriptions: Record<string, string> = {
  create: "Create new resources",
  read: "View and access resources",
  update: "Modify existing resources",
  delete: "Remove resources",
  approve: "Approve changes or workflows",
  export: "Export or download data"
};

export const PermissionSettings = () => {
  const modulePermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Permission Configuration</h3>
          <p className="text-sm text-gray-500">Define and manage system permissions</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Permission
        </Button>
      </div>
      
      <Tabs defaultValue="module">
        <TabsList className="mb-6">
          <TabsTrigger value="module">By Module</TabsTrigger>
          <TabsTrigger value="role">By Role</TabsTrigger>
          <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
        </TabsList>
        
        <TabsContent value="module" className="space-y-6">
          {Object.entries(modulePermissions).map(([module, perms]) => (
            <Card key={module}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {moduleDisplayNames[module] || module.replace(/_/g, ' ')}
                  <Badge variant="outline" className="ml-2">
                    {perms.length} Permissions
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Configure access rights for this module
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Permission</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[150px]">Roles with Access</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perms.map(permission => {
                      const rolesWithPermission = roles.filter(
                        role => role.permissions.includes(permission.id)
                      );
                      
                      return (
                        <TableRow key={permission.id}>
                          <TableCell className="font-medium capitalize">
                            {permission.action}
                          </TableCell>
                          <TableCell>{permission.description}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {rolesWithPermission.slice(0, 2).map(role => (
                                <Badge key={role.id} variant="secondary" className="text-xs">
                                  {role.name}
                                </Badge>
                              ))}
                              {rolesWithPermission.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{rolesWithPermission.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="role" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Select defaultValue={roles[0]?.id}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select role to configure" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge className="ml-2">
                {roles[0]?.permissions.length || 0} Permissions
              </Badge>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(modulePermissions).map(([module, modulePerms]) => (
              <Card key={module}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">
                    {moduleDisplayNames[module] || module.replace(/_/g, ' ')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modulePerms.map(permission => {
                      const hasPermission = roles[0]?.permissions.includes(permission.id);
                      
                      return (
                        <div key={permission.id} className="flex items-start space-x-3">
                          <Checkbox id={`perm-${permission.id}`} checked={hasPermission} />
                          <div className="space-y-1">
                            <label 
                              htmlFor={`perm-${permission.id}`} 
                              className="font-medium text-sm cursor-pointer capitalize"
                            >
                              {permission.action}
                            </label>
                            <p className="text-xs text-gray-500">{permission.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>
                Comprehensive view of all roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Module & Permission</TableHead>
                    {roles.map(role => (
                      <TableHead key={role.id} className="min-w-[120px] text-center">
                        {role.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(modulePermissions).map(([module, modulePerms]) => (
                    <React.Fragment key={module}>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-semibold">
                          {moduleDisplayNames[module] || module.replace(/_/g, ' ')}
                        </TableCell>
                        {roles.map(role => (
                          <TableCell key={role.id}></TableCell>
                        ))}
                      </TableRow>
                      
                      {modulePerms.map(permission => (
                        <TableRow key={permission.id}>
                          <TableCell className="pl-6 capitalize">
                            <div className="flex items-center gap-1">
                              {permission.action}
                              <HelpCircle className="h-3 w-3 text-gray-400 cursor-help" />
                            </div>
                          </TableCell>
                          
                          {roles.map(role => {
                            const hasPermission = role.permissions.includes(permission.id);
                            
                            return (
                              <TableCell key={role.id} className="text-center">
                                <Checkbox checked={hasPermission} />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
