
import React from 'react';
import { Persona } from '../types.ts';

interface Props {
  personas: Persona[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  onToggleSidebar: () => void;
}

const Dashboard: React.FC<Props> = ({ personas, onSelect, onCreate, onToggleSidebar }) => {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-16 animate-in fade-in duration-1000">
      <header className="mb-20">
        <div className="flex items-center gap-4 mb-8 md:hidden">
          <button onClick={onToggleSidebar} className="p-3 glass rounded-xl text-slate-400 hover:text-white transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
          <span className="font-bold text-blue-400 uppercase tracking-[0.4em] text-[9px]">Interface Controller</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight font-['Space_Grotesk'] text-white">Stored Mirrors</h1>
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-16 bg-blue-600"></div>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Identity Database Alpha-01</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        <div onClick={onCreate} className="group relative h-72 glass rounded-[2.5rem] flex flex-col items-center justify-center gap-6 border border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-600/5 transition-all cursor-pointer overflow-hidden active:scale-[0.98]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-500"><svg className="w-8 h-8 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg></div>
          <span className="font-black text-xs uppercase tracking-[0.4em] text-slate-600 group-hover:text-white transition-colors">Clone Identity</span>
        </div>

        {personas.map(p => (
          <div key={p.id} onClick={() => onSelect(p.id)} className="group relative h-72 glass rounded-[2.5rem] p-10 flex flex-col hover:neon-border hover:-translate-y-3 transition-all duration-500 cursor-pointer overflow-hidden active:scale-[0.98] border border-white/5">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent opacity-0 group-hover:opacity-100 animate-[scan_2s_linear_infinite]" />

            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl group-hover:border-blue-500/50 transition-all duration-500">
                {p.profileImage ? <img src={p.profileImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl font-black text-slate-700 uppercase">{p.name.charAt(0)}</div>}
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 mb-1 block">Fidelity</span>
                <span className="text-[10px] font-black uppercase text-green-500 flex items-center gap-1.5 justify-end">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> 98.4%
                </span>
              </div>
            </div>
            
            <h3 className="text-2xl font-black mb-4 group-hover:text-blue-400 transition-colors truncate font-['Space_Grotesk'] tracking-tight text-white">{p.name}</h3>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
              {p.style.tone ? `Signal: ${p.style.tone}` : "Neural Profile Incomplete"}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-blue-500 transition-all">Link Established</span>
              <svg className="w-4 h-4 text-slate-700 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
