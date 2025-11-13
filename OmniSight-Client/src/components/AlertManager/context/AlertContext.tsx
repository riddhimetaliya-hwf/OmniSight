
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, AlertRule, AlertFilterState, AlertStatus, AlertRecipient } from '../types';
import { mockAlerts, mockAlertRules, mockRecipients } from '../mockData';
import { useToast } from '@/hooks/use-toast';

interface AlertContextType {
  alerts: Alert[];
  filteredAlerts: Alert[];
  alertRules: AlertRule[];
  recipients: AlertRecipient[];
  filters: AlertFilterState;
  selectedAlert: Alert | null;
  
  updateFilters: (newFilters: Partial<AlertFilterState>) => void;
  updateAlertStatus: (alertId: string, status: AlertStatus, comment?: string) => void;
  createAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createRule: (rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRule: (ruleId: string, updates: Partial<AlertRule>) => void;
  deleteRule: (ruleId: string) => void;
  createNaturalLanguageRule: (naturalLanguage: string) => void;
  setSelectedAlert: (alert: Alert | null) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};

const defaultFilters: AlertFilterState = {
  severity: ['low', 'medium', 'high'],
  status: ['new', 'acknowledged', 'snoozed', 'escalated'],
  departments: [],
  timeRange: 'all',
  search: '',
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(mockAlertRules);
  const [recipients, setRecipients] = useState<AlertRecipient[]>(mockRecipients);
  const [filters, setFilters] = useState<AlertFilterState>(defaultFilters);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const { toast } = useToast();

  // Filter alerts based on the current filters
  const filteredAlerts = alerts.filter(alert => {
    if (filters.severity.length > 0 && !filters.severity.includes(alert.severity)) return false;
    if (filters.status.length > 0 && !filters.status.includes(alert.status)) return false;
    if (filters.departments.length > 0 && !filters.departments.includes(alert.department)) return false;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        alert.title.toLowerCase().includes(searchLower) ||
        alert.message.toLowerCase().includes(searchLower) ||
        alert.department.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Update filters
  const updateFilters = (newFilters: Partial<AlertFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Update alert status (acknowledge, resolve, snooze, escalate)
  const updateAlertStatus = (alertId: string, status: AlertStatus, comment?: string) => {
    setAlerts(prev => 
      prev.map(alert => {
        if (alert.id !== alertId) return alert;
        
        const now = new Date().toISOString();
        const updates: Partial<Alert> = { 
          status, 
          updatedAt: now
        };
        
        // Add specific fields based on the status
        if (status === 'acknowledged') {
          updates.acknowledgedAt = now;
          updates.acknowledgedBy = 'Current User'; // In a real app, this would be the actual user
        } else if (status === 'resolved') {
          updates.resolvedAt = now;
          updates.resolvedBy = 'Current User';
        } else if (status === 'snoozed') {
          // Snooze for 1 hour by default
          const snoozeTime = new Date();
          snoozeTime.setHours(snoozeTime.getHours() + 1);
          updates.snoozedUntil = snoozeTime.toISOString();
        } else if (status === 'escalated') {
          updates.escalatedAt = now;
          // In a real app, we would determine the next person in the escalation tree
          updates.escalatedTo = 'Next Responsible Person';
        }
        
        toast({
          title: `Alert ${status}`,
          description: `The alert "${alert.title}" has been ${status}.`,
        });
        
        return { ...alert, ...updates };
      })
    );
  };

  // Create a new alert
  const createAlert = (alert: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newAlert: Alert = {
      ...alert,
      id: `alert-${alerts.length + 1}`,
      createdAt: now,
      updatedAt: now,
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    
    toast({
      title: 'New Alert',
      description: `"${newAlert.title}" has been created.`,
    });
  };

  // Create a new rule
  const createRule = (rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newRule: AlertRule = {
      ...rule,
      id: `rule-${alertRules.length + 1}`,
      createdAt: now,
      updatedAt: now,
    };
    
    setAlertRules(prev => [newRule, ...prev]);
    
    toast({
      title: 'Rule Created',
      description: `"${newRule.name}" has been created.`,
    });
  };

  // Update an existing rule
  const updateRule = (ruleId: string, updates: Partial<AlertRule>) => {
    setAlertRules(prev => 
      prev.map(rule => {
        if (rule.id !== ruleId) return rule;
        
        const updatedRule = { 
          ...rule, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        
        toast({
          title: 'Rule Updated',
          description: `"${rule.name}" has been updated.`,
        });
        
        return updatedRule;
      })
    );
  };

  // Delete a rule
  const deleteRule = (ruleId: string) => {
    const ruleToDelete = alertRules.find(rule => rule.id === ruleId);
    
    if (ruleToDelete) {
      setAlertRules(prev => prev.filter(rule => rule.id !== ruleId));
      
      toast({
        title: 'Rule Deleted',
        description: `"${ruleToDelete.name}" has been deleted.`,
      });
    }
  };

  // Create a rule from natural language input
  const createNaturalLanguageRule = (naturalLanguage: string) => {
    // In a real app, this would use AI to parse the natural language
    // and create a structured rule. For this demo, we'll create a simple rule.
    
    const now = new Date().toISOString();
    const newRule: AlertRule = {
      id: `rule-${alertRules.length + 1}`,
      name: `Rule from natural language`,
      description: 'Automatically generated from natural language',
      condition: 'auto-generated',
      naturalLanguage,
      channels: ['in-app', 'email'],
      recipients: [recipients[0]], // Just use the first recipient for demo
      department: 'all',
      createdAt: now,
      updatedAt: now,
      enabled: true,
      escalationMinutes: 30,
    };
    
    setAlertRules(prev => [newRule, ...prev]);
    
    toast({
      title: 'Rule Created',
      description: `New rule created from: "${naturalLanguage}"`,
    });
  };

  // Simulate processing any snoozed alerts that should now trigger
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString();
      setAlerts(prev => 
        prev.map(alert => {
          if (alert.status === 'snoozed' && alert.snoozedUntil && alert.snoozedUntil < now) {
            // Alert snooze period is over, return to 'new' status
            return { ...alert, status: 'new', updatedAt: now };
          }
          return alert;
        })
      );
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  // The context value
  const value = {
    alerts,
    filteredAlerts,
    alertRules,
    recipients,
    filters,
    selectedAlert,
    updateFilters,
    updateAlertStatus,
    createAlert,
    createRule,
    updateRule,
    deleteRule,
    createNaturalLanguageRule,
    setSelectedAlert,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};
