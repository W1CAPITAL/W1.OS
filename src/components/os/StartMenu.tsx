"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/store/os-store";
import { Settings, Globe, Folder, Calculator, FileText, Power, LogOut, RefreshCcw, Moon, User } from "lucide-react";

export default function StartMenu() {
  const { isStartMenuOpen, openApp, lock } = useOSStore();

  const apps = [
    { id: 'browser', title: 'Aston Browser', icon: <Globe />, color: 'bg-blue-500/20' },
    { id: 'explorer', title: 'Vanquish Files', icon: <Folder />, color: 'bg-amber-500/20' },
    { id: 'notepad', title: 'Notepad', icon: <FileText />, color: 'bg-emerald-500/20' },
    { id: 'calc', title: 'Calculator', icon: <Calculator />, color: 'bg-purple-500/20' },
    { id: 'settings', title: 'Settings', icon: <Settings />, color: 'bg-slate-500/20' },
  ];

  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <motion.div
          initial={{ y: "100%", opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: "100%", opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-4 w-[500px] h-[600px] glass rounded-3xl z-[2500] overflow-hidden flex flex-col shadow-luxury border border-accent-gold/20"
        >
          {/* Header */}
          <div className="p-8 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent-green flex items-center justify-center border border-accent-gold/30">
                <User size={28} className="text-accent-gold" />
              </div>
              <div>
                <h3 className="text-sm tracking-[0.2em] uppercase text-text-primary">Vanquish Owner</h3>
                <p className="text-[10px] tracking-widest text-text-secondary">ASTON MARTIN CONCIERGE</p>
              </div>
            </div>
            <button 
              onClick={lock}
              className="p-3 hover:bg-red-500/20 text-text-secondary hover:text-red-500 rounded-xl transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* App Grid */}
          <div className="flex-1 p-8 grid grid-cols-3 gap-4 overflow-y-auto no-scrollbar">
            {apps.map(app => (
              <button
                key={app.id}
                onClick={() => openApp(app.id, app.title, app.id)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl ${app.color} flex items-center justify-center border border-white/5 group-hover:border-accent-gold/30 transition-all`}>
                  <div className="text-accent-gold group-hover:scale-110 transition-transform">
                    {app.icon}
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-text-secondary group-hover:text-text-primary">
                  {app.title}
                </span>
              </button>
            ))}
          </div>

          {/* Footer Controls */}
          <div className="p-6 bg-accent-green/10 flex items-center justify-between">
            <div className="flex gap-4">
              <button className="p-2 text-text-secondary hover:text-accent-gold transition-colors"><Power size={18} /></button>
              <button className="p-2 text-text-secondary hover:text-accent-gold transition-colors"><RefreshCcw size={18} /></button>
              <button className="p-2 text-text-secondary hover:text-accent-gold transition-colors"><Moon size={18} /></button>
            </div>
            <span className="text-[8px] tracking-[0.4em] text-accent-gold/40 uppercase">Vanquish Core v10.0</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}