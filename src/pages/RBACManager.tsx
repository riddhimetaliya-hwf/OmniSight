
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/RBAC/UserManagement";
import { RoleManagement } from "@/components/RBAC/RoleManagement";
import { AuditLogs } from "@/components/RBAC/AuditLogs";
import { PermissionSettings } from "@/components/RBAC/PermissionSettings";
import Layout from "@/components/Layout/Layout";

const RBACManager = () => {
  return (
    <Layout title="OmniSight RBAC Manager" subtitle="Phase 1">
      <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
        <h2 className="text-xl font-medium mb-2">Access Control Management</h2>
        <p className="text-apple-gray max-w-3xl">
          Manage user access, roles, permissions, and review audit logs for your OmniSight instance.
        </p>
      </div>

      <div className="glass-container p-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="users" className="text-sm py-2 px-4">
              Users
            </TabsTrigger>
            <TabsTrigger value="roles" className="text-sm py-2 px-4">
              Roles
            </TabsTrigger>
            <TabsTrigger value="permissions" className="text-sm py-2 px-4">
              Permissions
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-sm py-2 px-4">
              Audit Logs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="roles">
            <RoleManagement />
          </TabsContent>

          <TabsContent value="permissions">
            <PermissionSettings />
          </TabsContent>
          
          <TabsContent value="audit">
            <AuditLogs />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RBACManager;
