"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/store/os-store";
import { useAppsStore } from "@/store/apps-store";
import { useWindowsStore } from "@/store/windows-store";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import WindowManager from "./WindowManager";
import DesktopIcon from "./DesktopIcon";
import ContextMenu from "./ContextMenu";
import { useState, useEffect } from "react";

export default function Desktop() {
  const { wallpaper, brightness, isStartMenuOpen, powerStatus } = useOSStore();
  const { installedApps } = useAppsStore();
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || powerStatus === 'off') return <div className="h-screen w-screen bg-black" />;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="h-full w-full relative flex flex-col p-4 bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      {/* Global Filter Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] bg-black transition-opacity duration-500"
        style={{ opacity: (100 - brightness) / 100 }}
      />

      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      <div className="scanline" />

      {/* Desktop Icons */}
      <div className="flex-1 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-6 content-start items-start z-10 relative">
        {installedApps.slice(0, 8).map(app => (
          <DesktopIcon key={app.id} app={app} />
        ))}
      </div>

      <WindowManager />
      <StartMenu />
      <Taskbar />

      <AnimatePresence>
        {contextMenu && (
          <ContextMenu x={contextMenu.x} y={contextMenu.y} />
        )}
      </AnimatePresence>
    </div>
  );
}