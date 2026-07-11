"use client";

import { useState } from "react";
import { Folder, FileText, ChevronRight, LayoutGrid, List, Search, Clock, Star, HardDrive } from "lucide-react";

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState(["Root"]);
  
  const folders = [
    { name: "Documents", items: 12 },
    { name: "Models", items: 4 },
    { name: "Vanquish_Engine", items: 89 },
    { name: "Design_Assets", items: 23 },
    { name: "Telemetry_Logs", items: 156 }
  ];

  return (
    <div className="h-full flex text-text-primary font-light">
      {/* Sidebar */}
      <div className="w-56 bg-surface/60 border-r border-white/5 p-4 flex flex-col gap-6">
        <div className="space-y-1">
          <h4 className="text-[9px] uppercase tracking-[0.3em] text-accent-gold/40 px-2 mb-2">Navigation</h4>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-accent-green/20 text-accent-gold text-xs"><Clock size={16}/> Recent</button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-text-secondary text-xs"><Star size={16}/> Favorites</button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-text-secondary text-xs"><HardDrive size={16}/> Vanquish Drive</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-xs text-text-secondary uppercase tracking-widest">
            {currentPath.map((p, i) => (
              <span key={i} className="flex items-center gap-2">
                {i !== 0 && <ChevronRight size={12} />}
                <span className={i === currentPath.length - 1 ? "text-accent-gold" : ""}>{p}</span>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/5 rounded-lg text-text-secondary"><LayoutGrid size={16}/></button>
            <button className="p-2 hover:bg-white/5 rounded-lg text-text-secondary"><List size={16}/></button>
          </div>
        </div>

        <div className="flex-1 p-6 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4 content-start">
          {folders.map(f => (
            <button key={f.name} className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group">
              <Folder size={40} className="text-accent-gold/60 group-hover:text-accent-gold transition-colors" />
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider mb-1">{f.name}</p>
                <p className="text-[8px] text-text-secondary opacity-40">{f.items} ITEMS</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}