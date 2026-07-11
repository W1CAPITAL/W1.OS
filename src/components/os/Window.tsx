"use client";

import { motion } from "framer-motion";
import { useOSStore, Window as WindowType } from "@/store/os-store";
import { X, Minus, Square, Maximize2 } from "lucide-react";
import Browser from "../apps/Browser";
import FileExplorer from "../apps/FileExplorer";
import Settings from "../apps/Settings";
import Notepad from "../apps/Notepad";
import Calculator from "../apps/Calculator";
import { useRef } from "react";

export default function Window(props: WindowType) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, focusedWindowId } = useOSStore();
  const constraintsRef = useRef(null);

  const renderContent = () => {
    switch (props.id) {
      case 'browser': return <Browser />;
      case 'explorer': return <FileExplorer />;
      case 'settings': return <Settings />;
      case 'notepad': return <Notepad />;
      case 'calc': return <Calculator />;
      default: return <div className="p-8 font-light uppercase tracking-widest text-xs opacity-50">Application Engine Offline</div>;
    }
  };

  const isFocused = focusedWindowId === props.id;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 40 }}
      animate={{ 
        scale: props.isMinimized ? 0.8 : 1, 
        opacity: props.isMinimized ? 0 : 1,
        y: props.isMinimized ? 200 : 0,
        width: props.isMaximized ? "100%" : props.size.width,
        height: props.isMaximized ? "calc(100vh - 80px)" : props.size.height,
        x: props.isMaximized ? 0 : props.position.x,
        y: props.isMaximized ? 0 : props.position.y,
        pointerEvents: props.isMinimized ? "none" : "auto",
      }}
      drag={!props.isMaximized}
      dragMomentum={false}
      dragListener={false}
      dragControls={undefined}
      onMouseDown={() => focusWindow(props.id)}
      style={{ zIndex: props.zIndex }}
      className={`absolute flex flex-col glass rounded-2xl overflow-hidden shadow-luxury border transition-shadow duration-300 ${isFocused ? 'border-accent-gold/50 shadow-[0_0_30px_rgba(26,60,52,0.3)]' : 'border-white/10'}`}
    >
      {/* Title Bar */}
      <div 
        onPointerDown={(e) => {}} // Placeholder for drag start
        className="h-12 bg-surface/95 border-b border-white/5 flex items-center justify-between px-4 cursor-default select-none"
      >
        <div className="flex items-center gap-3 flex-1 h-full">
          <div className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-accent-green animate-pulse' : 'bg-white/10'}`} />
          <span className="text-[10px] tracking-[0.3em] uppercase text-text-primary/90 font-medium">{props.title}</span>
        </div>
        
        <div className="flex items-center gap-1">
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
            className="w-10 h-8 flex items-center justify-center hover:bg-red-500/80 hover:text-white rounded-lg text-text-secondary transition-all"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-hidden bg-bg-deep/30 backdrop-blur-xl relative">
        {renderContent()}
      </div>

      {/* Resize Handles (Simplified) */}
      {!props.isMaximized && (
        <>
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50" />
          <div className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize" />
          <div className="absolute right-0 top-0 h-full w-1 cursor-ew-resize" />
        </>
      )}
    </motion.div>
  );
}
