
import { v4 as uuidv4 } from 'uuid';
import { AppDefinition } from '../../types';
import { formTemplate } from '../templates/formTemplate';
import { dashboardTemplate } from '../templates/dashboardTemplate';
import { workflowTemplate } from '../templates/workflowTemplate';
import { crmTemplate } from '../templates/crmTemplate';
import { leaveRequestTemplate } from '../templates/leaveRequestTemplate';

export const selectTemplateFromPrompt = (prompt: string): AppDefinition => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes("crm") || lowerPrompt.includes("customer") || lowerPrompt.includes("relationship")) {
    return { ...crmTemplate, id: uuidv4() };
  } else if (lowerPrompt.includes("leave") || lowerPrompt.includes("hr") || lowerPrompt.includes("request")) {
    return { ...leaveRequestTemplate, id: uuidv4() };
  } else if (lowerPrompt.includes("dashboard") || lowerPrompt.includes("sales data")) {
    return { ...dashboardTemplate, id: uuidv4() };
  } else if (lowerPrompt.includes("workflow") || lowerPrompt.includes("approval")) {
    return { ...workflowTemplate, id: uuidv4() };
  } else {
    return { ...formTemplate, id: uuidv4() };
  }
};
