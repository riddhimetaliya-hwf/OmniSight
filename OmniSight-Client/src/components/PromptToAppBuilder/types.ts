
export type AppComponent = 'button' | 'input' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'table' | 'card' | 'form';
export type AppActionType = 'submit' | 'save' | 'cancel' | 'export' | 'import' | 'email' | 'print' | 'approve' | 'reject';
export type AppType = 'form' | 'dashboard' | 'workflow' | 'report' | 'table';

export interface AppField {
  id: string;
  type: AppComponent;
  label: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  defaultValue?: string | boolean;
  validation?: string;
}

export interface AppAction {
  id: string;
  type: AppActionType;
  label: string;
  primary?: boolean;
  onClick?: () => void;
}

export interface AppSection {
  id: string;
  title: string;
  fields: AppField[];
}

export interface AppDefinition {
  id: string;
  name: string;
  description: string;
  type: AppType;
  sections: AppSection[];
  actions: AppAction[];
  createdAt: string;
  updatedAt: string;
}

export interface PromptHistory {
  id: string;
  prompt: string;
  timestamp: Date;
  appId: string;
}

export interface PromptToAppContextType {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  generatedApp: AppDefinition | null;
  setGeneratedApp: (app: AppDefinition | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  promptHistory: PromptHistory[];
  addToHistory: (item: PromptHistory) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  showCode: boolean;
  setShowCode: (showCode: boolean) => void;
}
