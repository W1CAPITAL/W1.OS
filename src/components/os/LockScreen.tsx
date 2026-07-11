"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/store/os-store";
import { Fingerprint, Lock, ChevronUp, Wifi, Battery, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function LockScreen() {
  const { unlock, lockPassword } = useOSStore();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(false);

  const handleFingerprint = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      unlock();
    }, 1200);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === lockPassword || (lockPassword === "" && passwordInput === "aston")) {
      unlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPasswordInput("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.43, 0, 0.23, 1] }}
      className="absolute inset-0 z-[1000] carbon-fiber flex flex-col items-center justify-between p-12 overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1603584173870-7f3118940026?auto=format&fit=crop&q=80&w=2000')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

      {/* Swipe Overlay */}
      <motion.div 
        className="absolute inset-0 z-[1001]"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.5}
        onDragEnd={(_, info) => {
          if (info.offset.y < -150) unlock();
        }}
      />

      {/* Top Bar */}
      <div className="relative z-10 w-full flex justify-end gap-6 text-text-primary/60 font-light tracking-widest text-xs">
        <div className="flex items-center gap-2"><Wifi size={16} /> CONNECTED</div>
        <div className="flex items-center gap-2"><Battery size={16} /> 100%</div>
      </div>

      {/* Center Clock */}
      <div className="relative z-10 text-center">
        <motion.h1 
          layoutId="lock-clock"
          className="text-[12rem] font-extralight tracking-tighter leading-none text-text-primary drop-shadow-2xl"
        >
          {format(new Date(), "HH:mm")}
        </motion.h1>
        <p className="text-2xl tracking-[0.8em] uppercase text-accent-gold mt-4 font-light opacity-80">
          {format(new Date(), "EEEE, MMMM dd")}
        </p>
      </div>

      {/* Interaction Area */}
      <div className="relative z-[1002] flex flex-col items-center gap-8 w-full max-w-md mb-12">
        <AnimatePresence mode="wait">
          {showPassword ? (
            <motion.form
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onSubmit={handlePasswordSubmit}
              className="glass p-10 rounded-3xl w-full flex flex-col items-center gap-8 border border-white/10 shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-accent-green/20 flex items-center justify-center border border-accent-gold/30">
                <Lock className="text-accent-gold" size={32} />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl tracking-widest uppercase font-light">Security Protocol</h2>
                <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em]">Enter Master Passcode</p>
              </div>
              
              <div className="w-full relative">
                <input
                  autoFocus
                  type="password"
                  placeholder="••••"
                  className={`w-full bg-white/5 border-b-2 py-4 text-center outline-none transition-all text-2xl tracking-[1em] ${error ? 'border-red-500' : 'border-accent-gold/40 focus:border-accent-gold'}`}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                {error && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute -bottom-6 left-0 right-0 text-center text-red-500 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <AlertCircle size={12} /> Access Denied
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col gap-4 w-full">
                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-accent-gold text-bg-deep font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all active:scale-95 shadow-lg"
                >
                  Verify Identity
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(false)}
                  className="text-xs text-text-secondary hover:text-accent-gold transition-colors uppercase tracking-widest"
                >
                  Return to Biometrics
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex flex-col items-center gap-12"
            >
              <button 
                onClick={handleFingerprint}
                disabled={isScanning}
                className="group relative flex flex-col items-center gap-6"
              >
                <div className={`w-28 h-28 rounded-full glass border border-accent-gold/20 flex items-center justify-center transition-all duration-700 relative overflow-hidden ${isScanning ? 'scale-110 shadow-[0_0_50px_rgba(26,60,52,0.8)]' : 'hover:bg-accent-green/10'}`}>
                  <Fingerprint className={`${isScanning ? 'text-accent-green' : 'text-accent-gold'} transition-colors duration-500 z-10`} size={54} />
                  {isScanning && (
                    <motion.div 
                      className="absolute inset-0 bg-accent-green/20"
                      initial={{ y: "100%" }}
                      animate={{ y: "-100%" }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>
                <div className="text-center space-y-2">
                  <span className="text-xs uppercase tracking-[0.4em] text-text-secondary group-hover:text-text-primary transition-colors">
                    {isScanning ? "Authenticating..." : "Biometric ID Required"}
                  </span>
                </div>
              </button>

              <div className="flex flex-col items-center gap-6">
                <motion.button
                  onClick={() => setShowPassword(true)}
                  whileHover={{ y: -3 }}
                  className="text-[10px] uppercase tracking-[0.5em] text-accent-gold/60 hover:text-accent-gold transition-colors"
                >
                  Manual Passcode Override
                </motion.button>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex flex-col items-center gap-2 opacity-30"
                >
                  <ChevronUp size={24} className="text-text-primary" />
                  <span className="text-[8px] uppercase tracking-[0.6em]">Swipe to Unlock</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 text-[10px] tracking-[0.8em] text-text-secondary/20 uppercase font-light">
        Aston Martin Intelligence Core • Vanquish OS v10
      </div>
    </motion.div>
  );
}
