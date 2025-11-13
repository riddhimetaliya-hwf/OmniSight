
export type CommandType = 'navigation' | 'function' | 'ai-query' | 'export';

export interface CommandItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
  type: CommandType;
  keywords: string[];
  action: string | (() => void);
  category: string;
}

export interface CommandShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
}
