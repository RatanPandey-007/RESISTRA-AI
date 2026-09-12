import React, { useEffect, useState } from 'react';

interface TelemetryEvent {
  timestamp: string;
  code: string;
  message: string;
  status: 'info' | 'active' | 'warning' | 'critical';
}

const TELEMETRY_STREAM: TelemetryEvent[] = [
  { timestamp: '00:00:12', code: 'INGEST', message: 'MICROBIOLOGY SPECIMEN REPORT INGESTED', status: 'info' },
  { timestamp: '00:00:14', code: 'EXTRACT', message: 'ORGANISM IDENTIFIED: ESCHERICHIA COLI', status: 'info' },
  { timestamp: '00:00:16', code: 'AST_EVAL', message: 'SUSCEPTIBILITY PATTERN ANALYZED (CIP RESISTANT)', status: 'active' },
  { timestamp: '00:00:18', code: 'SURV_AGG', message: 'POPULATION RESISTANCE TRAJECTORY UPDATED', status: 'active' },
  { timestamp: '00:00:20', code: 'THR_CROSS', message: 'WHO EMPIRIC THRESHOLD CROSSED (40.0% ALERT CUTOFF)', status: 'warning' },
  { timestamp: '00:00:21', code: 'ALERT_GEN', message: 'COMMUNITY SPIKE EARLY WARNING DISPATCHED (+17 PP)', status: 'critical' },
  { timestamp: '00:00:24', code: 'CLUSTER', message: 'SPATIAL FACILITY CLUSTER DETECTED (4 METRO CLINICS)', status: 'warning' },
  { timestamp: '00:00:27', code: 'ML_INFER', message: 'ISOLATION FOREST ANOMALY SCORE VERIFIED (-0.42)', status: 'active' }
];

export const LiveTelemetryTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TELEMETRY_STREAM.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const activeEvent = TELEMETRY_STREAM[currentIndex];

  const getStatusBadge = (status: TelemetryEvent['status']) => {
    switch (status) {
      case 'critical':
        return 'text-rose-400 border-rose-500/40 bg-rose-500/10 shadow-[0_0_8px_rgba(255,59,78,0.4)]';
      case 'warning':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      case 'active':
        return 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10';
      default:
        return 'text-slate-400 border-white/[0.08] bg-white/[0.02]';
    }
  };

  return (
    <div className="w-full py-2.5 px-4 rounded-xl bg-[#06090e]/90 border border-white/[0.06] flex items-center justify-between gap-4 font-mono text-[11px] overflow-hidden select-none">
      {/* Telemetry Label & Radar Pulse */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
        </span>
        <span className="text-slate-500 text-[10px] tracking-widest uppercase font-bold hidden sm:inline">
          LIVE TELEMETRY STREAM
        </span>
      </div>

      {/* Center Animated Stream Event */}
      <div className="flex-1 flex items-center gap-3 overflow-hidden">
        <span className="text-slate-500 text-[10px] tabular-telemetry">
          [{activeEvent.timestamp}]
        </span>
        <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold tracking-wider ${getStatusBadge(activeEvent.status)}`}>
          {activeEvent.code}
        </span>
        <span className="text-slate-200 tracking-wide truncate text-[11px]">
          {activeEvent.message}
        </span>
      </div>

      {/* Right Stream Metrics */}
      <div className="hidden md:flex items-center gap-4 text-[10px] text-slate-500 tabular-telemetry shrink-0">
        <span>RATE: <strong className="text-slate-300 font-normal">24 TX/SEC</strong></span>
        <span>LATENCY: <strong className="text-emerald-400 font-normal">14 MS</strong></span>
        <span className="text-slate-600">|</span>
        <span className="text-cyan-400">SENTINEL ACTIVE</span>
      </div>
    </div>
  );
};
