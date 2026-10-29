import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

interface AndroidEmulatorFrameProps {
  children: React.ReactNode;
  onOpenCodeExport?: () => void;
  onResetData?: () => void;
}

export const AndroidEmulatorFrame: React.FC<AndroidEmulatorFrameProps> = ({
  children,
}) => {
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strMinutes = minutes < 10 ? '0' + minutes : minutes;
      setCurrentTime(`${hours}:${strMinutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#E7E3D8] text-[#17232E] flex flex-col items-center justify-center p-0 sm:p-4 select-none font-body">
      {/* Mobile Application Device Container */}
      <div className="w-full max-w-[400px] h-[100dvh] sm:h-[840px] sm:max-h-[95vh] bg-[#0c1524] sm:rounded-[48px] p-0 sm:p-3 shadow-2xl ring-0 sm:ring-1 sm:ring-white/10 flex flex-col overflow-hidden relative">
        {/* Front Camera Notch (visible on frame view) */}
        <div className="hidden sm:flex absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#0c1524] rounded-b-2xl z-40 items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-black/60 ring-1 ring-white/10" />
        </div>

        {/* Screen Bezel Area */}
        <div className="relative flex-1 bg-[#F4F2EC] sm:rounded-[38px] overflow-hidden flex flex-col shadow-inner">
          {/* Android Status Bar */}
          <div className="h-8 bg-[#122036] text-[#EFEDE4] px-6 flex items-center justify-between text-xs font-mono-code z-30 select-none shrink-0 pt-0.5">
            <span className="font-semibold text-[11px]">{currentTime}</span>
            <div className="flex items-center gap-2 text-[#A9B7C6]">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-1">
                <span className="text-[10px]">95%</span>
                <Battery className="w-3.5 h-3.5 fill-current text-[#4FA88C]" />
              </div>
            </div>
          </div>

          {/* Mobile Screen Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-[#F4F2EC]">
            {children}
          </div>

          {/* Android Bottom Gesture Pill */}
          <div className="h-4 bg-[#F4F2EC] flex items-center justify-center pb-1 shrink-0">
            <div className="w-32 h-1 bg-[#122036]/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
