
import { v4 as uuidv4 } from 'uuid';
import { AppDefinition } from '../types';
import { selectTemplateFromPrompt } from './utils/templateSelector';

export const generateMockApp = (prompt: string): AppDefinition => {
  const baseApp = selectTemplateFromPrompt(prompt);
  
  let appName = baseApp.name;
  if (prompt.length > 10) {
    const words = prompt.split(' ');
    if (words.length >= 3) {
      appName = words.slice(0, 3).join(' ');
      appName = appName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      if (appName.length < 5) {
        appName = baseApp.name;
      }
    }
  }
  
  return {
    ...baseApp,
    name: appName,
    description: prompt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};
