
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CopilotSource, CopilotInsight, CopilotRecommendation, CopilotQuery } from '../types';
import { mockInsights, mockRecommendations } from '../data/mockData';

interface CopilotContextType {
  insights: CopilotInsight[];
  recommendations: CopilotRecommendation[];
  recentQueries: CopilotQuery[];
  isLoading: boolean;
  activeSource: CopilotSource;
  query: string;
  setQuery: (query: string) => void;
  setActiveSource: (source: CopilotSource) => void;
  submitQuery: (query: string) => Promise<void>;
  clearQuery: () => void;
  generateBriefing: (type: 'daily' | 'weekly') => Promise<void>;
  generateReport: (department: string) => Promise<void>;
  createAlert: (insightId: string) => Promise<void>;
  delegateTask: (task: string, to: string) => Promise<void>;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export const useCopilotContext = () => {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error('useCopilotContext must be used within a CopilotProvider');
  }
  return context;
};

interface CopilotProviderProps {
  children: ReactNode;
}

export const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  const [insights, setInsights] = useState<CopilotInsight[]>([]);
  const [recommendations, setRecommendations] = useState<CopilotRecommendation[]>([]);
  const [recentQueries, setRecentQueries] = useState<CopilotQuery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSource, setActiveSource] = useState<CopilotSource>('all');
  const [query, setQuery] = useState('');

  // Load initial data
  useEffect(() => {
    setInsights(mockInsights);
    setRecommendations(mockRecommendations);
  }, []);

  const submitQuery = async (queryText: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add to recent queries
      const newQuery: CopilotQuery = {
        id: `query-${Date.now()}`,
        text: queryText,
        timestamp: new Date().toISOString(),
        inputType: 'text'
      };
      
      setRecentQueries(prev => [newQuery, ...prev.slice(0, 4)]);
      setQuery('');
      
      // Simulate response based on query
      if (queryText.toLowerCase().includes('board meeting')) {
        setInsights(prev => [
          {
            id: `insight-${Date.now()}`,
            title: 'Board Meeting Preparation',
            description: 'Key materials prepared for next board meeting. Financial summary and strategic initiatives compiled.',
            type: 'summary',
            importance: 'high',
            source: 'crm',
            timestamp: new Date().toISOString(),
          },
          ...prev
        ]);
      }
      
    } catch (error) {
      console.error('Error submitting query:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearQuery = () => setQuery('');

  const generateBriefing = async (type: 'daily' | 'weekly') => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add a new insight about the briefing
      setInsights(prev => [
        {
          id: `briefing-${Date.now()}`,
          title: `${type === 'daily' ? 'Daily' : 'Weekly'} Briefing Generated`,
          description: `Your ${type} briefing has been generated and sent to your email.`,
          type: 'summary',
          importance: 'medium',
          source: 'all',
          timestamp: new Date().toISOString(),
        },
        ...prev
      ]);
      
    } catch (error) {
      console.error(`Error generating ${type} briefing:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (department: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Add a new insight about the report
      setInsights(prev => [
        {
          id: `report-${Date.now()}`,
          title: `${department} Report Generated`,
          description: `A comprehensive report for the ${department} department has been prepared.`,
          type: 'summary',
          importance: 'medium',
          source: department.toLowerCase() as CopilotSource,
          timestamp: new Date().toISOString(),
        },
        ...prev
      ]);
      
    } catch (error) {
      console.error(`Error generating ${department} report:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAlert = async (insightId: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const insight = insights.find(i => i.id === insightId);
      if (insight) {
        setInsights(prev => prev.map(i => 
          i.id === insightId ? { ...i, hasAlert: true } : i
        ));
      }
      
    } catch (error) {
      console.error('Error creating alert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const delegateTask = async (task: string, to: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add a new insight about the delegated task
      setInsights(prev => [
        {
          id: `task-${Date.now()}`,
          title: `Task Delegated to ${to}`,
          description: `"${task}" has been assigned to ${to}.`,
          type: 'action',
          importance: 'medium',
          source: 'operations',
          timestamp: new Date().toISOString(),
        },
        ...prev
      ]);
      
    } catch (error) {
      console.error('Error delegating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    insights,
    recommendations,
    recentQueries,
    isLoading,
    activeSource,
    query,
    setQuery,
    setActiveSource,
    submitQuery,
    clearQuery,
    generateBriefing,
    generateReport,
    createAlert,
    delegateTask,
  };

  return <CopilotContext.Provider value={value}>{children}</CopilotContext.Provider>;
};
