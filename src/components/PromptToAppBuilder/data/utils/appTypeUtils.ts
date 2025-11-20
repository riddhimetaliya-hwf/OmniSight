
import { AppType } from '../../types';

export const getAppTypeFromPrompt = (prompt: string): AppType => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes("form") || lowerPrompt.includes("input") || lowerPrompt.includes("survey")) {
    return "form";
  } else if (lowerPrompt.includes("dashboard") || lowerPrompt.includes("visualization") || lowerPrompt.includes("chart")) {
    return "dashboard";
  } else if (lowerPrompt.includes("workflow") || lowerPrompt.includes("approval") || lowerPrompt.includes("process")) {
    return "workflow";
  } else if (lowerPrompt.includes("report") || lowerPrompt.includes("summary")) {
    return "report";
  } else if (lowerPrompt.includes("table") || lowerPrompt.includes("list") || lowerPrompt.includes("grid")) {
    return "table";
  }
  
  return "form";
};
