"use client";

import { useState, useRef } from "react";
import { Globe, ArrowLeft, ArrowRight, RotateCw, Home, Search, ShieldCheck } from "lucide-react";

export default function Browser() {
  const [url, setUrl] = useState("https://www.astonmartin.com");
  const [inputValue, setInput] = useState(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputValue.trim();
    if (!target) return;
    if (!target.startsWith("http")) target = "https://" + target;
    setUrl(target);
    setInput(target);
  };

  const refresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  return (
    <div className="h-full flex flex-col text-text-primary font-light">
      {/* URL Bar */}
      <div className="h-14 bg-surface/90 flex items-center px-4 gap-6 border-b border-white/10">
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-white/5 rounded-xl text-text-secondary active:scale-90 transition-all"><ArrowLeft size={16} /></button>
          <button className="p-2 hover:bg-white/5 rounded-xl text-text-secondary active:scale-90 transition-all"><ArrowRight size={16} /></button>
          <button onClick={refresh} className="p-2 hover:bg-white/5 rounded-xl text-text-secondary active:scale-90 transition-all"><RotateCw size={16} /></button>
          <button onClick={() => { setUrl("https://www.google.com"); setInput("https://www.google.com"); }} className="p-2 hover:bg-white/5 rounded-xl text-text-secondary active:scale-90 transition-all"><Home size={16} /></button>
        </div>
        
        <form onSubmit={navigate} className="flex-1 h-10 glass-green rounded-2xl flex items-center px-5 gap-3 border border-white/5 group focus-within:border-accent-gold/30 transition-all shadow-inner">
          <ShieldCheck size={14} className="text-accent-green" />
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full font-light tracking-widest placeholder:text-text-secondary/20"
            placeholder="TYPE URL OR SEARCH INTELLIGENCE..."
          />
        </form>
      </div>

      {/* Viewport */}
      <div className="flex-1 bg-white relative">
        <iframe 
          ref={iframeRef}
          src={url} 
          className="w-full h-full border-none"
          title="Aston Browser Viewport"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
        {/* Security Overlay for Iframe Blockers */}
        <div className="absolute inset-0 pointer-events-none border-[12px] border-black/5" />
      </div>
      
      {/* Footer Info */}
      <div className="h-6 bg-surface/95 px-4 flex items-center justify-between border-t border-white/5 text-[8px] tracking-[0.2em] text-text-secondary/40 uppercase">
        <span>Secure Gateway Active</span>
        <span>Aston Martin Cloud CDN v4.2</span>
      </div>
    </div>
  );
}
