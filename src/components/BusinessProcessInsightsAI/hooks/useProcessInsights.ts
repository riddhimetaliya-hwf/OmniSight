
import { useState, useEffect } from 'react';
import { ProcessInsight, ProcessArea } from '../types';
import { mockProcessInsights } from '../mockData';

interface UseProcessInsightsReturn {
  insights: ProcessInsight[];
  filteredInsights: ProcessInsight[];
  isLoading: boolean;
  submitPrompt: (prompt: string) => void;
  generateInsight: (insightType: string) => void;
  recommendedPrompts: {
    [key: string]: string[];
  };
}

export const useProcessInsights = (): UseProcessInsightsReturn => {
  const [insights, setInsights] = useState<ProcessInsight[]>([]);
  const [filteredInsights, setFilteredInsights] = useState<ProcessInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load initial data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setInsights(mockProcessInsights);
      setFilteredInsights(mockProcessInsights);
      setIsLoading(false);
    }, 1000);
  }, []);

  const submitPrompt = (prompt: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Create a new insight based on the prompt
      const newInsight: ProcessInsight = {
        id: `insight-${Date.now()}`,
        title: generateTitle(prompt),
        description: generateDescription(prompt),
        type: 'explanation',
        processArea: determineProcessArea(prompt) as ProcessArea,
        importance: 'medium',
        timestamp: new Date().toISOString(),
        isPinned: false,
        analysis: generateAnalysis(prompt),
        recommendations: [
          "Review staffing allocation during peak hours",
          "Implement fast-track option for priority items",
          "Reduce approval steps for standard orders"
        ],
        relatedMetrics: ["Cycle Time", "SLA Compliance", "Backlog Count"],
        trend: Math.random() > 0.5 ? 'up' : 'down',
      };

      setInsights((prevInsights) => [newInsight, ...prevInsights]);
      setFilteredInsights((prevFiltered) => [newInsight, ...prevFiltered]);
      setIsLoading(false);
    }, 2000);
  };

  const generateInsight = (insightType: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Generate a random insight
      const processAreas: ProcessArea[] = ['order-flow', 'talent-onboard', 'client-care'];
      const randomArea = processAreas[Math.floor(Math.random() * processAreas.length)];
      const titles = {
        'order-flow': 'Order processing delays detected in Northeast region',
        'talent-onboard': 'Onboarding time has increased by 15% this quarter',
        'client-care': 'Client satisfaction declining for technical support inquiries'
      };
      
      const newInsight: ProcessInsight = {
        id: `insight-${Date.now()}`,
        title: titles[randomArea],
        description: `AI has detected an anomaly in the ${randomArea.replace('-', ' ')} process that requires attention. This may be affecting overall performance metrics.`,
        type: insightType === 'performance_trend' ? 'trend' : 'anomaly',
        processArea: randomArea,
        importance: 'high',
        timestamp: new Date().toISOString(),
        isPinned: false,
        analysis: "In-depth analysis shows this issue began approximately 2 weeks ago and has been steadily worsening. The system has analyzed historical patterns and identified this as a statistically significant deviation from normal operations.",
        recommendations: [
          "Investigate resource allocation in affected department",
          "Review recent process changes that may have contributed",
          "Consider temporary additional staffing for affected area"
        ],
        relatedMetrics: ["Process Duration", "Backlog Growth", "Resource Utilization"],
        trend: 'down',
      };

      setInsights((prevInsights) => [newInsight, ...prevInsights]);
      setFilteredInsights((prevFiltered) => [newInsight, ...prevFiltered]);
      setIsLoading(false);
    }, 1500);
  };

  // Helper function to generate insight title based on prompt
  const generateTitle = (prompt: string): string => {
    if (prompt.toLowerCase().includes('order')) {
      return "Order flow bottlenecks in approval stage";
    } else if (prompt.toLowerCase().includes('talent') || prompt.toLowerCase().includes('onboard')) {
      return "IT provisioning delays affecting onboarding time";
    } else if (prompt.toLowerCase().includes('client') || prompt.toLowerCase().includes('customer')) {
      return "Client response times increased during peak hours";
    } else {
      return "Process performance anomaly detected";
    }
  };

  // Helper function to generate insight description based on prompt
  const generateDescription = (prompt: string): string => {
    if (prompt.toLowerCase().includes('order')) {
      return "Orders are spending 2.3x longer in the approval stage compared to last month. This is affecting overall cycle time and customer satisfaction.";
    } else if (prompt.toLowerCase().includes('talent') || prompt.toLowerCase().includes('onboard')) {
      return "New hire laptop and access provisioning is taking 3 additional days on average, creating delays in getting new employees productive.";
    } else if (prompt.toLowerCase().includes('client') || prompt.toLowerCase().includes('customer')) {
      return "First response time to client inquiries has increased by 45 minutes during peak hours (2-4pm), impacting satisfaction scores.";
    } else {
      return "AI analysis has identified an anomaly in your business process performance that requires attention. Further investigation recommended.";
    }
  };

  // Helper function to determine process area from prompt
  const determineProcessArea = (prompt: string): string => {
    if (prompt.toLowerCase().includes('order') || prompt.toLowerCase().includes('fulfill')) {
      return 'order-flow';
    } else if (prompt.toLowerCase().includes('talent') || prompt.toLowerCase().includes('onboard') || prompt.toLowerCase().includes('hire')) {
      return 'talent-onboard';
    } else if (prompt.toLowerCase().includes('client') || prompt.toLowerCase().includes('customer') || prompt.toLowerCase().includes('support')) {
      return 'client-care';
    } else {
      // Default to a random area if we can't determine
      const areas: ProcessArea[] = ['order-flow', 'talent-onboard', 'client-care'];
      return areas[Math.floor(Math.random() * areas.length)];
    }
  };

  // Helper function to generate analysis
  const generateAnalysis = (prompt: string): string => {
    const analyses = [
      "Analysis of historical data shows this issue began 3 weeks ago and correlates with the deployment of the new workflow system. The primary factor appears to be additional approval steps that were added without sufficient training.",
      "AI pattern detection has identified that this performance issue occurs primarily during peak volume periods and may be related to resource constraints rather than process design.",
      "Comparing current metrics with seasonal patterns from previous years suggests this anomaly is unusual and not attributable to normal business cycles. Root cause appears to be related to recent staffing changes."
    ];
    
    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  // Predefined recommended prompts by process area
  const recommendedPrompts = {
    'order-flow': [
      "Why are orders taking longer to process?",
      "Which order types have the highest rejection rate?",
      "Explain the drop in order processing speed",
      "What's causing order approval bottlenecks?"
    ],
    'talent-onboard': [
      "Why is onboarding taking longer this month?",
      "Which department has the slowest onboarding?",
      "Explain IT provisioning delays for new hires",
      "What's causing the increase in onboarding time?"
    ],
    'client-care': [
      "Why is client satisfaction decreasing?",
      "Which service team has the longest response time?",
      "Explain the drop in first-call resolution rate",
      "What's causing repeat client issues?"
    ]
  };

  return {
    insights,
    filteredInsights,
    isLoading,
    submitPrompt,
    generateInsight,
    recommendedPrompts
  };
};
