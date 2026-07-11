"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/store/os-store";
import { useWindowsStore } from "@/store/windows-store";
import { useAppsStore } from "@/store/apps-store";
import { 
  Terminal, Globe, Folder, Settings, ShoppingBag, 
  Calculator, FileText, Power, LogOut, RefreshCcw, 
  Moon, User, Search, ChevronRight
} from "lucide-react";
import { useState } from "react";
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

export default function StartMenu() {
  const { isStartMenuOpen, toggleStartMenu, lock, setPowerStatus } = useOSStore();
  const { openWindow } = useWindowsStore();
  const { installedApps } = useAppsStore();
  const [search, setSearch] = useState("");

  const filteredApps = installedApps.filter(app => 
    app.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <motion.div
          initial={{ y: "20%", opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: "20%", opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-24 left-10 w-[600px] h-[720px] glass rounded-3xl z-[2500] overflow-hidden flex flex-col shadow-luxury border border-white/10"
        >
          <div className="absolute inset-0 carbon-fiber opacity-5 pointer-events-none" />

          {/* User Header */}
          <div className="p-8 flex items-center justify-between border-b border-white/5 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl glass-accent flex items-center justify-center border border-accent/20">
                <User size={32} className="text-accent" />
              </div>
              <div>
                <h3 className="text-sm tracking-[0.2em] uppercase text-text-primary font-light">Aston Martin Owner</h3>
                <p className="text-[10px] tracking-widest text-text-secondary mt-1 opacity-50 uppercase">AML SYSTEM CONCIERGE</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={lock}
                className="p-3 hover:bg-white/5 text-text-secondary hover:text-accent rounded-xl transition-all"
                title="Lock Session"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-8 pt-6 pb-2 relative z-10">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/40 group-focus-within:text-accent transition-colors" size={16} />
              <input 
                type="text"
                autoFocus
                placeholder="LAUNCH APPLICATIONS..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl h-14 pl-12 pr-4 text-[10px] tracking-[0.3em] outline-none focus:border-accent/40 focus:bg-white/10 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* App Grid */}
          <div className="flex-1 p-8 overflow-y-auto no-scrollbar relative z-10">
            <div className="grid grid-cols-4 gap-6">
              {filteredApps.map(app => {
                const Icon = iconMap[app.icon] || Search;
                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      openWindow(app.id, app.title);
                      toggleStartMenu();
                    }}
                    className="flex flex-col items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-accent/30 group-hover:bg-primary/20 transition-all relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                      <Icon size={24} className="text-accent group-hover:scale-110 transition-transform relative z-10" />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-text-secondary text-center group-hover:text-text-primary">
                      {app.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {search && filteredApps.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4 mt-20">
                <Search size={48} />
                <p className="text-[10px] tracking-widest uppercase">No matches found in AML vault</p>
              </div>
            )}
          </div>

          {/* Footer Power Controls */}
          <div className="p-6 bg-primary/10 border-t border-white/5 flex items-center justify-between relative z-10">
            <div className="flex gap-4">
              <button 
                onClick={() => setPowerStatus('off')}
                className="p-3 text-text-secondary hover:text-red-500 transition-colors"
                title="Shut Down"
              >
                <Power size={20} />
              </button>
              <button 
                className="p-3 text-text-secondary hover:text-accent transition-colors"
                title="Restart"
              >
                <RefreshCcw size={20} />
              </button>
              <button 
                className="p-3 text-text-secondary hover:text-accent transition-colors"
                title="Sleep"
              >
                <Moon size={20} />
              </button>
            </div>
            <div className="text-right">
              <span className="text-[8px] tracking-[0.5em] text-accent/40 uppercase block font-bold">Vanquish Core v10.5</span>
              <span className="text-[7px] text-text-secondary/30 uppercase tracking-[0.2em]">Build 2026.07.AML</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}