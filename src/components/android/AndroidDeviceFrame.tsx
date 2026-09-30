import React from "react";
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2, Minimize2 } from "lucide-react";

interface AndroidDeviceFrameProps {
  children: React.ReactNode;
  isFrameActive: boolean;
  onToggleFrame: () => void;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({
  children,
  isFrameActive,
  onToggleFrame,
}) => {
  // If frame is inactive or screen is naturally mobile size (width < 768px), render children naturally full-screen
  if (!isFrameActive) {
    return <>{children}</>;
  }

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="min-h-screen bg-slate-900/95 flex flex-col items-center justify-center p-2 sm:p-6 select-none">
      {/* Top Simulator Control Bar */}
      <header className="w-full max-w-sm mb-3 flex items-center justify-between px-3 py-1.5 rounded-full bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-300 text-xs shadow-lg">
        <div className="flex items-center gap-1.5 font-medium text-emerald-400">
          <Smartphone className="w-4 h-4" />
          <span>Android Pixel 8 Simulator</span>
        </div>
        <button
          type="button"
          onClick={onToggleFrame}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-semibold transition cursor-pointer"
          title="ফুলস্ক্রিন রেসপন্সিভ মোডে দেখুন"
        >
          <Maximize2 className="w-3 h-3" />
          <span>ফুলস্ক্রিন</span>
        </button>
      </header>

      {/* Android Device Outer Bezel */}
      <div className="relative w-full max-w-[412px] h-[870px] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-slate-700/80 flex flex-col overflow-hidden ring-1 ring-white/10">
        {/* Android Status Bar with Camera Punch-Hole */}
        <div className="h-7 w-full flex items-center justify-between px-6 bg-slate-950 text-white text-[11px] font-medium shrink-0 z-40 select-none">
          {/* Status Left: Current Time */}
          <span className="font-semibold tracking-tight">{currentTime}</span>

          {/* Center: Front Camera Punch-hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800/80" />
          </div>

          {/* Status Right: 5G, Wi-Fi, Battery */}
          <div className="flex items-center gap-1.5 opacity-90">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <div className="flex items-center gap-0.5">
              <span>94%</span>
              <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Screen Content Wrapper */}
        <div className="relative flex-1 w-full bg-slate-50 dark:bg-slate-950 overflow-hidden flex flex-col rounded-b-[36px]">
          {children}

          {/* Android Gesture Navigation Bar Pill */}
          <div className="h-4 w-full bg-transparent flex items-center justify-center pointer-events-none absolute bottom-1 inset-x-0 z-50">
            <div className="w-28 h-1 rounded-full bg-slate-400/50 dark:bg-slate-500/50" />
          </div>
        </div>
      </div>
    </div>
  );
};
