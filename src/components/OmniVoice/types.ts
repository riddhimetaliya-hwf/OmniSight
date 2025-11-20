
export interface Voice {
  name: string;
  lang: string;
}

export interface VoiceCommandResult {
  success: boolean;
  message: string;
  action?: string;
}

export interface VoicePreferences {
  enabled: boolean;
  wakeWord: string;
  voice: Voice;
  volume: number;
}
