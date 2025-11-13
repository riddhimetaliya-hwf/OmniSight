
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
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  AlertTriangle,
  Download,
  Search,
  SlidersHorizontal,
  Calendar,
  Filter
} from "lucide-react";
import { auditLogs } from "@/mock/rbacData";
import { cn } from "@/lib/utils";

export const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7days");
  
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.resource && log.resource.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    
    // For date range - basic implementation
    if (dateRange !== "all") {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      const diffDays = (now.getTime() - logDate.getTime()) / (1000 * 3600 * 24);
      
      if (dateRange === "24hours" && diffDays > 1) return false;
      if (dateRange === "7days" && diffDays > 7) return false;
      if (dateRange === "30days" && diffDays > 30) return false;
    }
    
    return matchesSearch && matchesAction && matchesSeverity;
  });
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Low</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };
  
  const getActionDisplay = (action: string) => {
    const formattedAction = action.replace(/_/g, ' ');
    return formattedAction.charAt(0).toUpperCase() + formattedAction.slice(1);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search audit logs..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24hours">Last 24 Hours</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="data_access">Data Access</SelectItem>
              <SelectItem value="role_change">Role Change</SelectItem>
              <SelectItem value="permission_change">Permission Change</SelectItem>
              <SelectItem value="user_create">User Create</SelectItem>
              <SelectItem value="user_update">User Update</SelectItem>
              <SelectItem value="user_delete">User Delete</SelectItem>
              <SelectItem value="export">Export</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" title="Advanced Filters">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" title="Export Logs">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">System Audit Log</h3>
          <p className="text-sm text-gray-500">
            Record of user actions and system events
          </p>
        </div>
        {filteredLogs.some(log => log.severity === "high") && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-md">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">High severity events detected</span>
          </div>
        )}
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-right">Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map(log => (
              <TableRow key={log.id} className={cn(
                log.severity === "high" && "bg-red-50"
              )}>
                <TableCell className="font-medium">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{log.userName}</TableCell>
                <TableCell>
                  {getActionDisplay(log.action)}
                </TableCell>
                <TableCell className="max-w-[250px] truncate">
                  {log.details}
                </TableCell>
                <TableCell className="text-sm">
                  {log.resource || "-"}
                </TableCell>
                <TableCell className="text-sm font-mono">
                  {log.ipAddress || "-"}
                </TableCell>
                <TableCell className="text-right">
                  {getSeverityBadge(log.severity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredLogs.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No audit logs match your search criteria
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          Showing {filteredLogs.length} of {auditLogs.length} logs
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-500">
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">1</Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">2</Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">3</Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
