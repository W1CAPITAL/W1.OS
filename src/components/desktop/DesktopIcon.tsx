"use client";

import { motion } from "framer-motion";
import { useWindowsStore } from "@/store/windows-store";
import { AppMetadata } from "@/store/os-store";
import { 
  Terminal, Globe, Folder, Settings, ShoppingBag, 
  Calculator, FileText, Search
} from "lucide-react";

const iconMap: any = {
  terminal: Terminal,
  globe: Globe,
  folder: Folder,
  settings: Settings,
  'shopping-bag': ShoppingBag,
  calculator: Calculator,
  'file-text': FileText
};

export default function DesktopIcon({ app }: { app: AppMetadata }) {
  const { openWindow } = useWindowsStore();
  const Icon = iconMap[app.icon] || Search;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onDoubleClick={() => openWindow(app.id, app.title)}
      className="flex flex-col items-center gap-3 p-3 rounded-2xl transition-all hover:bg-white/5 group w-24"
    >
      <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-accent/40 group-hover:shadow-[0_0_20px_rgba(201,162,39,0.1)] transition-all overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="relative z-10 scale-110">
          <Icon className="text-accent group-hover:scale-110 transition-transform duration-500" size={24} />
        </div>
      </div>
      <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-text-primary drop-shadow-lg text-center line-clamp-2 leading-tight">
        {app.title}
      </span>
    </motion.button>
  );
}