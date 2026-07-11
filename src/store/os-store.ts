import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Window {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
}

export interface WiFiNetwork {
  id: string;
  name: string;
  strength: number;
  status: 'connected' | 'available' | 'connecting';
}

export interface BluetoothDevice {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'pairing';
}

interface OSState {
  isLocked: boolean;
  isStartMenuOpen: boolean;
  isActionCenterOpen: boolean;
  activeWindows: Window[];
  focusedWindowId: string | null;
  
  // Hardware States
  brightness: number;
  volume: number;
  wifiConnected: boolean;
  isBluetoothOn: boolean;
  lockPassword: string;
  
  // WiFi & Bluetooth Lists
  networks: WiFiNetwork[];
  btDevices: BluetoothDevice[];

  // Actions
  unlock: () => void;
  lock: () => void;
  toggleStartMenu: () => void;
  toggleActionCenter: () => void;
  openApp: (id: string, title: string, icon: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  setBrightness: (val: number) => void;
  setVolume: (val: number) => void;
  toggleWifi: () => void;
  toggleBluetooth: () => void;
  connectToWiFi: (networkId: string) => void;
  toggleBTDevice: (deviceId: string) => void;
  setPassword: (pwd: string) => void;
}

export const useOSStore = create<OSState>()(
  persist(
    (set) => ({
      isLocked: true,
      isStartMenuOpen: false,
      isActionCenterOpen: false,
      activeWindows: [],
      focusedWindowId: null,
      brightness: 100,
      volume: 70,
      wifiConnected: true,
      isBluetoothOn: true,
      lockPassword: "",

      networks: [
        { id: 'v_ext', name: 'VANQUISH_GATEWAY_6', strength: 100, status: 'connected' },
        { id: 'am_vip', name: 'AM_VIP_LOUNGE', strength: 80, status: 'available' },
        { id: 'perf_grid', name: 'Performance_Grid', strength: 60, status: 'available' },
      ],

      btDevices: [
        { id: 'db12', name: 'Aston Martin DB12', status: 'connected' },
        { id: 'headphones', name: 'Vanquish Wireless Headset', status: 'disconnected' },
        { id: 'iphone', name: 'iPhone 16 Pro', status: 'disconnected' },
        { id: 'kb', name: 'Magic Performance Keyboard', status: 'disconnected' },
      ],

      unlock: () => set({ isLocked: false }),
      lock: () => set({ isLocked: true, isStartMenuOpen: false }),
      toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen, isActionCenterOpen: false })),
      toggleActionCenter: () => set((state) => ({ isActionCenterOpen: !state.isActionCenterOpen, isStartMenuOpen: false })),
      
      openApp: (id, title, icon) => set((state) => {
        const existing = state.activeWindows.find(w => w.id === id);
        if (existing) {
          const maxZ = Math.max(0, ...state.activeWindows.map(w => w.zIndex));
          return { 
            focusedWindowId: id, 
            isStartMenuOpen: false,
            activeWindows: state.activeWindows.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: maxZ + 1 } : w)
          };
        }
        const maxZ = Math.max(0, ...state.activeWindows.map(w => w.zIndex));
        const newWindow: Window = {
          id, title, icon,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: maxZ + 1,
          position: { x: 100 + (state.activeWindows.length * 40), y: 50 + (state.activeWindows.length * 40) },
          size: { width: 800, height: 500 }
        };
        return {
          activeWindows: [...state.activeWindows, newWindow],
          focusedWindowId: id,
          isStartMenuOpen: false
        };
      }),

      closeWindow: (id) => set((state) => ({
        activeWindows: state.activeWindows.filter(w => w.id !== id),
        focusedWindowId: state.focusedWindowId === id ? null : state.focusedWindowId
      })),

      minimizeWindow: (id) => set((state) => ({
        activeWindows: state.activeWindows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
        focusedWindowId: null
      })),

      maximizeWindow: (id) => set((state) => ({
        activeWindows: state.activeWindows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
      })),

      focusWindow: (id) => set((state) => {
        const maxZ = Math.max(0, ...state.activeWindows.map(w => w.zIndex));
        return {
          focusedWindowId: id,
          activeWindows: state.activeWindows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w)
        };
      }),

      updateWindowPosition: (id, x, y) => set((state) => ({
        activeWindows: state.activeWindows.map(w => w.id === id ? { ...w, position: { x, y } } : w)
      })),

      updateWindowSize: (id, width, height) => set((state) => ({
        activeWindows: state.activeWindows.map(w => w.id === id ? { ...w, size: { width, height } } : w)
      })),

      setBrightness: (val) => set({ brightness: val }),
      setVolume: (val) => set({ volume: val }),
      
      toggleWifi: () => set((state) => {
        const newState = !state.wifiConnected;
        return {
          wifiConnected: newState,
          networks: state.networks.map(n => ({ ...n, status: newState && n.id === 'v_ext' ? 'connected' : 'available' }))
        };
      }),

      toggleBluetooth: () => set((state) => ({ 
        isBluetoothOn: !state.isBluetoothOn,
        btDevices: state.btDevices.map(d => ({ ...d, status: 'disconnected' }))
      })),

      connectToWiFi: (id) => set((state) => {
        if (!state.wifiConnected) return state;
        return {
          networks: state.networks.map(n => ({
            ...n,
            status: n.id === id ? 'connecting' : 'available'
          }))
        };
      }),

      toggleBTDevice: (id) => set((state) => {
        if (!state.isBluetoothOn) return state;
        return {
          btDevices: state.btDevices.map(d => {
            if (d.id === id) {
              return { ...d, status: d.status === 'connected' ? 'disconnected' : 'pairing' };
            }
            return d;
          })
        };
      }),

      setPassword: (pwd) => set({ lockPassword: pwd })
    }),
    {
      name: 'vanquish-os-storage',
      partialize: (state) => ({ 
        brightness: state.brightness, 
        volume: state.volume, 
        wifiConnected: state.wifiConnected,
        isBluetoothOn: state.isBluetoothOn,
        lockPassword: state.lockPassword,
        networks: state.networks,
        btDevices: state.btDevices
      }),
    }
  )
);