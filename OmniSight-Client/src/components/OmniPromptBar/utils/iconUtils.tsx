
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  Download, 
  Calendar, 
  Users, 
  Search, 
  Command, 
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'dashboard': LayoutDashboard,
  'report': FileText,
  'reports': FileText,
  'chart': BarChart3,
  'insights': BarChart3,
  'alert': AlertTriangle, 
  'alerts': AlertTriangle,
  'settings': Settings,
  'export': Download,
  'download': Download,
  'calendar': Calendar,
  'meeting': Calendar,
  'user': Users,
  'users': Users,
  'search': Search,
  'default': Command
};

export const getDynamicIcon = (iconName?: string): LucideIcon => {
  if (!iconName) return iconMap.default;
  return iconMap[iconName.toLowerCase()] || iconMap.default;
};
