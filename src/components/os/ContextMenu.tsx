"use client";

import { motion } from "framer-motion";
import { Plus, RefreshCw, Palette, Settings, Monitor } from "lucide-react";

export default function ContextMenu({ x, y }: { x: number, y: number }) {
  const items = [
    { label: "New Folder", icon: <Plus size={14} /> },
    { label: "Refresh Engine", icon: <RefreshCw size={14} /> },
    { label: "Personalize Atmos", icon: <Palette size={14} />, divider: true },
    { label: "Display Settings", icon: <Monitor size={14} /> },
    { label: "OS Settings", icon: <Settings size={14} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed glass rounded-xl border border-accent-gold/20 py-2 w-56 z-[3000] shadow-luxury"
      style={{ left: x, top: y }}
    >
      {items.map((item, i) => (
        <div key={i}>
          <button className="w-full flex items-center justify-between px-4 py-2 hover:bg-accent-green/30 text-left transition-colors">
            <span className="text-[10px] uppercase tracking-widest text-text-primary">{item.label}</span>
            <span className="text-accent-gold/40">{item.icon}</span>
          </button>
          {item.divider && <div className="h-px bg-white/5 my-1 mx-2" />}
        </div>
      ))}
    </motion.div>
  );
}