
import React, { useState, useEffect } from 'react';
import { Persona } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import PersonaEditor from './components/PersonaEditor.tsx';
import ChatSession from './components/ChatSession.tsx';

const LoadingScreen: React.FC = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => (prev < 100 ? prev + 1 : 100));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[600px] h-[600px] border border-blue-500/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute w-[450px] h-[450px] border border-dashed border-indigo-500/20 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>
      </div>

      <div className="relative scale-110">
        <svg className="absolute -inset-12 w-56 h-56 md:w-64 md:h-64 -rotate-90 opacity-40" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-500/20" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="283" strokeDashoffset={283 - (283 * percent) / 100} strokeLinecap="round" className="text-blue-500 transition-all duration-300 ease-out" />
        </svg>

        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.15)] overflow-hidden animate-float">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10"></div>
          <div className="flex flex-col items-center z-10">
            <span className="text-5xl md:text-7xl font-black tracking-tighter text-white font-['Space_Grotesk'] leading-none glitch-text">YE</span>
            <div className="h-0.5 w-10 bg-blue-500 mt-2 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      
      <div className="mt-20 text-center space-y-6 z-10">
        <div className="overflow-hidden">
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.5em] text-white uppercase font-['Space_Grotesk'] animate-reveal-text">Your Ex?</h1>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-300 ease-out" style={{ width: `${percent}%` }} />
          </div>
          <p className="text-[10px] text-blue-400/80 uppercase tracking-[0.4em] font-black font-['JetBrains_Mono']">
            {percent < 30 ? 'Allocating Neural Buffers...' : percent < 60 ? 'Decrypting Style Vectors...' : percent < 90 ? 'Applying Visual Themes...' : 'Mirror Active.'}
          </p>
        </div>
      </div>

      <style>{`@keyframes scan { 0% { top: -5%; } 100% { top: 105%; } }`}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);
  const [view, setView] = useState<'dashboard' | 'editor' | 'chat'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ye_personas');
      if (saved) {
        setPersonas(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load state from storage", e);
    }
    const timer = setTimeout(() => setIsLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (personas.length > 0) {
      localStorage.setItem('ye_personas', JSON.stringify(personas));
    }
  }, [personas]);

  const activePersona = personas.find(p => p.id === activePersonaId) || null;

  const handleCreatePersona = () => {
    const newPersona: Persona = {
      id: crypto.randomUUID(),
      name: "New Identity",
      themeId: 'default',
      style: {
        id: crypto.randomUUID(),
        name: "New Style",
        languageMix: "",
        sentenceStructure: "",
        slangAndWords: [],
        emojiUsage: { types: [], frequency: 'Rare' },
        tone: "",
        punctuation: "",
        lastAnalysisDate: Date.now(),
      },
      history: []
    };
    setPersonas([...personas, newPersona]);
    setActivePersonaId(newPersona.id);
    setView('editor');
    setIsSidebarOpen(false);
  };

  const handleUpdatePersona = (updated: Persona) => {
    setPersonas(personas.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeletePersona = (id: string) => {
    setPersonas(personas.filter(p => p.id !== id));
    if (activePersonaId === id) {
      setActivePersonaId(null);
      setView('dashboard');
    }
    setIsSidebarOpen(false);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden relative font-['Inter']">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <Sidebar personas={personas} activeId={activePersonaId} isOpen={isSidebarOpen} onSelect={(id) => { setActivePersonaId(id); setView('chat'); setIsSidebarOpen(false); }} onAdd={handleCreatePersona} onDashboard={() => { setView('dashboard'); setIsSidebarOpen(false); }} />
      <main className="flex-1 overflow-y-auto relative animate-in fade-in zoom-in-95 duration-700">
        {view === 'dashboard' && <Dashboard personas={personas} onToggleSidebar={() => setIsSidebarOpen(true)} onSelect={(id) => { setActivePersonaId(id); setView('chat'); }} onCreate={handleCreatePersona} />}
        {view === 'editor' && activePersona && <PersonaEditor persona={activePersona} onToggleSidebar={() => setIsSidebarOpen(true)} onSave={(updated) => { handleUpdatePersona(updated); setView('chat'); }} onCancel={() => setView('dashboard')} onDelete={() => handleDeletePersona(activePersona.id)} />}
        {view === 'chat' && activePersona && <ChatSession persona={activePersona} onToggleSidebar={() => setIsSidebarOpen(true)} onEdit={() => setView('editor')} onUpdateHistory={(history) => handleUpdatePersona({ ...activePersona, history })} />}
      </main>
    </div>
  );
};

export default App;
