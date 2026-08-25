import React, { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Immediate progress start
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 30);

    // Force finish after 1.5 seconds maximum
    const timer = setTimeout(() => {
      setProgress(100);
      setIsFading(true);
      // Wait for fade animation
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 800);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[9999] bg-white dark:bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out",
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <div className="relative flex flex-col items-center z-10">
        <div className="mb-10 relative">
          <div className="group w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="grid grid-cols-2 gap-1.5 w-12 h-12 relative z-10 transition-transform group-hover:scale-110">
              <div className="bg-[#3b82f6] rounded-sm transform translate-y-0.5 opacity-100"></div>
              <div className="bg-[#3b82f6] rounded-sm transform -translate-x-0.5 translate-y-0.5 opacity-80"></div>
              <div className="bg-[#3b82f6] rounded-sm transform translate-y-[-0.125rem] opacity-60"></div>
              <div className="bg-[#3b82f6] rounded-sm transform -translate-x-0.5 translate-y-[-0.125rem] opacity-40"></div>
            </div>
            <div 
               className="absolute bottom-0 left-0 right-0 bg-[#3b82f61a] transition-all duration-300"
               style={{ height: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-1">
            <span>ARQON</span>
            <span className="text-[#3b82f6] text-4xl block translate-y-0.5">OS</span>
          </h2>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6] ml-[0.6em] opacity-80">
            Intelligent Infrastructure
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center">
          <div className="relative w-72 h-[3px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
            <div 
              className="absolute left-0 top-0 h-full bg-[#3b82f6] shadow-[0_0_15px_#3b82f6] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-10 text-slate-400 dark:text-slate-500 font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
               <span>System Check</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="text-slate-900 dark:text-white tabular-nums text-lg font-black tracking-tighter">{progress}%</span>
             </div>
             <div className="flex items-center gap-2">
               <span>Ready</span>
               <div className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-500", progress === 100 ? "bg-[#22c55e]" : "bg-slate-200 dark:bg-slate-800")} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
