"use client";

import { useOSStore } from "@/store/os-store";
import Window from "./Window";

export default function WindowManager() {
  const { activeWindows } = useOSStore();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {activeWindows.map(win => (
        <div key={win.id} className="pointer-events-auto">
          <Window {...win} />
        </div>
      ))}
    </div>
  );
}