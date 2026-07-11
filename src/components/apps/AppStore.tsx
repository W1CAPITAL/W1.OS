"use client";

import { useAppsStore } from "@/store/apps-store";
import { Search, ShoppingBag, Download, Star, ExternalLink, Zap, ShieldCheck, Cpu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AppStore() {
  const { installedApps, installApp } = useAppsStore();
  const [activeCategory, setActiveTab] = useState("Discover");

  const categories = ["Discover", "Productivity", "System", "Internet", "Hardware"];

  const storeItems = [
    { id: 'vscode', title: 'VS Code Web', category: 'Productivity', rating: 4.9, icon: 'code', description: 'Advanced code editing.' },
    { id: 'figma', title: 'Figma Mirror', category: 'Productivity', rating: 4.8, icon: 'figma', description: 'Collaborative design.' },
    { id: 'ai-studio', title: 'Ollama AML Studio', category: 'Hardware', rating: 5.0, icon: 'cpu', description: 'Local LLM Orchestration.' },
    { id: 'spotify', title: 'Spotify AML', category: 'Internet', rating: 4.7, icon: 'music', description: 'Luxury audio streaming.' },
  ];

  return (
    <div className="h-full flex flex-col bg-surface overflow-hidden">
      {/* Header */}
      <div className="h-24 bg-black/40 border-b border-white/10 flex items-center justify-between px-12 shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center border border-accent/40 shadow-[0_0_20px_rgba(201,162,39,0.2)]">
            <ShoppingBag size={24} className="text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-light uppercase tracking-[0.3em]">Vanquish Store</h1>
            <p className="text-[9px] text-accent tracking-[0.4em] uppercase mt-1">Expanding the Ecosystem</p>
          </div>
        </div>

        <div className="w-96 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/40 group-focus-within:text-accent transition-colors" size={16} />
          <input 
            type="text"
            placeholder="SEARCH VAULT APPLICATIONS..."
            className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-12 pr-4 text-[10px] tracking-[0.2em] outline-none focus:border-accent/40 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-64 border-r border-white/5 p-8 flex flex-col gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "w-full text-left px-5 py-3 rounded-xl text-[10px] tracking-[0.3em] uppercase transition-all",
                activeCategory === cat ? "bg-primary/20 text-accent font-bold" : "text-text-secondary hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}

          <div className="mt-auto p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[9px] uppercase tracking-widest text-emerald-500 font-bold">AML Verified</span>
            </div>
            <p className="text-[8px] text-text-secondary/60 leading-relaxed uppercase tracking-tighter">
              Every app in the Vanquish Vault is signed by AML Private Keys.
            </p>
          </div>
        </div>

        {/* Store Grid */}
        <div className="flex-1 p-12 overflow-y-auto no-scrollbar bg-background/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
             {storeItems.map(item => {
               const isInstalled = installedApps.some(a => a.id === item.id);
               return (
                 <div key={item.id} className="p-8 rounded-3xl glass border border-white/5 hover:border-accent/20 transition-all group flex flex-col h-72">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent/40 transition-colors">
                          {item.id === 'ai-studio' ? <Cpu className="text-accent" size={32} /> : <Zap className="text-accent" size={32} />}
                       </div>
                       <div className="flex items-center gap-2 text-accent">
                          <Star size={12} fill="currentColor" />
                          <span className="text-[10px] font-bold">{item.rating}</span>
                       </div>
                    </div>
                    
                    <h3 className="text-sm uppercase tracking-widest font-bold mb-2">{item.title}</h3>
                    <p className="text-[9px] text-text-secondary/60 uppercase tracking-widest mb-auto leading-relaxed">{item.description}</p>
                    
                    <div className="mt-8 flex items-center justify-between">
                       <span className="text-[9px] uppercase tracking-[0.2em] text-accent/60 font-bold">{item.category}</span>
                       <button 
                         disabled={isInstalled}
                         className={cn(
                           "px-6 py-2.5 rounded-lg text-[9px] uppercase tracking-widest font-bold transition-all flex items-center gap-3",
                           isInstalled ? "bg-white/5 text-text-secondary cursor-default" : "bg-accent text-background hover:scale-105 active:scale-95 shadow-lg shadow-accent/10"
                         )}
                       >
                          {isInstalled ? 'Installed' : <><Download size={14} /> Install</>}
                       </button>
                    </div>
                 </div>
               );
             })}
          </div>

          {/* Section: Drivers & Support */}
          <div className="mt-20">
             <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold text-accent">Hardware & Drivers</h2>
                <span className="text-[9px] text-text-secondary opacity-40 uppercase tracking-widest">Connect to Hardware Manufacturers</span>
             </div>
             <div className="grid grid-cols-2 gap-6">
                {[
                  { name: 'NVIDIA Drivers', vendor: 'NVIDIA AML Studio' },
                  { name: 'AMD Radeon Core', vendor: 'AML Graphics' },
                  { name: 'DirectML Engine', vendor: 'Microsoft Partner' },
                  { name: 'Ollama Local Integration', vendor: 'AI Layer' },
                ].map(driver => (
                  <div key={driver.name} className="p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                     <div>
                       <p className="text-[10px] uppercase tracking-widest font-bold">{driver.name}</p>
                       <p className="text-[8px] text-text-secondary/40 uppercase mt-1 tracking-tighter">{driver.vendor}</p>
                     </div>
                     <ExternalLink size={14} className="text-text-secondary/40" />
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}