"use client";

import { useFileSystemStore } from "@/store/filesystem-store";
import { Folder, FileText, ChevronRight, LayoutGrid, List, Plus, Trash2, Clock, Star, HardDrive } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function FileManager() {
  const { items, currentPathId, navigateTo, createItem, deleteItem } = useFileSystemStore();

  const currentItems = items.filter(i => i.parentId === currentPathId);
  const currentPath = []; // Breadcrumb logic could be expanded here

  return (
    <div className="h-full flex bg-surface text-text-primary overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-black/20 border-r border-white/5 p-6 flex flex-col gap-8 shrink-0">
        <div className="space-y-2">
          <h4 className="text-[9px] uppercase tracking-[0.4em] text-accent/40 px-2 mb-4">Location Vault</h4>
          <button 
            onClick={() => navigateTo(null)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-[10px] tracking-[0.2em] uppercase",
              currentPathId === null ? "bg-primary/20 text-accent border border-accent/20" : "text-text-secondary hover:bg-white/5"
            )}
          >
            <HardDrive size={16} /> Vanquish Root
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-text-secondary hover:bg-white/5 transition-all text-[10px] tracking-[0.2em] uppercase">
            <Clock size={16} /> Recent Scans
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-text-secondary hover:bg-white/5 transition-all text-[10px] tracking-[0.2em] uppercase">
            <Star size={16} /> Encrypted
          </button>
        </div>

        <div className="mt-auto">
          <div className="p-5 glass-accent rounded-2xl border border-accent/10">
            <p className="text-[9px] uppercase tracking-widest text-accent font-bold mb-2">System Capacity</p>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[35%]" />
            </div>
            <p className="text-[8px] text-text-secondary/50 mt-2 tracking-widest">35.2 GB / 1.0 TB USED</p>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 flex flex-col bg-background/30">
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-text-secondary">
            <span>Home</span>
            <ChevronRight size={14} className="opacity-30" />
            <span className="text-accent">Vanquish_OS</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => createItem("New Folder", "folder", currentPathId)}
              className="p-2 hover:bg-white/5 rounded-lg text-text-secondary transition-colors"
            >
              <Plus size={18} />
            </button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <button className="p-2 hover:bg-white/5 rounded-lg text-accent transition-colors"><LayoutGrid size={18}/></button>
            <button className="p-2 hover:bg-white/5 rounded-lg text-text-secondary transition-colors"><List size={18}/></button>
          </div>
        </div>

        <div className="flex-1 p-8 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-8 content-start overflow-y-auto no-scrollbar">
          {currentItems.map(item => (
            <div 
              key={item.id}
              className="flex flex-col items-center gap-4 p-5 rounded-3xl hover:bg-white/5 transition-all group relative border border-transparent hover:border-white/5"
              onDoubleClick={() => item.type === 'folder' ? navigateTo(item.id) : null}
            >
              <div className="relative">
                {item.type === 'folder' ? (
                  <Folder size={52} className="text-accent/60 group-hover:text-accent group-hover:scale-110 transition-all duration-500" />
                ) : (
                  <FileText size={52} className="text-text-secondary/40 group-hover:text-text-primary transition-all duration-500" />
                )}
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest font-medium mb-1 truncate w-24">{item.name}</p>
                <p className="text-[8px] text-text-secondary/40 uppercase tracking-tighter">
                  {format(item.updatedAt, "MMM d, HH:mm")}
                </p>
              </div>
            </div>
          ))}

          {currentItems.length === 0 && (
            <div className="col-span-full h-[60vh] flex flex-col items-center justify-center opacity-10 gap-6">
              <Folder size={120} strokeWidth={1} />
              <p className="text-[12px] tracking-[0.5em] uppercase">This vault is currently empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}