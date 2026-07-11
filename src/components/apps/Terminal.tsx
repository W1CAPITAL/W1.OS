"use client";

import { useState, useRef, useEffect } from "react";

export default function Terminal() {
  const [history, setHistory] = useState<string[]>(["AML Kernel v10.5.0-Vanquish initialized.", "Type 'help' for available commands."]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, `aml@vanquish:~$ ${input}`];
    
    switch (cmd) {
      case 'help':
        newHistory.push("Available commands: ls, cd, pwd, clear, echo, date, neofetch, exit");
        break;
      case 'ls':
        newHistory.push("Documents  AI_Models  README.txt  System_Vault");
        break;
      case 'pwd':
        newHistory.push("/home/aml/desktop");
        break;
      case 'date':
        newHistory.push(new Date().toString());
        break;
      case 'clear':
        setHistory([]);
        setInput("");
        return;
      case 'neofetch':
        newHistory.push("       .        OS: Aston Martin Linux v10.5");
        newHistory.push("      / \\       Kernel: 6.8.0-vanquish-generic");
        newHistory.push("     /   \\      Uptime: 14 mins");
        newHistory.push("    /     \\     Shell: bash 5.2.21");
        newHistory.push("   /  AML  \\    DE: Vanquish Desktop");
        newHistory.push("  /_________\\   GPU: NVIDIA RTX 4090 AML Edition");
        break;
      default:
        newHistory.push(`Command not found: ${cmd}`);
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col bg-black/80 font-mono text-[11px] p-6 text-emerald-400 overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar space-y-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex gap-2 mt-4 items-center">
        <span className="text-accent shrink-0">aml@vanquish:~$</span>
        <input 
          type="text"
          autoFocus
          className="bg-transparent border-none outline-none flex-1 text-emerald-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}