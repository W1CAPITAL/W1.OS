"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Home, ShieldCheck, Search, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Browser() {
  const [url, setUrl] = useState("https://www.google.com/search?igu=1");
  const [inputUrl, setInputUrl] = useState("https://www.google.com");
  const [tabs, setTabs] = useState([{ id: 1, title: 'Google', url: 'https://www.google.com' }]);
  const [activeTabId, setActiveTabId] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl.trim();
    if (!target) return;
    
    if (!target.startsWith("http")) {
      if (target.includes(".")) {
        target = "https://" + target;
      } else {
        target = `https://www.google.com/search?q=${encodeURIComponent(target)}&igu=1`;
      }
    }
    
    setUrl(target);
    setInputUrl(target);
  };

  return (
    <div className="h-full flex flex-col bg-surface overflow-hidden">
      {/* Tab Bar */}
      <div className="flex bg-black/40 px-2 pt-2 gap-1 overflow-x-auto no-scrollbar border-b border-white/5">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-t-xl text-[10px] tracking-widest uppercase transition-all cursor-pointer min-w-[140px] border-x border-t",
              activeTabId === tab.id ? "bg-surface border-white/10 text-accent" : "bg-transparent border-transparent text-text-secondary opacity-50 hover:bg-white/5"
            )}
            onClick={() => setActiveTabId(tab.id)}
          >
            <Globe size={12} />
            <span className="truncate flex-1">{tab.title}</span>
            <X size={10} className="hover:text-red-400" />
          </div>
        ))}
        <button className="p-2 text-text-secondary hover:text-accent transition-colors">
          <Plus size={14} />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="h-14 bg-surface flex items-center px-4 gap-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-white/5 rounded-xl text-text-secondary transition-all"><ArrowLeft size={16} /></button>
          <button className="p-2 hover:bg-white/5 rounded-xl text-text-secondary transition-all"><ArrowRight size={16} /></button>
          <button onClick={() => setUrl(prev => prev + " ")} className="p-2 hover:bg-white/5 rounded-xl text-text-secondary transition-all"><RotateCw size={16} /></button>
          <button onClick={() => { setUrl("https://www.google.com/search?igu=1"); setInputUrl("https://www.google.com"); }} className="p-2 hover:bg-white/5 rounded-xl text-text-secondary transition-all"><Home size={16} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 h-10 bg-black/40 rounded-xl flex items-center px-5 gap-3 border border-white/5 focus-within:border-accent/40 transition-all shadow-inner group">
          <ShieldCheck size={14} className="text-emerald-500" />
          <input 
            type="text" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="bg-transparent border-none outline-none text-[10px] w-full font-light tracking-[0.2em] placeholder:text-text-secondary/20 text-text-primary"
            placeholder="ENTER SECURE AML GATEWAY OR URL..."
          />
        </form>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-accent text-[9px] uppercase tracking-[0.2em] border border-accent/20">
          <Search size={14} /> Intelligence
        </div>
      </div>

      {/* Content Viewport */}
      <div className="flex-1 relative bg-white">
        <iframe 
          src={url} 
          className="w-full h-full border-none"
          title="Aston Secure Browser"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  );
}

import { Globe } from "lucide-react";