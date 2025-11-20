
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Automation, AutomationLog, AutomationFilterState, AutomationStatus, AutomationCategory } from '../types';
import { mockAutomations, mockLogs } from '../mockData';
import { useToast } from '@/hooks/use-toast';

interface AutomationContextType {
  automations: Automation[];
  filteredAutomations: Automation[];
  logs: AutomationLog[];
  filters: AutomationFilterState;
  
  updateFilters: (newFilters: Partial<AutomationFilterState>) => void;
  toggleAutomationStatus: (id: string, status: AutomationStatus) => void;
  createAutomation: (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAutomation: (id: string, updates: Partial<Automation>) => void;
  deleteAutomation: (id: string) => void;
  runAutomationNow: (id: string) => void;
}

const AutomationContext = createContext<AutomationContextType | undefined>(undefined);

export const useAutomationContext = () => {
  const context = useContext(AutomationContext);
  if (!context) {
    throw new Error('useAutomationContext must be used within an AutomationProvider');
  }
  return context;
};

const defaultFilters: AutomationFilterState = {
  status: ['active', 'paused', 'draft', 'error'],
  categories: ['reports', 'notifications', 'data', 'workflows', 'other'],
  search: '',
};

export const AutomationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations);
  const [logs, setLogs] = useState<AutomationLog[]>(mockLogs);
  const [filters, setFilters] = useState<AutomationFilterState>(defaultFilters);
  const { toast } = useToast();

  // Filter automations based on current filters
  const filteredAutomations = automations.filter(automation => {
    if (filters.status.length > 0 && !filters.status.includes(automation.status)) return false;
    if (filters.categories.length > 0 && !filters.categories.includes(automation.category)) return false;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        automation.name.toLowerCase().includes(searchLower) ||
        automation.description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Update filters
  const updateFilters = (newFilters: Partial<AutomationFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Toggle automation status (activate/pause)
  const toggleAutomationStatus = (id: string, status: AutomationStatus) => {
    setAutomations(prev => 
      prev.map(automation => {
        if (automation.id !== id) return automation;
        
        const now = new Date().toISOString();
        const updatedAutomation = { 
          ...automation, 
          status,
          updatedAt: now
        };
        
        toast({
          title: `Automation ${status === 'active' ? 'Activated' : 'Updated'}`,
          description: `"${automation.name}" has been ${status === 'active' ? 'activated' : status}.`,
        });
        
        // Add a log entry
        const logEntry: AutomationLog = {
          id: `log-${Date.now()}`,
          automationId: id,
          automationName: automation.name,
          timestamp: now,
          status: 'success',
          message: `Automation status changed to ${status}`
        };
        setLogs(prevLogs => [logEntry, ...prevLogs]);
        
        return updatedAutomation;
      })
    );
  };

  // Create a new automation
  const createAutomation = (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newAutomation: Automation = {
      ...automation,
      id: `automation-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    
    setAutomations(prev => [newAutomation, ...prev]);
    
    toast({
      title: 'Automation Created',
      description: `"${newAutomation.name}" has been created.`,
    });
    
    // Add a log entry
    const logEntry: AutomationLog = {
      id: `log-${Date.now()}`,
      automationId: newAutomation.id,
      automationName: newAutomation.name,
      timestamp: now,
      status: 'success',
      message: 'Automation created'
    };
    setLogs(prevLogs => [logEntry, ...prevLogs]);
  };

  // Update an existing automation
  const updateAutomation = (id: string, updates: Partial<Automation>) => {
    setAutomations(prev => 
      prev.map(automation => {
        if (automation.id !== id) return automation;
        
        const updatedAutomation = { 
          ...automation, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        
        toast({
          title: 'Automation Updated',
          description: `"${automation.name}" has been updated.`,
        });
        
        return updatedAutomation;
      })
    );
  };

  // Delete an automation
  const deleteAutomation = (id: string) => {
    const automationToDelete = automations.find(a => a.id === id);
    
    if (automationToDelete) {
      setAutomations(prev => prev.filter(a => a.id !== id));
      
      toast({
        title: 'Automation Deleted',
        description: `"${automationToDelete.name}" has been deleted.`,
      });
      
      // Add a log entry
      const logEntry: AutomationLog = {
        id: `log-${Date.now()}`,
        automationId: id,
        automationName: automationToDelete.name,
        timestamp: new Date().toISOString(),
        status: 'warning',
        message: 'Automation deleted'
      };
      setLogs(prevLogs => [logEntry, ...prevLogs]);
    }
  };

  // Run an automation immediately
  const runAutomationNow = (id: string) => {
    const automation = automations.find(a => a.id === id);
    
    if (automation) {
      const now = new Date().toISOString();
      
      // Update the lastRun timestamp
      setAutomations(prev => 
        prev.map(a => {
          if (a.id !== id) return a;
          return { ...a, lastRun: now };
        })
      );
      
      toast({
        title: 'Automation Running',
        description: `"${automation.name}" has been triggered manually.`,
      });
      
      // Simulate a success after 2 seconds
      setTimeout(() => {
        // Add a log entry
        const logEntry: AutomationLog = {
          id: `log-${Date.now()}`,
          automationId: id,
          automationName: automation.name,
          timestamp: new Date().toISOString(),
          status: 'success',
          message: 'Automation executed successfully (manual trigger)'
        };
        setLogs(prevLogs => [logEntry, ...prevLogs]);
        
        toast({
          title: 'Automation Completed',
          description: `"${automation.name}" has completed successfully.`,
        });
      }, 2000);
    }
  };

  // Simulate running scheduled automations in background
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      automations.forEach(automation => {
        if (automation.status !== 'active' || !automation.nextRun) return;
        
        const nextRunDate = new Date(automation.nextRun);
        if (nextRunDate <= now) {
          // Update the lastRun and calculate new nextRun
          const lastRun = now.toISOString();
          let nextRun = new Date(now);
          
          // Calculate next run time based on frequency
          if (automation.trigger.type === 'schedule') {
            const { frequency } = automation.trigger.config;
            if (frequency === 'hourly') {
              nextRun.setHours(nextRun.getHours() + 1);
            } else if (frequency === 'daily') {
              nextRun.setDate(nextRun.getDate() + 1);
            } else if (frequency === 'weekly') {
              nextRun.setDate(nextRun.getDate() + 7);
            } else if (frequency === 'monthly') {
              nextRun.setMonth(nextRun.getMonth() + 1);
            }
          }
          
          // Update the automation
          setAutomations(prev => 
            prev.map(a => {
              if (a.id !== automation.id) return a;
              return { ...a, lastRun, nextRun: nextRun.toISOString() };
            })
          );
          
          // Add a log entry
          const logEntry: AutomationLog = {
            id: `log-${Date.now()}`,
            automationId: automation.id,
            automationName: automation.name,
            timestamp: lastRun,
            status: 'success',
            message: 'Automation executed successfully (scheduled)'
          };
          setLogs(prevLogs => [logEntry, ...prevLogs]);
        }
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [automations]);

  const value = {
    automations,
    filteredAutomations,
    logs,
    filters,
    updateFilters,
    toggleAutomationStatus,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    runAutomationNow,
  };

  return <AutomationContext.Provider value={value}>{children}</AutomationContext.Provider>;
};
