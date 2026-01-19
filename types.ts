
export type ChatThemeId = 'default' | 'messenger' | 'instagram' | 'cyberpunk' | 'midnight' | 'emerald' | 'sunset' | 'love' | 'ghost';

export interface ChatTheme {
  id: ChatThemeId;
  name: string;
  bubbleClass: string;
  bgClass: string;
  accentColor: string;
}

export interface StyleProfile {
  id: string;
  name: string;
  languageMix: string;
  sentenceStructure: string;
  slangAndWords: string[];
  emojiUsage: {
    types: string[];
    frequency: 'Rare' | 'Moderate' | 'High';
  };
  tone: string;
  punctuation: string;
  lastAnalysisDate: number;
}

export interface ChatMessage {
  id: string;
  role: 'incoming' | 'outgoing';
  text: string;
  timestamp: number;
  isAiGenerated?: boolean;
  isError?: boolean;
}

export interface Persona {
  id: string;
  name: string;
  profileImage?: string; // Base64 string
  themeId: ChatThemeId;
  style: StyleProfile;
  history: ChatMessage[];
}

export const CHAT_THEMES: Record<ChatThemeId, ChatTheme> = {
  default: {
    id: 'default',
    name: 'Classic Noir',
    bubbleClass: 'bg-blue-600 text-white',
    bgClass: 'bg-slate-950',
    accentColor: '#3b82f6'
  },
  messenger: {
    id: 'messenger',
    name: 'Messenger',
    bubbleClass: 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white',
    bgClass: 'bg-slate-950',
    accentColor: '#0084ff'
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    bubbleClass: 'bg-gradient-to-r from-purple-600 to-blue-500 text-white',
    bgClass: 'bg-slate-950',
    accentColor: '#e1306c'
  },
  love: {
    id: 'love',
    name: 'Love',
    bubbleClass: 'bg-gradient-to-r from-rose-500 via-pink-500 to-red-400 text-white shadow-lg shadow-rose-500/20',
    bgClass: 'bg-slate-950',
    accentColor: '#f43f5e'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    bubbleClass: 'bg-yellow-400 text-black font-black',
    bgClass: 'bg-black',
    accentColor: '#facc15'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    bubbleClass: 'bg-slate-800 text-slate-100 border border-white/10',
    bgClass: 'bg-slate-950',
    accentColor: '#1e293b'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    bubbleClass: 'bg-emerald-600 text-white',
    bgClass: 'bg-slate-950',
    accentColor: '#10b981'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    bubbleClass: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white',
    bgClass: 'bg-slate-950',
    accentColor: '#f59e0b'
  },
  ghost: {
    id: 'ghost',
    name: 'Ghost',
    bubbleClass: 'bg-slate-100 text-slate-900 font-bold border-2 border-slate-900',
    bgClass: 'bg-white',
    accentColor: '#0f172a'
  }
};
