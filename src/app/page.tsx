"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Main entry point for Aston Martin Linux OS
const Desktop = dynamic(() => import("@/components/desktop/Desktop"), { 
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen bg-[#0A0C0E] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
        <span className="text-[#C9A227] text-[10px] uppercase tracking-[0.5em] font-bold">Initializing Vanquish Core...</span>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-black select-none">
      <Suspense fallback={null}>
        <Desktop />
      </Suspense>
    </main>
  );
}