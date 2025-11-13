
export type RoleType = 
  | 'admin' 
  | 'executive' 
  | 'department_head' 
  | 'analyst' 
  | 'viewer';

export type DepartmentType = 
  | 'sales' 
  | 'finance' 
  | 'hr' 
  | 'operations' 
  | 'it' 
  | 'marketing' 
  | 'all';

export type ModuleType = 
  | 'integration_hub' 
  | 'data_warehouse' 
  | 'analytics' 
  | 'reporting' 
  | 'workflows' 
  | 'rbac' 
  | 'all';

export type PermissionType = 
  | 'create' 
  | 'read' 
  | 'update' 
  | 'delete' 
  | 'approve' 
  | 'export';

export type Permission = {
  id: string;
  module: ModuleType;
  action: PermissionType;
  description: string;
};

export type Role = {
  id: string;
  name: string;
  type: RoleType;
  description: string;
  permissions: string[]; // Permission IDs
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string; // Role ID
  department: DepartmentType;
  status: 'active' | 'inactive' | 'pending';
  lastActive?: string;
  createdAt: string;
};

export type AuditLogType = 
  | 'login' 
  | 'logout' 
  | 'data_access' 
  | 'role_change' 
  | 'permission_change' 
  | 'user_create' 
  | 'user_update' 
  | 'user_delete'
  | 'export';

export type AuditLog = {
  id: string;
  userId: string;
  userName: string;
  action: AuditLogType;
  details: string;
  resource?: string;
  ipAddress?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
};
