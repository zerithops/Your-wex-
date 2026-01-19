
import React, { useState, useRef } from 'react';
import { Persona, StyleProfile, CHAT_THEMES, ChatThemeId } from '../types.ts';
import { analyzeStyle } from '../services/geminiService.ts';

interface Props {
  persona: Persona;
  onSave: (updated: Persona) => void;
  onCancel: () => void;
  onDelete: () => void;
  onToggleSidebar: () => void;
}

const PersonaEditor: React.FC<Props> = ({ persona, onSave, onCancel, onDelete, onToggleSidebar }) => {
  const [name, setName] = useState(persona.name);
  const [images, setImages] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(persona.profileImage);
  const [themeId, setThemeId] = useState<ChatThemeId>(persona.themeId);
  const [analysisResult, setAnalysisResult] = useState<Partial<StyleProfile>>(persona.style);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const startAnalysis = async () => {
    if (images.length === 0 && !textInput) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeStyle(images, textInput, name);
      setAnalysisResult(result);
    } catch (err) {
      alert("Analysis failed. Verify connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSave = () => {
    onSave({
      ...persona,
      name,
      profileImage,
      themeId,
      style: {
        ...persona.style,
        ...analysisResult,
        lastAnalysisDate: Date.now()
      } as StyleProfile
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-12 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onToggleSidebar} className="p-2 bg-slate-900 border border-white/10 rounded-lg text-slate-400 md:hidden">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h2 className="text-3xl font-black tracking-tight font-['Space_Grotesk'] text-white">Identity Tuning</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onDelete} className="px-4 py-2 text-xs text-red-500 font-black uppercase tracking-widest hover:bg-red-500/10 rounded-xl transition-all">Delete</button>
          <button onClick={onCancel} className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Discard</button>
          <button onClick={handleFinalSave} className="px-6 py-3 bg-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Update Persona</button>
        </div>
      </div>

      <div className="space-y-10">
        {/* Core Identity */}
        <section className="glass p-8 rounded-3xl grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 items-center">
          <div className="relative group mx-auto">
            <div 
              onClick={() => avatarInputRef.current?.click()}
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-900 group-hover:border-blue-500 transition-all cursor-pointer shadow-2xl relative"
            >
              {profileImage ? (
                <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-4xl font-black text-slate-600">
                  {name.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
            </div>
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            <p className="text-[10px] text-center mt-3 text-slate-500 uppercase tracking-widest font-black group-hover:text-blue-400">Identity Image</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Display Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-colors text-sm font-medium" placeholder="Alice Smith" />
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3">Chat Environment Theme</label>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(CHAT_THEMES) as ChatThemeId[]).map(id => (
                  <button
                    key={id}
                    onClick={() => setThemeId(id)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      themeId === id ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/5 bg-white/5 text-slate-500 hover:text-white'
                    }`}
                  >
                    {CHAT_THEMES[id].name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Style Extraction */}
        <section className="glass p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-black font-['Space_Grotesk'] text-white">Extraction Protocol</h3>
            <div className="h-0.5 flex-1 bg-white/5"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Visual Signals (Screenshots)</label>
              <div onClick={() => fileInputRef.current?.click()} className="h-44 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleFileUpload} accept="image/*" />
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-all"><svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Sync Datasets</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">{images.map((img, i) => (
                <div key={i} className="relative w-12 h-12 group">
                  <img src={img} className="w-full h-full object-cover rounded-xl border border-white/10" />
                  <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}</div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Textual Forensics</label>
              <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} className="w-full h-44 bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-colors text-sm font-medium resize-none" placeholder="Paste partner messages..." />
            </div>
          </div>

          <button onClick={startAnalysis} disabled={isAnalyzing || (images.length === 0 && !textInput)} className="w-full mt-10 py-5 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/20 active:scale-[0.99]">
            {isAnalyzing ? "Processing Mirror DNA..." : "Engage Neural Analysis"}
          </button>
        </section>

        {Object.keys(analysisResult).length > 0 && (
          <section className="glass p-8 rounded-3xl border-l-4 border-blue-500 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-xl font-black font-['Space_Grotesk'] text-blue-400 mb-8 uppercase tracking-widest">Mirror Signature</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <ResultItem label="Linguistic Mix" value={analysisResult.languageMix} />
              <ResultItem label="Emotional Tone" value={analysisResult.tone} />
              <ResultItem label="Phonetic Structure" value={analysisResult.sentenceStructure} />
              <ResultItem label="Grammar Logic" value={analysisResult.punctuation} />
              <ResultItem label="Signature Dialect" value={analysisResult.slangAndWords?.join(', ')} />
              <ResultItem label="Emoji Index" value={`${analysisResult.emojiUsage?.frequency} (${analysisResult.emojiUsage?.types?.join(' ')})`} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const ResultItem = ({ label, value }: { label: string, value?: string }) => (
  <div className="group">
    <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600 font-black mb-1.5 group-hover:text-blue-500 transition-colors">{label}</p>
    <p className="text-slate-100 text-sm font-medium leading-relaxed">{value || "Waiting for signal..."}</p>
  </div>
);

export default PersonaEditor;
