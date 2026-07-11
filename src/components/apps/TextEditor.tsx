"use client";

import { useState } from "react";
import { Save, Trash2, FileText, ChevronLeft, Share2, Printer } from "lucide-react";

export default function TextEditor() {
  const [content, setContent] = useState("START TRANSCRIBING SYSTEM LOGS...");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const save = () => {
    localStorage.setItem("aml_last_note", content);
    setLastSaved(new Date());
  };

  return (
    <div className="h-full flex flex-col bg-surface text-text-primary overflow-hidden">
      {/* Menu Bar */}
      <div className="h-14 bg-black/40 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
        <div className="flex gap-6">
          {['File', 'Edit', 'Format', 'View'].map(m => (
            <button key={m} className="text-[10px] uppercase tracking-[0.3em] text-text-secondary hover:text-accent transition-colors">
              {m}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 text-text-secondary hover:text-accent transition-colors"><Share2 size={16} /></button>
          <button className="p-2 text-text-secondary hover:text-accent transition-colors"><Printer size={16} /></button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <button 
            onClick={save}
            className="flex items-center gap-3 px-5 py-2 rounded-xl bg-primary/20 text-accent text-[10px] uppercase tracking-[0.2em] border border-accent/20 hover:bg-primary/40 transition-all font-bold"
          >
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>
      
      {/* Editor Surface */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-12 bg-black/20 border-r border-white/5 flex flex-col items-center py-8 gap-4 text-[9px] font-mono text-text-secondary/20">
          {Array.from({length: 40}).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none p-10 font-mono text-xs leading-[2] resize-none no-scrollbar placeholder:text-text-secondary/10 selection:bg-accent selection:text-background"
          spellCheck={false}
        />
      </div>

      {/* Footer Info */}
      <div className="h-10 bg-black/40 border-t border-white/10 flex items-center justify-between px-8 text-[8px] uppercase tracking-[0.4em] text-text-secondary/30 shrink-0">
        <div className="flex gap-6">
           <span>UTF-8 ENCODING</span>
           <span>LN: 1, COL: 1</span>
        </div>
        <span>{lastSaved ? `LAST AUTO-SAVE: ${lastSaved.toLocaleTimeString()}` : 'READY FOR INPUT'}</span>
      </div>
    </div>
  );
}