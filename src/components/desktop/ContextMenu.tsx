"use client";

import { motion } from "framer-motion";
import { 
  Plus, RefreshCw, Palette, Settings, Monitor, 
  Terminal, FolderPlus, Image as ImageIcon, Shield
} from "lucide-react";
import { useWindowsStore } from "@/store/windows-store";

export default function ContextMenu({ x, y }: { x: number, y: number }) {
  const { openWindow } = useWindowsStore();

  const items = [
    { label: "Open Terminal", icon: Terminal, action: () => openWindow('terminal', 'AML Terminal') },
    { label: "New System Folder", icon: FolderPlus, divider: true },
    { label: "Refresh Environment", icon: RefreshCw },
    { label: "Change AML Wallpaper", icon: ImageIcon, action: () => openWindow('settings', 'AML Console') },
    { label: "Personalize UX", icon: Palette, divider: true },
    { label: "System Config", icon: Settings, action: () => openWindow('settings', 'AML Console') },
    { label: "AML Security Vault", icon: Shield },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed glass rounded-2xl border border-white/10 py-3 w-64 z-[5000] shadow-luxury overflow-hidden"
      style={{ left: x, top: y }}
    >
      <div className="absolute inset-0 carbon-fiber opacity-5 pointer-events-none" />
      
      {items.map((item, i) => (
        <div key={i}>
          <button 
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-primary/30 text-left transition-all group"
            onClick={item.action}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-text-primary group-hover:text-accent transition-colors">{item.label}</span>
            <item.icon className="text-text-secondary/40 group-hover:text-accent transition-all group-hover:scale-110" size={14} />
          </button>
          {item.divider && <div className="h-px bg-white/5 my-1.5 mx-4" />}
        </div>
      ))}
    </motion.div>
  );
}