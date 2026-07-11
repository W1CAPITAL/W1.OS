"use client";

import { motion } from "framer-motion";
import { useWindowsStore, WindowInstance } from "@/store/windows-store";
import { X, Minus, Square, Maximize2 } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Dynamic App Loading
const TerminalApp = dynamic(() => import("../apps/Terminal"), { ssr: false });
const FileManagerApp = dynamic(() => import("../apps/FileManager"), { ssr: false });
const BrowserApp = dynamic(() => import("../apps/Browser"), { ssr: false });
const SettingsApp = dynamic(() => import("../apps/Settings"), { ssr: false });
const AppStoreApp = dynamic(() => import("../apps/AppStore"), { ssr: false });
const TextEditorApp = dynamic(() => import("../apps/TextEditor"), { ssr: false });
const CalculatorApp = dynamic(() => import("../apps/Calculator"), { ssr: false });

export default function Window(win: WindowInstance) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, focusedWindowId } = useWindowsStore();

  const isFocused = focusedWindowId === win.id;

  const renderApp = () => {
    switch (win.appId) {
      case 'terminal': return <TerminalApp />;
      case 'files': return <FileManagerApp />;
      case 'browser': return <BrowserApp />;
      case 'settings': return <SettingsApp />;
      case 'store': return <AppStoreApp />;
      case 'editor': return <TextEditorApp />;
      case 'calculator': return <CalculatorApp />;
      default: return <div className="p-10 text-center opacity-50 uppercase tracking-[0.3em] text-[10px]">App Engine Offline</div>;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ 
        scale: win.isMinimized ? 0.9 : 1,
        opacity: win.isMinimized ? 0 : 1,
        y: win.isMinimized ? 100 : 0,
        width: win.isMaximized ? "100%" : win.size.width,
        height: win.isMaximized ? "calc(100vh - 100px)" : win.size.height,
        x: win.isMaximized ? 0 : win.position.x,
        y: win.isMaximized ? 0 : win.position.y,
        pointerEvents: win.isMinimized ? "none" : "auto",
      }}
      drag={!win.isMaximized}
      dragMomentum={false}
      onMouseDown={() => focusWindow(win.id)}
      style={{ zIndex: win.zIndex }}
      className={cn(
        "absolute flex flex-col glass rounded-2xl overflow-hidden shadow-luxury border transition-all duration-300",
        isFocused ? "border-accent/40 ring-1 ring-accent/10" : "border-white/10 grayscale-[0.3] opacity-95"
      )}
    >
      {/* Title Bar */}
      <div className="h-12 bg-surface/90 border-b border-white/5 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing select-none shrink-0 relative">
        <div className="absolute inset-0 carbon-fiber opacity-5 pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full transition-all duration-500",
            isFocused ? "bg-accent shadow-[0_0_8px_#C9A227]" : "bg-white/10"
          )} />
          <span className="text-[9px] tracking-[0.3em] uppercase text-text-primary/70 font-light truncate max-w-[300px]">
            {win.title}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 relative z-10" onMouseDown={e => e.stopPropagation()}>
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
            className="w-9 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-text-secondary transition-colors"
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}
            className="w-9 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-text-secondary transition-colors"
          >
            {win.isMaximized ? <Square size={12} className="text-accent" /> : <Maximize2 size={12} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
            className="w-9 h-8 flex items-center justify-center hover:bg-red-500/60 hover:text-white rounded-lg text-text-secondary transition-all"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-hidden relative bg-background/50">
        {renderApp()}
      </div>
    </motion.div>
  );
}