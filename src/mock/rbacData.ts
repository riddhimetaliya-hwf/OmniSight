
import { User, Role, Permission, AuditLog, RoleType, PermissionType, ModuleType } from "@/types/rbac";

// Mock Permissions
export const permissions: Permission[] = [
  // Integration Hub Permissions
  {
    id: "perm_1",
    module: "integration_hub",
    action: "read",
    description: "View integration connections and status"
  },
  {
    id: "perm_2",
    module: "integration_hub",
    action: "create",
    description: "Create new integration connections"
  },
  {
    id: "perm_3",
    module: "integration_hub",
    action: "update",
    description: "Modify existing integration connections"
  },
  {
    id: "perm_4",
    module: "integration_hub",
    action: "delete",
    description: "Remove integration connections"
  },
  
  // Data Warehouse Permissions
  {
    id: "perm_5",
    module: "data_warehouse",
    action: "read",
    description: "View data schemas and mappings"
  },
  {
    id: "perm_6",
    module: "data_warehouse",
    action: "create",
    description: "Create new data schemas"
  },
  {
    id: "perm_7",
    module: "data_warehouse",
    action: "update",
    description: "Modify existing data schemas"
  },
  
  // Analytics Permissions
  {
    id: "perm_8",
    module: "analytics",
    action: "read",
    description: "View analytics dashboards"
  },
  {
    id: "perm_9",
    module: "analytics",
    action: "export",
    description: "Export analytics data"
  },
  
  // RBAC Permissions
  {
    id: "perm_10",
    module: "rbac",
    action: "read",
    description: "View users and roles"
  },
  {
    id: "perm_11",
    module: "rbac",
    action: "create",
    description: "Create new users and roles"
  },
  {
    id: "perm_12",
    module: "rbac",
    action: "update",
    description: "Modify existing users and roles"
  },
  {
    id: "perm_13",
    module: "rbac",
    action: "delete",
    description: "Remove users and roles"
  },
];

// Mock Roles
export const roles: Role[] = [
  {
    id: "role_1",
    name: "Administrator",
    type: "admin",
    description: "Full system access with all permissions",
    permissions: [
      "perm_1", "perm_2", "perm_3", "perm_4", "perm_5", "perm_6", 
      "perm_7", "perm_8", "perm_9", "perm_10", "perm_11", "perm_12", "perm_13"
    ],
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "role_2",
    name: "Executive",
    type: "executive",
    description: "High-level access to all data and reports",
    permissions: [
      "perm_1", "perm_5", "perm_8", "perm_9", "perm_10"
    ],
    createdAt: "2023-01-02T00:00:00Z",
    updatedAt: "2023-01-02T00:00:00Z"
  },
  {
    id: "role_3",
    name: "Sales Manager",
    type: "department_head",
    description: "Manage sales data and team access",
    permissions: [
      "perm_1", "perm_3", "perm_5", "perm_8", "perm_9" 
    ],
    createdAt: "2023-01-03T00:00:00Z",
    updatedAt: "2023-01-03T00:00:00Z"
  },
  {
    id: "role_4",
    name: "Business Analyst",
    type: "analyst",
    description: "Analyze data and create reports",
    permissions: [
      "perm_1", "perm_5", "perm_8", "perm_9"
    ],
    createdAt: "2023-01-04T00:00:00Z",
    updatedAt: "2023-01-04T00:00:00Z"
  },
  {
    id: "role_5",
    name: "Viewer",
    type: "viewer",
    description: "Read-only access to approved data",
    permissions: [
      "perm_1", "perm_5", "perm_8"
    ],
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z"
  }
];

// Mock Users
export const users: User[] = [
  {
    id: "user_1",
    name: "John Smith",
    email: "john.smith@company.com",
    avatar: "https://ui-avatars.com/api/?name=John+Smith&background=0D8ABC&color=fff",
    role: "role_1",
    department: "it",
    status: "active",
    lastActive: "2023-06-10T15:30:00Z",
    createdAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "user_2",
    name: "Emma Johnson",
    email: "emma.johnson@company.com",
    avatar: "https://ui-avatars.com/api/?name=Emma+Johnson&background=6C8CBC&color=fff",
    role: "role_2",
    department: "all",
    status: "active",
    lastActive: "2023-06-10T14:15:00Z",
    createdAt: "2023-01-02T00:00:00Z"
  },
  {
    id: "user_3",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=4CAF50&color=fff",
    role: "role_3",
    department: "sales",
    status: "active",
    lastActive: "2023-06-09T16:45:00Z",
    createdAt: "2023-01-03T00:00:00Z"
  },
  {
    id: "user_4",
    name: "Sarah Williams",
    email: "sarah.williams@company.com",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Williams&background=F06292&color=fff",
    role: "role_3",
    department: "finance",
    status: "active",
    lastActive: "2023-06-10T11:20:00Z",
    createdAt: "2023-01-04T00:00:00Z"
  },
  {
    id: "user_5",
    name: "David Robinson",
    email: "david.robinson@company.com",
    avatar: "https://ui-avatars.com/api/?name=David+Robinson&background=FFA726&color=fff",
    role: "role_4",
    department: "operations",
    status: "inactive",
    lastActive: "2023-06-01T09:15:00Z",
    createdAt: "2023-01-05T00:00:00Z"
  },
  {
    id: "user_6",
    name: "Lisa Kumar",
    email: "lisa.kumar@company.com",
    avatar: "https://ui-avatars.com/api/?name=Lisa+Kumar&background=AB47BC&color=fff",
    role: "role_4",
    department: "hr",
    status: "active",
    lastActive: "2023-06-10T10:30:00Z",
    createdAt: "2023-01-06T00:00:00Z"
  },
  {
    id: "user_7",
    name: "Robert Taylor",
    email: "robert.taylor@company.com",
    avatar: "https://ui-avatars.com/api/?name=Robert+Taylor&background=26A69A&color=fff",
    role: "role_5",
    department: "finance",
    status: "pending",
    createdAt: "2023-06-08T00:00:00Z"
  }
];

// Mock Audit Logs
export const auditLogs: AuditLog[] = [
  {
    id: "log_1",
    userId: "user_1",
    userName: "John Smith",
    action: "login",
    details: "Successful login",
    ipAddress: "192.168.1.1",
    timestamp: "2023-06-10T09:00:00Z",
    severity: "low"
  },
  {
    id: "log_2",
    userId: "user_2",
    userName: "Emma Johnson",
    action: "data_access",
    details: "Accessed financial reports",
    resource: "financial_dashboard",
    ipAddress: "192.168.1.2",
    timestamp: "2023-06-10T10:15:00Z",
    severity: "low"
  },
  {
    id: "log_3",
    userId: "user_1",
    userName: "John Smith",
    action: "user_create",
    details: "Created new user: Robert Taylor",
    resource: "user_7",
    ipAddress: "192.168.1.1",
    timestamp: "2023-06-08T14:30:00Z",
    severity: "medium"
  },
  {
    id: "log_4",
    userId: "user_3",
    userName: "Michael Chen",
    action: "login",
    details: "Failed login attempt (3 times)",
    ipAddress: "203.0.113.1",
    timestamp: "2023-06-09T08:45:00Z",
    severity: "high"
  },
  {
    id: "log_5",
    userId: "user_3",
    userName: "Michael Chen",
    action: "login",
    details: "Successful login",
    ipAddress: "192.168.1.3",
    timestamp: "2023-06-09T08:50:00Z",
    severity: "low"
  },
  {
    id: "log_6",
    userId: "user_4",
    userName: "Sarah Williams",
    action: "role_change",
    details: "Changed role from Analyst to Department Head",
    resource: "user_4",
    ipAddress: "192.168.1.4",
    timestamp: "2023-06-05T11:20:00Z",
    severity: "medium"
  },
  {
    id: "log_7",
    userId: "user_1",
    userName: "John Smith",
    action: "permission_change",
    details: "Added 'export' permission to Sales Manager role",
    resource: "role_3",
    ipAddress: "192.168.1.1",
    timestamp: "2023-06-07T16:15:00Z",
    severity: "medium"
  },
  {
    id: "log_8",
    userId: "user_5",
    userName: "David Robinson",
    action: "export",
    details: "Exported customer data report",
    resource: "customer_reports",
    ipAddress: "192.168.1.5",
    timestamp: "2023-06-01T09:10:00Z",
    severity: "medium"
  },
  {
    id: "log_9",
    userId: "user_2",
    userName: "Emma Johnson",
    action: "logout",
    details: "User logged out",
    ipAddress: "192.168.1.2",
    timestamp: "2023-06-10T15:45:00Z",
    severity: "low"
  },
  {
    id: "log_10",
    userId: "unknown",
    userName: "Unknown",
    action: "login",
    details: "Unauthorized access attempt",
    ipAddress: "198.51.100.1",
    timestamp: "2023-06-10T03:25:00Z",
    severity: "high"
  }
];

export const getRole = (roleId: string): Role | undefined => {
  return roles.find(role => role.id === roleId);
};

export const getRolePermissions = (roleId: string): Permission[] => {
  const role = roles.find(r => r.id === roleId);
  if (!role) return [];
  
  return permissions.filter(permission => role.permissions.includes(permission.id));
};

export const getUsersWithRoles = (): (User & { roleName: string })[] => {
  return users.map(user => {
    const role = getRole(user.role);
    return {
      ...user,
      roleName: role?.name || "Unknown Role"
    };
  });
};
