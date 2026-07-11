"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@/store/os-store";
import LockScreen from "@/components/os/LockScreen";
import Desktop from "@/components/os/Desktop";

export default function Home() {
  const { isLocked, brightness } = useOSStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="h-screen w-screen overflow-hidden relative bg-black">
      {/* Global Brightness Overlay */}
      <motion.div 
        initial={false}
        animate={{ opacity: (100 - brightness) / 100 }}
        className="fixed inset-0 pointer-events-none z-[9999] bg-black"
        transition={{ duration: 0.5 }}
      />

      <AnimatePresence mode="wait">
        {isLocked ? (
          <LockScreen key="lock" />
        ) : (
          <Desktop key="desktop" />
        )}
      </AnimatePresence>

      {/* System Scanline / Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9000] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </main>
  );
}