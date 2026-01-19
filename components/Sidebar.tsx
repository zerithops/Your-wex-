
import React from 'react';
import { Persona } from '../types.ts';

interface Props {
  personas: Persona[];
  activeId: string | null;
  isOpen: boolean;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDashboard: () => void;
}

const Sidebar: React.FC<Props> = ({ personas, activeId, isOpen, onSelect, onAdd, onDashboard }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-80 glass border-r border-white/5 flex flex-col h-full transition-all duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-8 flex flex-col h-full">
        <div onClick={onDashboard} className="flex items-center gap-4 cursor-pointer group mb-12">
          <div className="w-14 h-14 bg-blue-600 rounded-[1.2rem] flex items-center justify-center neon-border group-hover:bg-blue-500 transition-all duration-500 group-hover:rotate-6">
            <span className="text-xl font-black font-['Space_Grotesk'] text-white">YE</span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white font-['Space_Grotesk'] leading-none">Your Ex?</h1>
            <p className="text-[9px] uppercase tracking-[0.4em] font-black text-blue-500 mt-1.5">Identity Mirror</p>
          </div>
        </div>

        <button onClick={onAdd} className="cyber-btn w-full flex items-center justify-center gap-3 bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 py-5 rounded-2xl transition-all text-xs font-black uppercase tracking-[0.3em] mb-10 text-blue-400 hover:text-white active:scale-95 shadow-lg shadow-blue-600/5">
          New Signature
        </button>

        <nav className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
          <p className="text-[9px] uppercase tracking-[0.5em] text-slate-700 font-black mb-6 px-4">Stored Identities</p>
          {personas.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`w-full text-left px-4 py-4 rounded-2xl text-sm flex items-center justify-between transition-all group active:scale-[0.98] ${
                activeId === p.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20 border border-blue-400/30' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg overflow-hidden border ${activeId === p.id ? 'border-white/20' : 'border-white/5'}`}>
                  {p.profileImage ? <img src={p.profileImage} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/10 flex items-center justify-center text-[10px] font-black">{p.name.charAt(0)}</div>}
                </div>
                <span className="truncate font-bold tracking-tight">{p.name}</span>
              </div>
              <svg className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeId === p.id ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
          ))}
          {personas.length === 0 && <div className="px-4 py-10 text-center glass rounded-2xl border-dashed border-white/10 opacity-40"><p className="text-[9px] font-black uppercase tracking-[0.3em]">No Data</p></div>}
        </nav>

        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xs shadow-lg text-white">YE</div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            <div>
              <p className="text-xs font-black text-white tracking-tight uppercase">Ghost Link</p>
              <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Security: High</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
