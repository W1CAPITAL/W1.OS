"use client";

import { useWindowsStore } from "@/store/windows-store";
import Window from "./Window";

export default function WindowManager() {
  const { activeWindows } = useWindowsStore();

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