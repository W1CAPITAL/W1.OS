'use client';

import { motion } from 'framer-motion';

export default function Wallpaper() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Cinematic dark background with carbon and green subtle gradients */}
      <div className="absolute inset-0 bg-am-onyx" />
      <div className="absolute inset-0 bg-carbon-pattern opacity-20 mix-blend-overlay" />
      
      {/* Subtle Racing Green Glows */}
      <div className="absolute -top-1/4 -right-1/4 w-full h-full bg-am-green/20 rounded-full blur-[200px]" />
      <div className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-am-green/10 rounded-full blur-[150px]" />
      
      {/* Neural Scanline simulation */}
      <div className="scanline" />

      {/* Animated Overlay for depth */}
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-t from-am-onyx via-transparent to-am-onyx/50 pointer-events-none"
      />
    </div>
  );
}
