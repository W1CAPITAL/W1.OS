import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppMetadata {
  id: string;
  title: string;
  icon: string;
  category: 'Internet' | 'System' | 'Utilities' | 'Productivity' | 'Development';
  installed: boolean;
  description: string;
}

interface OSState {
  isLocked: boolean;
  wallpaper: string;
  brightness: number;
  volume: number;
  isStartMenuOpen: boolean;
  isActionCenterOpen: boolean;
  powerStatus: 'on' | 'sleep' | 'off';
  
  // Actions
  unlock: () => void;
  lock: () => void;
  setWallpaper: (url: string) => void;
  setBrightness: (val: number) => void;
  setVolume: (val: number) => void;
  toggleStartMenu: () => void;
  toggleActionCenter: () => void;
  setPowerStatus: (status: 'on' | 'sleep' | 'off') => void;
}

export const useOSStore = create<OSState>()(
  persist(
    (set) => ({
      isLocked: false,
      wallpaper: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=2560',
      brightness: 100,
      volume: 80,
      isStartMenuOpen: false,
      isActionCenterOpen: false,
      powerStatus: 'on',

      unlock: () => set({ isLocked: false }),
      lock: () => set({ isLocked: true, isStartMenuOpen: false }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setBrightness: (brightness) => set({ brightness }),
      setVolume: (volume) => set({ volume }),
      toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen, isActionCenterOpen: false })),
      toggleActionCenter: () => set((state) => ({ isActionCenterOpen: !state.isActionCenterOpen, isStartMenuOpen: false })),
      setPowerStatus: (powerStatus) => set({ powerStatus }),
    }),
    { name: 'aml-os-core' }
  )
);