"use client";

import { motion } from "framer-motion";
import { useOSStore, Window as WindowType } from "@/store/os-store";
import { X, Minus, Square, Maximize2 } from "lucide-react";
import Browser from "../apps/Browser";
import FileExplorer from "../apps/FileExplorer";
import Settings from "../apps/Settings";
import Notepad from "../apps/Notepad";
import Calculator from "../apps/Calculator";

export default function Window(props: WindowType) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, focusedWindowId } = useOSStore();

  const renderContent = () => {
    switch (props.id) {
      case 'browser': return <Browser />;
      case 'explorer': return <FileExplorer />;
      case 'settings': return <Settings />;
      case 'notepad': return <Notepad />;
      case 'calc': return <Calculator />;
      default: return <div className="p-8 font-light uppercase tracking-widest text-xs opacity-50 text-white">Engine Offline</div>;
    }
  };

  const isFocused = focusedWindowId === props.id;

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0, y: 20 }}
      animate={{ 
        scale: props.isMinimized ? 0.9 : 1, 
        opacity: props.isMinimized ? 0 : 1,
        y: props.isMinimized ? 100 : 0,
        width: props.isMaximized ? "100%" : props.size.width,
        height: props.isMaximized ? "calc(100vh - 80px)" : props.size.height,
        x: props.isMaximized ? 0 : props.position.x,
        y: props.isMaximized ? 0 : props.position.y,
        pointerEvents: props.isMinimized ? "none" : "auto",
      }}
      drag={!props.isMaximized}
      dragMomentum={false}
      onMouseDown={() => focusWindow(props.id)}
      style={{ zIndex: props.zIndex }}
      className={`absolute flex flex-col glass rounded-2xl overflow-hidden shadow-luxury border transition-all duration-300 ${isFocused ? 'border-accent-gold/40 ring-1 ring-accent-gold/10' : 'border-white/10'}`}
    >
      {/* Title Bar */}
      <div 
        className="h-12 bg-surface/98 border-b border-white/5 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing select-none shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-accent-green shadow-[0_0_8px_rgba(26,60,52,1)]' : 'bg-white/10'}`} />
          <span className="text-[9px] tracking-[0.3em] uppercase text-text-primary/80 font-medium">{props.title}</span>
        </div>
        
        <div className="flex items-center gap-1" onMouseDown={e => e.stopPropagation()}>
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(props.id); }}
            className="w-10 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-text-secondary transition-colors"
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); maximizeWindow(props.id); }}
            className="w-10 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-text-secondary transition-colors"
          >
            {props.isMaximized ? <Square size={12} className="text-accent-gold" /> : <Maximize2 size={12} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(props.id); }}
            className="w-10 h-8 flex items-center justify-center hover:bg-red-500/60 hover:text-white rounded-lg text-text-secondary transition-all"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-hidden relative bg-bg-deep/20 backdrop-blur-2xl">
        {renderContent()}
      </div>
    </motion.div>
  );
}