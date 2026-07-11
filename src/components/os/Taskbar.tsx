"use client";

import { useOSStore } from "@/store/os-store";
import { LayoutGrid, Wifi, Battery, Volume2, Search, Bell, Monitor, Bluetooth, WifiOff } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Taskbar() {
  const { 
    toggleStartMenu, toggleActionCenter, 
    activeWindows, focusWindow, focusedWindowId, 
    wifiConnected, isBluetoothOn, volume, networks 
  } = useOSStore();
  const [time, setTime] = useState(new Date());

  const activeNet = networks.find(n => n.status === 'connected');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] h-16 glass rounded-2xl flex items-center justify-between px-2 z-[2000] border border-white/5 shadow-luxury">
      {/* Start & Pinned */}
      <div className="flex items-center gap-1 h-full">
        <button 
          onClick={toggleStartMenu}
          className="h-12 w-12 flex items-center justify-center hover:bg-white/10 transition-all rounded-xl group relative overflow-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-accent-green flex items-center justify-center border border-accent-gold/40 group-active:scale-90 transition-transform">
            <LayoutGrid size={20} className="text-accent-gold" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <div className="w-px h-8 bg-white/10 mx-2" />

        <div className="flex items-center gap-2">
          {activeWindows.map(win => (
            <button
              key={win.id}
              onClick={() => focusWindow(win.id)}
              className={`h-12 px-4 flex items-center gap-3 rounded-xl transition-all relative group ${focusedWindowId === win.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="text-accent-gold scale-90 group-hover:scale-100 transition-transform">
                {win.icon === 'browser' && <Search size={18} />}
                {win.icon === 'explorer' && <Monitor size={18} />}
                {win.icon === 'settings' && <LayoutGrid size={18} />}
                {win.icon === 'notepad' && <Search size={18} />}
                {win.icon === 'calc' && <LayoutGrid size={18} />}
                {!['browser','explorer','settings','notepad','calc'].includes(win.icon) && win.title.charAt(0).toUpperCase()}
              </div>
              <span className="hidden lg:block text-[9px] uppercase tracking-widest text-text-primary/70 font-light">{win.title}</span>
              
              {focusedWindowId === win.id && (
                <motion.div 
                  layoutId="taskbar-indicator"
                  className="absolute bottom-1 left-4 right-4 h-0.5 bg-accent-green rounded-full shadow-[0_0_10px_rgba(26,60,52,1)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2 h-full pr-2">
        <div className="hidden md:flex items-center gap-4 px-4 h-12 bg-white/5 rounded-xl border border-white/5 mr-2">
          <Search size={16} className="text-text-secondary/40" />
          <input 
            type="text" 
            placeholder="SYSTEM COMMANDS..." 
            className="bg-transparent border-none outline-none text-[10px] tracking-[0.2em] w-32 text-text-primary placeholder:text-text-secondary/20"
          />
        </div>

        <button 
          onClick={toggleActionCenter}
          className="flex items-center gap-4 px-5 h-12 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
        >
          <div className="flex items-center gap-4 text-text-secondary/60">
            <div className="relative">
              <Volume2 size={18} className={volume === 0 ? "text-red-500" : ""} />
              {volume > 0 && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent-green rounded-full" />}
            </div>
            
            <div className="relative" title={activeNet?.name || "No Connection"}>
              {wifiConnected ? <Wifi size={18} className="text-accent-gold" /> : <WifiOff size={18} className="text-text-secondary/20" />}
            </div>

            <Bluetooth size={18} className={isBluetoothOn ? "text-blue-400" : "text-text-secondary/20"} />
            
            <Battery size={18} className="text-accent-green/80" />
          </div>
          <div className="flex flex-col items-end justify-center font-display leading-tight">
            <span className="text-[11px] font-bold tracking-widest text-text-primary">{format(time, "HH:mm")}</span>
            <span className="text-[8px] text-text-secondary/40 uppercase tracking-tighter">{format(time, "EEE dd MMM")}</span>
          </div>
        </button>
        
        <button className="h-12 w-10 flex items-center justify-center hover:bg-white/5 rounded-xl text-text-secondary/40 hover:text-text-primary transition-all">
          <Bell size={18} />
        </button>
      </div>
    </div>
  );
}