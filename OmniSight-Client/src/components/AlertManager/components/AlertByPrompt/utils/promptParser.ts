
import { v4 as uuidv4 } from 'uuid';
import { AlertPromptRule } from '../../../types';

// This is a simple mock implementation of an NLP parser
// In a real app, this would use a more sophisticated NLP engine or AI
export const parseNaturalLanguage = (prompt: string): AlertPromptRule => {
  const now = new Date().toISOString();
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract the likely metric being monitored
  let name = 'Alert Rule';
  let description = prompt;
  let condition = 'auto-generated';
  let threshold: number | undefined = undefined;
  let thresholdUnit: string | undefined = undefined;
  let department = 'all';
  let severity: 'low' | 'medium' | 'high' = 'medium';
  
  // Simple pattern matching to extract information
  if (lowerPrompt.includes('revenue') || lowerPrompt.includes('sales')) {
    name = 'Revenue Alert';
    department = 'sales';
    
    // Try to extract the threshold value
    const moneyRegex = /\$(\d+)k|\$(\d+)K|\$(\d+),000|\$(\d+)000/;
    const match = lowerPrompt.match(moneyRegex);
    if (match) {
      threshold = parseInt(match[1] || match[2] || match[3] || match[4]);
      thresholdUnit = 'value';
      condition = `revenue < ${threshold}000`;
    }
  } else if (lowerPrompt.includes('pto') || lowerPrompt.includes('time off') || lowerPrompt.includes('leave')) {
    name = 'PTO Request Alert';
    department = 'hr';
    
    // Try to extract number of days
    const daysRegex = /(\d+)\s+days/;
    const match = lowerPrompt.match(daysRegex);
    if (match) {
      threshold = parseInt(match[1]);
      thresholdUnit = 'days';
      condition = `pto_days > ${threshold}`;
    }
  } else if (lowerPrompt.includes('response time') || lowerPrompt.includes('load') || lowerPrompt.includes('server')) {
    name = 'System Performance Alert';
    department = 'it';
    
    // Try to extract time thresholds
    const timeRegex = /(\d+)\s+(second|minute|hour|day)s?/;
    const match = lowerPrompt.match(timeRegex);
    if (match) {
      threshold = parseInt(match[1]);
      thresholdUnit = match[2] + 's';
      condition = `response_time > ${threshold} ${match[2]}s`;
    }
  }
  
  // Determine severity based on keywords
  if (lowerPrompt.includes('critical') || lowerPrompt.includes('urgent') || lowerPrompt.includes('immediately')) {
    severity = 'high';
  } else if (lowerPrompt.includes('minor') || lowerPrompt.includes('low')) {
    severity = 'low';
  }
  
  return {
    id: uuidv4(),
    name,
    description,
    condition,
    naturalLanguage: prompt,
    threshold,
    thresholdUnit,
    channels: ['in-app', 'email'],
    department,
    createdAt: now,
    updatedAt: now,
    enabled: true,
    escalationMinutes: 30,
    severity
  };
};
