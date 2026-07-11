"use client";

import { useOSStore } from "@/store/os-store";
import { Wifi, Bluetooth, Monitor, Volume2, User, Shield, ChevronRight, Moon, Sun, Lock, RefreshCw, Key, Bluetooth as BTIcon, Smartphone, Headphones, Car } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Settings() {
  const { 
    brightness, setBrightness, 
    wifiConnected, toggleWifi, 
    isBluetoothOn, toggleBluetooth,
    networks, connectToWiFi,
    btDevices, toggleBTDevice,
    lockPassword, setPassword 
  } = useOSStore();

  const [activeCategory, setActiveCategory] = useState("Display");
  const [newPass, setNewPass] = useState(lockPassword);

  const categories = [
    { id: "Display", icon: <Monitor size={18} /> },
    { id: "Network", icon: <Wifi size={18} /> },
    { id: "Bluetooth", icon: <BTIcon size={18} /> },
    { id: "Security", icon: <Shield size={18} /> },
    { id: "Identity", icon: <User size={18} /> },
  ];

  // Simulated connection lifecycle
  useEffect(() => {
    const timer = setInterval(() => {
      const connecting = networks.find(n => n.status === 'connecting');
      if (connecting) {
        useOSStore.setState((state) => ({
          networks: state.networks.map(n => n.id === connecting.id ? { ...n, status: 'connected' } : { ...n, status: 'available' })
        }));
      }

      const pairing = btDevices.find(d => d.status === 'pairing');
      if (pairing) {
        useOSStore.setState((state) => ({
          btDevices: state.btDevices.map(d => d.id === pairing.id ? { ...d, status: 'connected' } : d)
        }));
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [networks, btDevices]);

  return (
    <div className="h-full flex text-text-primary font-light bg-surface/20">
      <div className="w-64 bg-surface/80 border-r border-white/5 p-6 flex flex-col gap-3">
        <div className="mb-6 px-4">
          <h1 className="text-xs font-bold tracking-[0.3em] uppercase text-accent-gold/60">System Config</h1>
        </div>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-[10px] tracking-[0.2em] uppercase ${activeCategory === cat.id ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20 shadow-lg' : 'text-text-secondary hover:bg-white/5'}`}
          >
            {cat.icon}
            {cat.id}
          </button>
        ))}
      </div>

      <div className="flex-1 p-16 max-w-3xl overflow-y-auto no-scrollbar">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-4xl uppercase tracking-[0.4em] mb-16 font-extralight text-text-primary">{activeCategory}</h2>

          {activeCategory === "Display" && (
            <div className="space-y-16">
              <div className="space-y-6">
                <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-text-secondary">
                  <span>Luminance Level</span>
                  <span className="text-accent-gold font-bold">{brightness}%</span>
                </div>
                <div className="flex items-center gap-8 bg-black/20 p-8 rounded-3xl border border-white/5 shadow-inner">
                  <Moon size={20} className="text-text-secondary/40" />
                  <input 
                    type="range" 
                    min="10" max="100" 
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-gold"
                  />
                  <Sun size={20} className="text-text-secondary/40" />
                </div>
              </div>
              
              <div className="p-8 rounded-3xl glass-green border border-accent-gold/10 flex items-center justify-between shadow-xl">
                <div className="space-y-1">
                  <h4 className="text-xs uppercase tracking-widest font-medium">Night Intelligence</h4>
                  <p className="text-[9px] text-text-secondary opacity-60 uppercase tracking-widest">Optimize visual contrast for low-light environments</p>
                </div>
                <button className="w-14 h-7 rounded-full bg-accent-gold/20 border border-accent-gold/30 relative p-1 transition-all hover:brightness-125">
                  <div className="w-5 h-5 rounded-full bg-accent-gold shadow-lg" />
                </button>
              </div>
            </div>
          )}

          {activeCategory === "Network" && (
            <div className="space-y-8">
              <div className="p-10 rounded-3xl glass flex items-center justify-between border border-white/5 shadow-2xl">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl shadow-xl transition-colors duration-500 ${wifiConnected ? 'bg-accent-green/20 text-accent-gold' : 'bg-white/5 text-text-secondary'}`}>
                    <Wifi size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm uppercase tracking-widest font-light">Wireless Interface</h4>
                    <p className="text-[9px] text-text-secondary opacity-60 font-mono tracking-widest uppercase">
                      {wifiConnected ? (networks.find(n => n.status === 'connected')?.name || "SEARCHING...") : "DEACTIVATED"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={toggleWifi}
                  className={`w-16 h-8 rounded-full transition-all duration-500 relative p-1 border ${wifiConnected ? 'bg-accent-green border-accent-green/50' : 'bg-white/10 border-white/10'}`}
                >
                  <motion.div 
                    layout
                    className={`w-6 h-6 rounded-full bg-white shadow-lg ${wifiConnected ? 'ml-auto' : 'mr-auto'}`} 
                  />
                </button>
              </div>
              
              <div className={`space-y-4 pt-8 transition-opacity duration-500 ${wifiConnected ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-accent-gold/40 px-4">Available Channels</h4>
                {networks.map(net => (
                  <button 
                    key={net.id} 
                    onClick={() => connectToWiFi(net.id)}
                    className="w-full p-6 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xs uppercase tracking-widest ${net.status === 'connected' ? 'text-accent-gold' : 'text-text-secondary group-hover:text-text-primary'}`}>
                        {net.name}
                      </span>
                      {net.status === 'connecting' && <RefreshCw size={12} className="animate-spin text-accent-gold" />}
                    </div>
                    <div className="flex items-center gap-4">
                      {net.status === 'connected' && <span className="text-[8px] uppercase tracking-widest text-accent-green font-bold">Active</span>}
                      <ChevronRight size={14} className="text-accent-gold" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "Bluetooth" && (
            <div className="space-y-8">
              <div className="p-10 rounded-3xl glass flex items-center justify-between border border-white/5 shadow-2xl">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl shadow-xl transition-colors duration-500 ${isBluetoothOn ? 'bg-accent-green/20 text-accent-gold' : 'bg-white/5 text-text-secondary'}`}>
                    <BTIcon size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm uppercase tracking-widest font-light">Bluetooth Connectivity</h4>
                    <p className="text-[9px] text-text-secondary opacity-60 font-mono tracking-widest uppercase">
                      {isBluetoothOn ? "VISIBLE AS VANQUISH_OWNER" : "DEACTIVATED"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={toggleBluetooth}
                  className={`w-16 h-8 rounded-full transition-all duration-500 relative p-1 border ${isBluetoothOn ? 'bg-accent-green border-accent-green/50' : 'bg-white/10 border-white/10'}`}
                >
                  <motion.div 
                    layout
                    className={`w-6 h-6 rounded-full bg-white shadow-lg ${isBluetoothOn ? 'ml-auto' : 'mr-auto'}`} 
                  />
                </button>
              </div>

              <div className={`space-y-4 pt-8 transition-opacity duration-500 ${isBluetoothOn ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-accent-gold/40 px-4">Known Devices</h4>
                {btDevices.map(device => (
                  <button 
                    key={device.id} 
                    onClick={() => toggleBTDevice(device.id)}
                    className="w-full p-6 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {device.name.includes('DB12') ? <Car size={16} /> : device.name.includes('Headset') ? <Headphones size={16} /> : <Smartphone size={16} />}
                      <div className="text-left">
                        <p className={`text-xs uppercase tracking-widest ${device.status === 'connected' ? 'text-accent-gold' : 'text-text-secondary group-hover:text-text-primary'}`}>
                          {device.name}
                        </p>
                        <p className="text-[8px] opacity-40 uppercase">{device.status}</p>
                      </div>
                    </div>
                    {device.status === 'pairing' && <RefreshCw size={12} className="animate-spin text-accent-gold" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "Security" && (
            <div className="space-y-10">
              <div className="bg-black/30 p-10 rounded-3xl border border-white/10 space-y-8">
                <div className="flex items-center gap-4 text-accent-gold">
                  <Lock size={20} />
                  <h4 className="text-xs uppercase tracking-[0.3em] font-medium">Access Control</h4>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-text-secondary block px-1">System Master Passcode</label>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/40" size={16} />
                      <input 
                        type="text" 
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="ENTER NEW CODE"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-mono tracking-widest outline-none focus:border-accent-gold transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => { setPassword(newPass); alert("System Passcode Updated"); }}
                      className="px-8 bg-accent-gold text-bg-deep font-bold uppercase tracking-widest text-[10px] rounded-xl hover:brightness-110 active:scale-95 transition-all"
                    >
                      Update
                    </button>
                  </div>
                  <p className="text-[8px] text-text-secondary/40 uppercase tracking-widest px-1">Changing this will update requirements for biometrics fallback.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}