"use client";

import { useOSStore } from "@/store/os-store";
import { 
  Wifi, Bluetooth, Monitor, Shield, ChevronRight, 
  Moon, Sun, Palette, Zap, Volume2, Info, HardDrive, Cpu
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { brightness, setBrightness, volume, setVolume, wallpaper } = useOSStore();
  const [activeTab, setActiveTab] = useState("Display");

  const menu = [
    { id: "Display", icon: Monitor },
    { id: "Network", icon: Wifi },
    { id: "Bluetooth", icon: Bluetooth },
    { id: "System", icon: Cpu },
    { id: "Security", icon: Shield },
    { id: "About", icon: Info },
  ];

  return (
    <div className="h-full flex bg-surface text-text-primary overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-black/20 border-r border-white/5 p-8 flex flex-col gap-2 shrink-0">
        <h1 className="text-[11px] font-bold tracking-[0.4em] uppercase text-accent/60 mb-8 px-4 underline underline-offset-8">AML Console</h1>
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all text-[10px] tracking-[0.2em] uppercase border",
              activeTab === item.id 
                ? "bg-primary/20 text-accent border-accent/20 shadow-lg shadow-primary/5" 
                : "text-text-secondary border-transparent hover:bg-white/5"
            )}
          >
            <item.icon size={18} />
            {item.id}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-16 overflow-y-auto no-scrollbar bg-background/20 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-4xl uppercase tracking-[0.5em] mb-16 font-extralight text-text-primary underline underline-offset-[16px] decoration-accent/20">
              {activeTab}
            </h2>

            {activeTab === "Display" && (
              <div className="space-y-16 max-w-2xl">
                <div className="space-y-8">
                  <div className="flex justify-between text-[11px] uppercase tracking-[0.3em] text-accent font-bold px-2">
                    <span>Master Luminance</span>
                    <span>{brightness}%</span>
                  </div>
                  <div className="bg-white/5 p-10 rounded-3xl border border-white/10 flex items-center gap-10">
                    <Moon size={24} className="text-text-secondary/30" />
                    <input 
                      type="range"
                      min="10"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="flex-1 accent-accent h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                    <Sun size={24} className="text-text-secondary/30" />
                  </div>
                </div>

                <div className="space-y-8">
                   <div className="flex justify-between text-[11px] uppercase tracking-[0.3em] text-accent font-bold px-2">
                    <span>Wallpaper Engine</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div 
                      className="aspect-video rounded-2xl border-2 border-accent/40 bg-cover bg-center cursor-pointer overflow-hidden ring-4 ring-primary/20"
                      style={{ backgroundImage: `url(${wallpaper})` }}
                    />
                    <div className="bg-white/5 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-[9px] uppercase tracking-widest text-text-secondary hover:bg-white/10 transition-all cursor-pointer">
                      Import Custom Visual
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Network" && (
              <div className="space-y-10 max-w-2xl">
                <div className="p-10 rounded-3xl glass-accent flex items-center justify-between border border-accent/10 shadow-2xl">
                  <div className="flex items-center gap-8">
                    <div className="p-5 rounded-2xl bg-primary/30 text-accent border border-accent/20">
                      <Wifi size={32} />
                    </div>
                    <div>
                      <h4 className="text-sm uppercase tracking-[0.2em] font-light">Wireless Gateway</h4>
                      <p className="text-[10px] text-text-secondary/60 mt-1 uppercase tracking-widest">Status: Connected to VANQUISH_EXT_6</p>
                    </div>
                  </div>
                  <div className="w-16 h-8 rounded-full bg-primary relative p-1 cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-accent ml-auto" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-accent/40 px-4 mb-4">Secured Vaults</h4>
                  {[
                    { name: 'VANQUISH_EXT_6', strength: '100%', secured: true },
                    { name: 'AML_GUEST_LOUNGE', strength: '85%', secured: true },
                    { name: 'AIRPORT_MCLAREN_HATE', strength: '60%', secured: true },
                  ].map(net => (
                    <div key={net.name} className="p-6 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 flex items-center justify-between cursor-pointer group transition-all">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-text-secondary group-hover:text-accent transition-colors">{net.name}</span>
                      <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-text-secondary/40 font-mono">
                        {net.strength} signal
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "About" && (
              <div className="max-w-2xl space-y-12">
                <div className="flex items-center gap-10">
                   <div className="w-32 h-32 rounded-3xl glass-accent flex items-center justify-center border-2 border-accent/30 rotate-3">
                      <LayoutGrid size={64} className="text-accent" />
                   </div>
                   <div>
                     <h3 className="text-3xl font-light uppercase tracking-[0.3em]">Aston Martin Linux</h3>
                     <p className="text-[11px] text-accent tracking-[0.5em] mt-2 uppercase font-bold">Vanquish Edition v10.5.0</p>
                     <p className="text-[10px] text-text-secondary/50 mt-4 leading-relaxed max-w-sm uppercase tracking-widest">
                       The pinnacle of luxury computing environments. Designed for engineers who appreciate high-performance aesthetics.
                     </p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
                    <HardDrive className="text-accent mb-4" size={20} />
                    <p className="text-[9px] uppercase tracking-widest text-text-secondary/40">Kernel Version</p>
                    <p className="text-xs uppercase tracking-widest font-bold mt-1">6.8.0-vanquish-generic</p>
                  </div>
                  <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
                    <Zap className="text-accent mb-4" size={20} />
                    <p className="text-[9px] uppercase tracking-widest text-text-secondary/40">System Architecture</p>
                    <p className="text-xs uppercase tracking-widest font-bold mt-1">x86_64 High-Luxury</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

import { LayoutGrid } from "lucide-react";