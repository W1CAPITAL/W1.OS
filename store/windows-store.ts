import { create } from 'zustand';

export interface WindowInstance {
  id: string;
  title: string;
  appId: string; // references specific app component
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WindowsState {
  activeWindows: WindowInstance[];
  focusedWindowId: string | null;
  maxZIndex: number;

  openWindow: (appId: string, title: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
}

export const useWindowsStore = create<WindowsState>((set, get) => ({
  activeWindows: [],
  focusedWindowId: null,
  maxZIndex: 10,

  openWindow: (appId, title) => {
    const { activeWindows, maxZIndex } = get();
    const existing = activeWindows.find(w => w.appId === appId);
    
    if (existing) {
      get().focusWindow(existing.id);
      if (existing.isMinimized) {
        set({
          activeWindows: activeWindows.map(w => w.id === existing.id ? { ...w, isMinimized: false } : w)
        });
      }
      return;
    }

    const id = Math.random().toString(36).substring(7);
    const newZ = maxZIndex + 1;
    const newWindow: WindowInstance = {
      id,
      title,
      appId,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZ,
      position: { x: 150 + (activeWindows.length * 40), y: 100 + (activeWindows.length * 40) },
      size: { width: 900, height: 600 }
    };

    set({
      activeWindows: [...activeWindows, newWindow],
      focusedWindowId: id,
      maxZIndex: newZ
    });
  },

  closeWindow: (id) => set(state => ({
    activeWindows: state.activeWindows.filter(w => w.id !== id),
    focusedWindowId: state.focusedWindowId === id ? null : state.focusedWindowId
  })),

  focusWindow: (id) => {
    const { activeWindows, maxZIndex, focusedWindowId } = get();
    if (focusedWindowId === id) return;

    const newZ = maxZIndex + 1;
    set({
      focusedWindowId: id,
      maxZIndex: newZ,
      activeWindows: activeWindows.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w)
    });
  },

  minimizeWindow: (id) => set(state => ({
    activeWindows: state.activeWindows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
    focusedWindowId: state.focusedWindowId === id ? null : state.focusedWindowId
  })),

  maximizeWindow: (id) => set(state => ({
    activeWindows: state.activeWindows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
  })),

  updatePosition: (id, x, y) => set(state => ({
    activeWindows: state.activeWindows.map(w => w.id === id ? { ...w, position: { x, y } } : w)
  })),

  updateSize: (id, width, height) => set(state => ({
    activeWindows: state.activeWindows.map(w => w.id === id ? { ...w, size: { width, height } } : w)
  }))
}));