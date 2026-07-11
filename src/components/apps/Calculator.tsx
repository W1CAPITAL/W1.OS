"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");

  const handleAction = (val: string) => {
    if (val === "C") {
      setDisplay("0");
      setEquation("");
      return;
    }
    if (val === "=") {
      try {
        const result = eval(equation + display);
        setDisplay(String(result));
        setEquation("");
      } catch {
        setDisplay("Error");
      }
      return;
    }
    if (["+", "-", "*", "/"].includes(val)) {
      setEquation(display + " " + val + " ");
      setDisplay("0");
      return;
    }
    setDisplay(prev => prev === "0" ? val : prev + val);
  };

  const btn = "h-14 glass rounded-xl flex items-center justify-center text-xs uppercase tracking-widest hover:bg-white/5 active:scale-95 transition-all";
  const gold = "text-accent-gold border border-accent-gold/20 bg-accent-gold/5";

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-80 space-y-6">
        <div className="text-right p-6 bg-surface/40 rounded-2xl border border-white/5">
          <p className="text-[10px] text-text-secondary opacity-40 h-4 uppercase tracking-widest">{equation}</p>
          <p className="text-4xl font-light tracking-tighter text-text-primary">{display}</p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {["C", "/", "*", "-"].map(v => (
            <button key={v} onClick={() => handleAction(v)} className={`${btn} ${gold}`}>{v}</button>
          ))}
          {[7, 8, 9, "+"].map(v => (
            <button key={v} onClick={() => handleAction(String(v))} className={`${btn} ${v === '+' ? gold : ''}`}>{v}</button>
          ))}
          {[4, 5, 6].map(v => (
            <button key={v} onClick={() => handleAction(String(v))} className={btn}>{v}</button>
          ))}
          <button onClick={() => handleAction("=")} className={`${btn} row-span-2 h-full bg-accent-gold text-bg-deep font-bold`}>=</button>
          {[1, 2, 3].map(v => (
            <button key={v} onClick={() => handleAction(String(v))} className={btn}>{v}</button>
          ))}
          <button onClick={() => handleAction("0")} className={`${btn} col-span-3`}>0</button>
        </div>
      </div>
    </div>
  );
}