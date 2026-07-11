"use client";

import { motion } from "framer-motion";
import { useOSStore } from "@/store/os-store";
import React from "react";

interface DesktopIconProps {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export default function DesktopIcon({ id, title, icon }: DesktopIconProps) {
  const { openApp } = useOSStore();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onDoubleClick={() => openApp(id, title, id)}
      className="flex flex-col items-center gap-2 p-2 rounded-xl transition-all hover:bg-white/5 group w-24"
    >
      <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center border border-accent-gold/10 group-hover:border-accent-gold/40 transition-all shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="relative z-10 scale-110">
          {icon}
        </div>
      </div>
      <span className="text-[9px] font-medium tracking-[0.1em] uppercase text-text-primary drop-shadow-md text-center line-clamp-2">
        {title}
      </span>
    </motion.button>
  );
}