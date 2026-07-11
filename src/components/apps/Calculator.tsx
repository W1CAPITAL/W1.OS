"use client";

import { useState } from "react";

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

  const btn = "h-14 glass rounded-xl flex items-center justify-center text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 active:scale-95 transition-all text-text-secondary";
  const accent = "text-accent border border-accent/20 bg-primary/10 font-bold";

  return (
    <div className="h-full flex items-center justify-center bg-background/50 p-8">
      <div className="w-80 space-y-6">
        <div className="text-right p-8 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
          <p className="text-[10px] text-accent/40 h-4 uppercase tracking-[0.3em] font-mono">{equation}</p>
          <p className="text-4xl font-light tracking-tighter text-text-primary mt-2">{display}</p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {["C", "/", "*", "-"].map(v => (
            <button key={v} onClick={() => handleAction(v)} className={cn(btn, accent)}>{v}</button>
          ))}
          {[7, 8, 9, "+"].map(v => (
            <button key={v} onClick={() => handleAction(String(v))} className={cn(btn, v === '+' ? accent : '')}>{v}</button>
          ))}
          {[4, 5, 6].map(v => (
            <button key={v} onClick={() => handleAction(String(v))} className={btn}>{v}</button>
          ))}
          <button onClick={() => handleAction("=")} className={cn(btn, "row-span-2 h-full bg-accent text-background font-bold border-none shadow-lg shadow-accent/10")}>=</button>
          {[1, 2, 3].map(v => (
            <button key={v} onClick={() => handleAction(String(v))} className={btn}>{v}</button>
          ))}
          <button onClick={() => handleAction("0")} className={cn(btn, "col-span-3")}>0</button>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";