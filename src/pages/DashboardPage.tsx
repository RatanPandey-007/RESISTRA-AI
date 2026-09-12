import React from 'react';
import { PageId, SurveillanceRecord } from '../types';
import { AMRGlobe } from '../components/AMRGlobe';
import { LiveTelemetryTicker } from '../components/LiveTelemetryTicker';
import { 
  ArrowUp, 
  ArrowRight, 
  ChevronRight,
  Zap,
  Play,
  RotateCcw,
  Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine
} from 'recharts';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  dataset?: SurveillanceRecord[];
  isDemoActive?: boolean;
  onRunDemo?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onNavigate, 
  isDemoActive = false,
  onRunDemo
}) => {
  // 12-Month High-Precision Telemetry Series (May 2024 - Apr 2025)
  const trajectoryData = [
    { month: 'MAY', rate: 29.8 },
    { month: 'JUN', rate: 30.5 },
    { month: 'JUL', rate: 31.0 },
    { month: 'AUG', rate: 30.2 },
    { month: 'SEP', rate: 32.1 },
    { month: 'OCT', rate: 31.5 },
    { month: 'NOV', rate: 30.8 },
    { month: 'DEC', rate: 31.2 },
    { month: 'JAN', rate: 32.4 },
    { month: 'FEB', rate: 33.1 },
    { month: 'MAR', rate: 34.0 },
    { month: 'APR', rate: isDemoActive ? 48.0 : 34.2 },
  ];

  // Phenotype Susceptibility Matrix Telemetry
  const matrixRows = [
    { pathogen: 'E. coli', cip: isDemoActive ? 48 : 31, gen: 32, ctx: 54, mer: 12, amk: 18 },
    { pathogen: 'K. pneumoniae', cip: 62, gen: 45, ctx: 58, mer: 24, amk: 28 },
    { pathogen: 'P. aeruginosa', cip: 38, gen: 29, ctx: 18, mer: 31, amk: 15 },
    { pathogen: 'S. aureus (MRSA)', cip: 71, gen: 40, ctx: 82, mer: 0, amk: 22 },
    { pathogen: 'A. baumannii', cip: 84, gen: 76, ctx: 89, mer: 68, amk: 52 },
  ];

  const getHeatColor = (val: number) => {
    if (val >= 50) return 'text-rose-400 bg-rose-500/15 border-rose-500/40 font-bold';
    if (val >= 40) return 'text-amber-400 bg-amber-500/15 border-amber-500/30 font-semibold';
    return 'text-slate-300 bg-white/[0.03] border-white/[0.06]';
  };

  return (
    <div className="space-y-8 pb-12 bg-[#020406] text-slate-100 font-sans select-none">
      {/* ============================================================ */}
      {/* SECTION 1: SPATIAL HERO COMPOSITION                          */}
      {/* 3D EARTH (CENTER HERO) + FLOATING INTELLIGENCE PANELS        */}
      {/* ============================================================ */}
      <div className="relative rounded-2xl bg-[#020406] border border-white/[0.06] overflow-hidden shadow-2xl">
        {/* Subtle Technical Grid Overlay */}
        <div className="absolute inset-0 technical-grid pointer-events-none opacity-40 z-0" />

        {/* Hero Header Typography */}
        <div className="relative z-10 pt-6 px-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.04] pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400 font-bold tracking-[0.2em] uppercase">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              RESISTRA AI // COMMUNITY AMR INTELLIGENCE
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
              Population-Level Antimicrobial Resistance Surveillance
            </h1>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE TELEMETRY
            </span>
            {onRunDemo && (
              <button
                onClick={onRunDemo}
                className={`px-4 py-1.5 rounded-lg border text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
                  isDemoActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-400/40 shadow-cyan-500/20 hover:scale-102 active:scale-98'
                }`}
              >
                {isDemoActive ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>RESET SIMULATION</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>EXECUTE DEMO SIMULATION</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Spatial Earth + Integrated Floating HUD Panels */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 min-h-[520px]">
          {/* Central 3D Earth Hero (lg:col-span-8) */}
          <div className="lg:col-span-8 h-[480px] sm:h-[520px] relative rounded-xl overflow-hidden">
            <AMRGlobe onSelectRegion={() => onNavigate('trends')} isDemoActive={isDemoActive} />
          </div>

          {/* Right: Floating Current Signal Intelligence Panel (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-xl spatial-surface-elevated font-mono">
            <div>
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="tracking-widest uppercase font-bold text-rose-400">
                    CURRENT SIGNAL
                  </span>
                </div>
                <span className="text-slate-500 tracking-wider">
                  SIG_ID: #AMR-9921
                </span>
              </div>

              {/* Organism & Drug Headline */}
              <div className="mb-5">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                  TARGET PATHOGEN & ANTIMICROBIAL
                </div>
                <div className="text-lg font-bold text-white tracking-tight mt-0.5 font-sans">
                  Escherichia coli
                </div>
                <div className="text-xs text-rose-400 tracking-wider mt-0.5">
                  CIPROFLOXACIN (FLUOROQUINOLONE)
                </div>
              </div>

              {/* Hero Numbers (Precision Typography - Not generic cards) */}
              <div className="grid grid-cols-2 gap-4 mb-5 pt-2 border-t border-white/[0.04]">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">
                    BASELINE RATE
                  </span>
                  <div className="text-3xl sm:text-4xl font-bold text-slate-400 tabular-telemetry">
                    31<span className="text-lg font-normal text-slate-600">%</span>
                  </div>
                  <span className="text-[9px] text-slate-600 uppercase">30-Day Historical</span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-rose-300 uppercase tracking-widest">
                      DETECTED RATE
                    </span>
                    <span className="text-[10px] font-bold text-rose-400 flex items-center">
                      <ArrowUp className="w-2.5 h-2.5" /> +17 PP
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-rose-400 tabular-telemetry">
                    {isDemoActive ? '48' : '31'}<span className="text-lg font-normal text-rose-500/70">%</span>
                  </div>
                  <span className="text-[9px] text-rose-400/80 uppercase">
                    {isDemoActive ? 'Surge Confirmed' : 'Pending Ingestion'}
                  </span>
                </div>
              </div>

              {/* Threshold & Status Telemetry */}
              <div className="space-y-2 pt-2 border-t border-white/[0.04] text-[11px]">
                <div className="flex items-center justify-between py-1 border-b border-white/[0.03]">
                  <span className="text-slate-500">WHO ALERT THRESHOLD:</span>
                  <span className="text-white font-semibold tabular-telemetry">40.0%</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/[0.03]">
                  <span className="text-slate-500">STATUS:</span>
                  <span className="px-1.5 py-0.5 rounded border border-rose-500/40 bg-rose-500/10 text-rose-300 text-[10px] font-bold tracking-wider">
                    {isDemoActive ? 'EARLY WARNING' : 'NOMINAL BASELINE'}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                    WHY THIS SIGNAL?
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px] font-sans">
                    Anomaly detected against the rolling population resistance baseline. Statistically anomalous +17 percentage point resistance surge identified across community cultures.
                  </p>
                </div>
              </div>
            </div>

            {/* Scientific Transparency Disclaimer & Navigation */}
            <div className="pt-4 border-t border-white/[0.06] mt-4 space-y-2.5">
              <div className="text-[9px] text-slate-500 leading-relaxed">
                * Analytical decision-support tool. Assisting epidemiological teams; not an individual clinical diagnosis.
              </div>
              <button
                onClick={() => onNavigate('analysis')}
                className="w-full py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>OPEN REPORT DEEP DIVE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: HERO NUMERICAL TELEMETRY READOUTS                 */}
      {/* Precision Typography: Large numbers, compact labels          */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
        <div className="p-4 rounded-xl spatial-surface font-mono">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block">REPORTS ANALYZED</span>
          <div className="text-3xl sm:text-4xl font-bold text-white tabular-telemetry tracking-tight mt-1">
            14,280
          </div>
          <span className="text-[10px] text-cyan-400 mt-1 block">Sentinel Microbiology Batch</span>
        </div>

        <div className="p-4 rounded-xl spatial-surface font-mono">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block">ACTIVE SIGNALS</span>
          <div className="text-3xl sm:text-4xl font-bold text-cyan-400 tabular-telemetry tracking-tight mt-1">
            07
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Cross-Facility Surveillance</span>
        </div>

        <div className="p-4 rounded-xl spatial-surface font-mono">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block">ANOMALIES FLAGGED</span>
          <div className="text-3xl sm:text-4xl font-bold text-amber-300 tabular-telemetry tracking-tight mt-1">
            03
          </div>
          <span className="text-[10px] text-amber-400/90 mt-1 block">Isolation Forest Z &gt; 2.5</span>
        </div>

        <div className="p-4 rounded-xl spatial-surface font-mono">
          <span className="text-[10px] text-rose-400 uppercase tracking-widest block font-bold">EARLY WARNINGS</span>
          <div className="text-3xl sm:text-4xl font-bold text-rose-400 tabular-telemetry tracking-tight mt-1">
            {isDemoActive ? '03' : '02'}
          </div>
          <span className="text-[10px] text-rose-400 mt-1 block">Threshold Cutoff Breached</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONTINUOUS LIVE TELEMETRY STREAM TICKER           */}
      {/* ============================================================ */}
      <LiveTelemetryTicker />

      {/* ============================================================ */}
      {/* SECTION 4: SCIENTIFIC TELEMETRY DATA VISUALIZATIONS          */}
      {/* Oscilloscope Trajectory + High-Priority Matrix Grid          */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scientific Resistance Trajectory (lg:col-span-7) */}
        <div className="lg:col-span-7 p-5 rounded-xl spatial-surface font-mono flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                RESISTANCE TRAJECTORY // 12-MONTH SURVEILLANCE
              </div>
              <span className="text-[10px] text-slate-500 tabular-telemetry">FREQ: MONTHLY AGGREGATE</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4 font-sans">
              Escherichia coli vs Ciprofloxacin prevalence (%) across sentinel reporting facilities
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryData} margin={{ top: 12, right: 12, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#475569" 
                    fontSize={10} 
                    fontFamily="monospace" 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    fontFamily="monospace" 
                    domain={[20, 60]} 
                    tickFormatter={(v) => `${v}%`} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#06090e', 
                      borderColor: 'rgba(24,191,255,0.3)', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      fontFamily: 'monospace' 
                    }} 
                  />
                  <ReferenceLine 
                    y={40} 
                    stroke="#FF3B4E" 
                    strokeDasharray="4 4" 
                    label={{ value: '40% WHO ALERT CUTOFF', fill: '#FF3B4E', fontSize: 9, position: 'insideTopRight' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#18BFFF" 
                    strokeWidth={2} 
                    dot={{ fill: '#020406', stroke: '#18BFFF', strokeWidth: 2, r: 3.5 }}
                    activeDot={{ r: 6, fill: '#FF3B4E', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              CURRENT APR 2025: <strong className="text-rose-400 font-bold tabular-telemetry">{isDemoActive ? '48.0%' : '34.2%'}</strong>
            </span>
            <button 
              onClick={() => onNavigate('trends')} 
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              FULL TREND ANALYSIS <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Pathogen × Antibiotic Resistance Matrix (lg:col-span-5) */}
        <div className="lg:col-span-5 p-5 rounded-xl spatial-surface font-mono flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                PRIORITY RESISTANCE MATRIX
              </div>
              <span className="text-[10px] text-slate-500">WHO PRIORITY LIST</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 font-sans">
              Empiric phenotype resistance prevalence by target pathogen
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-white/[0.06] text-slate-500 text-[10px]">
                    <th className="pb-1.5 font-medium">ORGANISM</th>
                    <th className="pb-1.5 text-center font-medium">CIP</th>
                    <th className="pb-1.5 text-center font-medium">GEN</th>
                    <th className="pb-1.5 text-center font-medium">CTX</th>
                    <th className="pb-1.5 text-center font-medium">MER</th>
                    <th className="pb-1.5 text-center font-medium">AMK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {matrixRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2 text-slate-200 italic font-sans text-xs">{row.pathogen}</td>
                      <td className="py-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] tabular-telemetry ${getHeatColor(row.cip)}`}>
                          {row.cip}%
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] tabular-telemetry ${getHeatColor(row.gen)}`}>
                          {row.gen}%
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] tabular-telemetry ${getHeatColor(row.ctx)}`}>
                          {row.ctx}%
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] tabular-telemetry ${getHeatColor(row.mer)}`}>
                          {row.mer}%
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] tabular-telemetry ${getHeatColor(row.amk)}`}>
                          {row.amk}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
            <span className="text-slate-500 text-[10px]">ALERT CUTOFF: &gt;40% FLAGGED</span>
            <button 
              onClick={() => onNavigate('matrix')}
              className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              OPEN FULL MATRIX <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: LIVE DEMO WORKFLOW PIPELINE                       */}
      {/* 7-Step Telemetry Pipeline: Reports -> Warning               */}
      {/* ============================================================ */}
      <div className="p-5 rounded-xl spatial-surface font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              END-TO-END DEMO WORKFLOW // DETERMINISTIC PIPELINE
            </span>
          </div>
          <span className="text-[10px] text-slate-500 tracking-wider">
            PIPELINE STATUS: {isDemoActive ? 'SPIKE INGESTED (+17 PP)' : 'BASELINE ACTIVE (31%)'}
          </span>
        </div>

        {/* 7-Step Telemetry Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 my-2 text-center">
          {[
            { step: '01', title: 'REPORTS', desc: 'Raw Specimen AST' },
            { step: '02', title: 'INGESTION', desc: 'Standardized Isolate' },
            { step: '03', title: 'ANALYSIS', desc: 'Pattern Matching' },
            { step: '04', title: 'SHIFT (+17pp)', desc: '31% → 48%' },
            { step: '05', title: 'ANOMALY', desc: 'Isolation Forest' },
            { step: '06', title: 'WARNING', desc: '40% Cutoff Crossed' },
            { step: '07', title: 'ACTION', desc: 'Stewardship Trigger' },
          ].map((node, i) => (
            <div 
              key={i} 
              className={`p-2.5 rounded-lg border transition-all ${
                isDemoActive
                  ? 'bg-cyan-500/10 border-cyan-400/40 text-white shadow-[0_0_12px_rgba(24,191,255,0.15)]'
                  : 'bg-[#020406] border-white/[0.04] text-slate-400'
              }`}
            >
              <div className="text-[9px] text-cyan-400 font-bold">{node.step}</div>
              <div className="text-[11px] font-bold text-slate-200 mt-0.5">{node.title}</div>
              <div className="text-[9px] text-slate-500 mt-0.5">{node.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
