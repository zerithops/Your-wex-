
import React, { useState, useEffect, useRef } from 'react';
import { Persona, ChatMessage, CHAT_THEMES } from '../types.ts';
import { generateReply } from '../services/geminiService.ts';

interface Props {
  persona: Persona;
  onEdit: () => void;
  onUpdateHistory: (history: ChatMessage[]) => void;
  onToggleSidebar: () => void;
}

const ChatSession: React.FC<Props> = ({ persona, onEdit, onUpdateHistory, onToggleSidebar }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(persona.history);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const theme = CHAT_THEMES[persona.themeId] || CHAT_THEMES.default;

  useEffect(() => {
    setMessages(persona.history);
  }, [persona.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    onUpdateHistory(messages);
  }, [messages]);

  const handleIncomingMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'incoming',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
    triggerAutoReply(input, [...messages, newMessage]);
  };

  const triggerAutoReply = async (incoming: string, currentHistory: ChatMessage[]) => {
    setIsGenerating(true);
    // Use last 10 messages for better context adherence
    const context = currentHistory.slice(-10).map(m => `${m.role === 'incoming' ? 'Partner' : persona.name}: ${m.text}`);
    
    try {
      const reply = await generateReply(persona.style, incoming, context);
      const aiResponse: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'outgoing',
        text: reply,
        timestamp: Date.now(),
        isAiGenerated: true
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'outgoing',
        text: "DNA mismatch detected. Adjusting mirror frequencies...",
        timestamp: Date.now(),
        isError: true
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearChat = () => {
    if (confirm("Purge mirror memory?")) {
      setMessages([]);
    }
  };

  return (
    <div className={`flex flex-col h-full w-full max-w-4xl mx-auto relative ${theme.bgClass} transition-colors duration-700`}>
      {/* Special Theme Background Effects */}
      {persona.themeId === 'love' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-10 left-10 text-rose-500 animate-bounce delay-75">❤️</div>
          <div className="absolute top-40 right-20 text-pink-500 animate-pulse delay-150">💖</div>
          <div className="absolute bottom-20 left-1/4 text-red-400 animate-bounce delay-300 text-xs">✨</div>
          <div className="absolute top-1/2 right-10 text-rose-400 animate-pulse delay-500">💕</div>
        </div>
      )}

      <header className="px-6 py-6 md:py-8 flex justify-between items-center border-b border-white/5 glass sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onToggleSidebar} className="p-3 glass rounded-2xl text-slate-400 md:hidden transition-transform active:scale-90">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          
          <div className="relative group" onClick={onEdit}>
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-blue-500 transition-all cursor-pointer">
              {persona.profileImage ? (
                <img src={persona.profileImage} className="w-full h-full object-cover" alt={persona.name} />
              ) : (
                <div className="w-full h-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-black text-2xl">{persona.name.charAt(0)}</div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-slate-950"></div>
          </div>

          <div>
            <h2 className="font-black text-xl tracking-tight text-white font-['Space_Grotesk']">{persona.name}</h2>
            <p className={`text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-500 ${isGenerating ? 'text-blue-400 animate-pulse' : 'text-green-500'}`}>
              {isGenerating ? 'Mirroring Personality...' : 'Identity Locked'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={clearChat} title="Clear Session" className="p-3 text-slate-500 hover:text-red-500 transition-all active:scale-90 hover:bg-red-500/5 rounded-xl">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
          <button onClick={onEdit} className="cyber-btn px-5 py-3 bg-white/5 text-[10px] rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95 border border-white/5">Configure DNA</button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-12 space-y-12 no-scrollbar scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-10 animate-in fade-in zoom-in duration-1000 opacity-40">
            <div className="w-24 h-24 glass rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/10 animate-float">
              <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Identity Mirror Online</p>
            <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-slate-600">Awaiting Signal from Partner</p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'incoming' ? 'justify-start' : 'justify-end'} group animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-3xl px-6 py-4 text-sm relative transition-all duration-500 ${
              m.role === 'incoming' 
                ? 'bg-slate-900 text-slate-200 border border-white/5 rounded-bl-none shadow-xl' 
                : m.isError
                  ? 'bg-red-900/40 text-red-400 border border-red-500/30 rounded-br-none'
                  : `${theme.bubbleClass} rounded-br-none shadow-2xl`
            }`}>
              <p className="leading-relaxed font-medium">{m.text}</p>
              <div className={`absolute -bottom-6 text-[9px] text-slate-600 uppercase font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${m.role === 'incoming' ? 'left-0' : 'right-0'}`}>
                {m.role === 'incoming' ? 'Partner Signal' : `${persona.name} (Mirror)`} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-br-none px-6 py-4 flex items-center gap-4">
              <div className="flex gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]" /><div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" /><div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]" /></div>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Synthesizing Identity</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 md:p-10 glass border-t border-white/5">
        <form onSubmit={handleIncomingMessage} className="relative glass rounded-[2rem] p-3 border border-white/10 group focus-within:border-blue-500 transition-all duration-500">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Simulate incoming signal..." className="w-full bg-transparent px-6 py-4 focus:outline-none text-sm font-bold placeholder:text-slate-600 pr-32 text-white" />
          <button type="submit" disabled={!input.trim() || isGenerating} className="cyber-btn absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-500 disabled:opacity-30 transition-all active:scale-95 shadow-xl shadow-blue-600/30">Reply</button>
        </form>
        <div className="flex justify-between items-center mt-6 px-4">
          <p className="text-[9px] text-slate-700 uppercase tracking-[0.5em] font-black">Mirror Protocol Alpha // Identity: {persona.name}</p>
          <div className="flex gap-1"><div className="w-1 h-1 bg-blue-900 rounded-full"></div><div className="w-1 h-1 bg-blue-900 rounded-full"></div></div>
        </div>
      </div>
    </div>
  );
};

export default ChatSession;
