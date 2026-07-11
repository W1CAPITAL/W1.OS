"use client";

import { motion } from "framer-motion";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import WindowManager from "./WindowManager";
import DesktopIcon from "./DesktopIcon";
import ContextMenu from "./ContextMenu";
import { Globe, Folder, Settings, Terminal, Calculator, FileText } from "lucide-react";
import { useState } from "react";

export default function Desktop() {
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full w-full relative flex flex-col p-4"
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=2000')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-bg-deep/20 pointer-events-none" />

      {/* Desktop Icons Grid */}
      <div className="flex-1 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-4 content-start items-start z-10">
        <DesktopIcon id="browser" title="Aston Browser" icon={<Globe className="text-accent-gold" />} />
        <DesktopIcon id="explorer" title="Vanquish Files" icon={<Folder className="text-accent-gold" />} />
        <DesktopIcon id="settings" title="Settings" icon={<Settings className="text-accent-gold" />} />
        <DesktopIcon id="notepad" title="Notepad" icon={<FileText className="text-accent-gold" />} />
        <DesktopIcon id="calc" title="Calculator" icon={<Calculator className="text-accent-gold" />} />
      </div>

      <WindowManager />
      <StartMenu />
      <Taskbar />
      
      {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} />}
    </motion.div>
  );
}