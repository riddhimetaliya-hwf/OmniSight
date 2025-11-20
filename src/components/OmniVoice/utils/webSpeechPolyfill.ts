
// Define the SpeechRecognition interface that might be missing in TypeScript
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Define the SpeechRecognition constructor
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}

// Add types for the Web Speech API that might be missing in TypeScript
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

// Export a function to check if Web Speech API is supported
export function isSpeechRecognitionSupported(): boolean {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

// Export a function to get the appropriate SpeechRecognition constructor
export function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }
  
  return window.SpeechRecognition || window.webkitSpeechRecognition;
}

// Export a function to check if Speech Synthesis is supported
export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window;
}

// Get available voices
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) {
    return [];
  }
  
  return window.speechSynthesis.getVoices();
}

// Get a preferred voice based on locale and gender
export function getPreferredVoice(locale: string = 'en-US', preferFemale: boolean = true): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  
  if (voices.length === 0) {
    return null;
  }
  
  // Try to find a matching voice by locale and gender hint
  const matchingVoice = voices.find(voice => {
    const isLocaleMatch = voice.lang.includes(locale.split('-')[0]);
    const isGenderMatch = preferFemale 
      ? voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('samantha')
      : voice.name.toLowerCase().includes('male');
    
    return isLocaleMatch && isGenderMatch;
  });
  
  if (matchingVoice) {
    return matchingVoice;
  }
  
  // Fallback to just locale match
  const localeMatch = voices.find(voice => voice.lang.includes(locale.split('-')[0]));
  
  if (localeMatch) {
    return localeMatch;
  }
  
  // Last resort, just return the first voice
  return voices[0];
}

export default {
  isSpeechRecognitionSupported,
  getSpeechRecognition,
  isSpeechSynthesisSupported,
  getAvailableVoices,
  getPreferredVoice
};
