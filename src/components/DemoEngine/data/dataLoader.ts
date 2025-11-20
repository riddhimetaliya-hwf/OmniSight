
import { DemoPersona } from '../types';
import { 
  ceoData, 
  cfoData, 
  cooData, 
  cmoData, 
  chroData 
} from './mockData';
import { updateOmniCommandState } from './stateUpdaters';

/**
 * Loads persona-specific data and updates application state
 */
export const loadPersonaData = async (persona: DemoPersona): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let personaData;
  
  // Load the appropriate data set based on persona
  switch (persona) {
    case 'CEO':
      personaData = ceoData;
      break;
    case 'CFO':
      personaData = cfoData;
      break;
    case 'COO':
      personaData = cooData;
      break;
    case 'CMO':
      personaData = cmoData;
      break;
    case 'CHRO':
      personaData = chroData;
      break;
    default:
      personaData = ceoData;
  }
  
  // Update various parts of the application state with the loaded data
  if (personaData) {
    // Update OmniCommand state with persona-specific data
    updateOmniCommandState(persona, personaData.command);
    
    // Add more state updaters as needed for other components
    // updateInsightsState(personaData.insights);
    // updateWorkflowsState(personaData.workflows);
    // etc.
  }
  
  return Promise.resolve();
};
