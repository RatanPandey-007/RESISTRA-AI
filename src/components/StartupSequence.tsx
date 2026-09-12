import React, { useEffect, useState } from 'react';
import { Activity, Globe, Cpu } from 'lucide-react';

interface StartupSequenceProps {
  onComplete: () => void;
}

export const StartupSequence: React.FC<StartupSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // 0-1s: Phase 0 (Pitch Black)
    const t0 = setTimeout(() => setPhase(1), 1000);
    // 1-2s: Phase 1 (Small Telemetry indicators)
    const t1 = setTimeout(() => setPhase(2), 2200);
    // 2-3s: Phase 2 ("RESISTRA AI" appears)
    const t2 = setTimeout(() => setPhase(3), 3400);
    // 3-5s: Phase 3 (3D Earth emerges from darkness)
    const t3 = setTimeout(() => setPhase(4), 5000);
    // 5-6s: Phase 4 (India / regional nodes illuminate)
    const t4 = setTimeout(() => setPhase(5), 6200);
    // 6-7s: Phase 5 (AMR signals begin appearing)
    const t5 = setTimeout(() => setPhase(6), 7200);
    // 7s+: Phase 6 (Complete & transition to live dashboard)
    const t6 = setTimeout(() => onComplete(), 7600);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1.4;
      });
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020406] text-slate-100 flex flex-col justify-between p-8 sm:p-12 font-mono select-none overflow-hidden">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-white/[0.04] pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-widest uppercase text-slate-400">RESISTRA_OS // KERNEL v4.12.8</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline text-slate-500">INIT_STATUS: {phase >= 5 ? 'SYNCHRONIZED' : 'INITIALIZING'}</span>
          <button
            onClick={onComplete}
            className="px-3 py-1 rounded border border-white/[0.1] hover:border-cyan-400/50 text-slate-400 hover:text-cyan-300 text-[10px] tracking-wider transition-all cursor-pointer"
          >
            SKIP SEQUENCE [ESC]
          </button>
        </div>
      </div>

      {/* Center Cinematic Stage */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative max-w-2xl mx-auto w-full">
        {/* Phase 1+: Subtle Telemetry Diagnostics */}
        {phase >= 1 && (
          <div className="flex items-center gap-4 text-[10px] text-cyan-400/80 mb-6 tracking-widest animate-in fade-in duration-500">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3" /> ML_ENGINE_READY
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> SENTINEL_TELEMETRY_LINK
            </span>
            <span className="text-slate-600">|</span>
            <span>28.6139°N 77.2090°E</span>
          </div>
        )}

        {/* Phase 2+: RESISTRA AI Core Identity */}
        {phase >= 2 && (
          <div className="space-y-2 animate-in fade-in zoom-in-95 duration-700">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-sans">
              RESISTRA<span className="text-cyan-400">.AI</span>
            </h1>
            <p className="text-xs sm:text-sm tracking-[0.25em] text-slate-400 uppercase font-mono">
              Antimicrobial Resistance Intelligence System
            </p>
          </div>
        )}

        {/* Phase 3-5: Emergence of Spatial Earth & Signals */}
        {phase >= 3 && (
          <div className="mt-8 space-y-3 max-w-md w-full animate-in fade-in duration-700">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                {phase === 3 && 'CALIBRATING 3D SPATIAL EARTH...'}
                {phase === 4 && 'ILLUMINATING INDIA & REGIONAL SENTINEL NODES...'}
                {phase >= 5 && 'INTERCEPTING COMMUNITY AMR RESISTANCE DRIFT...'}
              </span>
              <span className="text-cyan-400 font-bold tabular-telemetry">{Math.min(100, Math.round(progress))}%</span>
            </div>

            {/* High-precision thin telemetry progress line */}
            <div className="w-full h-[2px] bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(24,191,255,0.8)]"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>

            {/* Event Log Stream */}
            <div className="text-[10px] text-slate-500 text-left pt-2 font-mono space-y-1">
              {phase >= 3 && <div className="text-slate-400">&gt; [OK] SPATIAL PROJECTION MATRIX LOADED</div>}
              {phase >= 4 && <div className="text-emerald-400">&gt; [SYNC] INDIA CLINICAL GRID ENGAGED (NEW DELHI SENTINEL)</div>}
              {phase >= 5 && <div className="text-rose-400 font-bold">&gt; [ALERT] SURVEILLANCE DRIFT: E. COLI × CIPRO (+17 PP DETECTED)</div>}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-600 border-t border-white/[0.04] pt-4 gap-2">
        <span>PUBLIC-HEALTH SURVEILLANCE PROTOCOL // NON-CLINICAL DECISION SUPPORT</span>
        <span className="text-slate-500">INITIALIZING SPATIAL WORKSPACE...</span>
      </div>
    </div>
  );
};
