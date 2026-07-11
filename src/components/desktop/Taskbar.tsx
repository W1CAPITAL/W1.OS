"use client";

import { motion } from "framer-motion";
import { useOSStore } from "@/store/os-store";
import { useWindowsStore } from "@/store/windows-store";
import { 
  LayoutGrid, Wifi, Volume2, Battery, 
  Search, Bluetooth, Bell, ChevronUp,
  Terminal, Globe, Folder, Settings, ShoppingBag, Calculator, FileText
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const iconMap: any = {
  terminal: Terminal,
  globe: Globe,
  folder: Folder,
  settings: Settings,
  'shopping-bag': ShoppingBag,
  calculator: Calculator,
  'file-text': FileText
};

export default function Taskbar() {
  const { toggleStartMenu, volume, toggleActionCenter } = useOSStore();
  const { activeWindows, focusedWindowId, focusWindow } = useWindowsStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] h-16 glass rounded-2xl flex items-center justify-between px-3 z-[3000] border border-white/10 shadow-luxury overflow-hidden">
      <div className="absolute inset-0 carbon-fiber opacity-10 pointer-events-none" />
      
      {/* Left: Start & Pinned */}
      <div className="flex items-center gap-1.5 h-full relative z-10">
        <button 
          onClick={toggleStartMenu}
          className="h-12 w-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all group active:scale-95"
        >
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center border border-accent/30 group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all">
            <LayoutGrid size={20} className="text-accent" />
          </div>
        </button>

        <div className="w-px h-8 bg-white/10 mx-2" />

        <div className="flex items-center gap-1">
          {activeWindows.map(win => {
            const Icon = iconMap[win.appId] || Search;
            const isFocused = focusedWindowId === win.id;
            
            return (
              <button
                key={win.id}
                onClick={() => focusWindow(win.id)}
                className={cn(
                  "h-12 w-12 flex items-center justify-center rounded-xl transition-all relative group",
                  isFocused ? "bg-white/10 shadow-inner" : "hover:bg-white/5"
                )}
                title={win.title}
              >
                <div className={cn(
                  "transition-all duration-300",
                  isFocused ? "text-accent scale-110" : "text-text-secondary scale-100"
                )}>
                  <Icon size={20} />
                </div>
                {isFocused && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute bottom-1 w-5 h-0.5 bg-accent rounded-full shadow-[0_0_10px_#C9A227]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Center: Search simulation */}
      <div className="hidden lg:flex items-center gap-3 px-5 h-12 bg-white/5 rounded-xl border border-white/5 relative z-10 w-96 max-w-md group focus-within:border-accent/40 transition-all">
        <Search size={16} className="text-text-secondary/40 group-focus-within:text-accent/60" />
        <input 
          type="text" 
          placeholder="SEARCH AML ECOSYSTEM..." 
          className="bg-transparent border-none outline-none text-[10px] tracking-[0.2em] w-full text-text-primary placeholder:text-text-secondary/20"
        />
      </div>

      {/* Right: System Tray */}
      <div className="flex items-center gap-1.5 h-full relative z-10">
        <button 
          onClick={toggleActionCenter}
          className="flex items-center gap-4 px-5 h-12 hover:bg-white/10 rounded-xl transition-all"
        >
          <div className="flex items-center gap-4 text-text-secondary/70">
            <Bluetooth size={16} className="text-blue-400" />
            <Wifi size={16} className="text-accent" />
            <div className="relative">
              <Volume2 size={16} />
              {volume > 0 && <div className="absolute -top-1 -right-1 w-1 h-1 bg-accent rounded-full" />}
            </div>
            <Battery size={16} className="text-emerald-500" />
          </div>
          <div className="flex flex-col items-end justify-center leading-none">
            <span className="text-[11px] font-bold tracking-widest text-text-primary uppercase">{format(time, "HH:mm")}</span>
            <span className="text-[8px] text-text-secondary/50 uppercase tracking-tighter mt-1">{format(time, "EEE d MMM")}</span>
          </div>
        </button>

        <div className="w-px h-8 bg-white/10 mx-1" />
        
        <button className="h-12 w-10 flex items-center justify-center hover:bg-white/5 rounded-xl text-text-secondary/40 hover:text-accent transition-all">
          <Bell size={18} />
        </button>
      </div>
    </div>
  );
}