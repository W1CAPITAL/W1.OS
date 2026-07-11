"use client";

import { useState, useEffect } from "react";
import { Save, Trash2, FileText, ChevronLeft } from "lucide-react";

export default function Notepad() {
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("vanquish_note");
    if (saved) setContent(saved);
  }, []);

  const save = () => {
    localStorage.setItem("vanquish_note", content);
    setLastSaved(new Date());
  };

  return (
    <div className="h-full flex flex-col text-text-primary font-light">
      <div className="h-12 bg-surface flex items-center justify-between px-4 border-b border-white/5">
        <div className="flex gap-4">
          <button className="text-[10px] uppercase tracking-widest text-text-secondary hover:text-accent-gold transition-colors">File</button>
          <button className="text-[10px] uppercase tracking-widest text-text-secondary hover:text-accent-gold transition-colors">Edit</button>
          <button className="text-[10px] uppercase tracking-widest text-text-secondary hover:text-accent-gold transition-colors">Format</button>
        </div>
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-[8px] text-text-secondary opacity-40 uppercase tracking-widest">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={save}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-green/20 text-accent-gold text-[10px] uppercase tracking-widest border border-accent-gold/20 hover:bg-accent-green/40 transition-all"
          >
            <Save size={14} /> Save
          </button>
        </div>
      </div>
      
      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none p-8 font-mono text-sm leading-relaxed resize-none no-scrollbar placeholder:text-text-secondary/10"
        placeholder="START TRANSCRIBING INTELLIGENCE..."
      />
    </div>
  );
}