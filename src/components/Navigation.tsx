import React from 'react';
import { PageId } from '../types';
import { 
  LayoutDashboard, 
  FileText, 
  TrendingUp, 
  Grid3X3, 
  AlertTriangle, 
  Database, 
  Settings, 
  ShieldAlert,
  Bell,
  Zap,
  RotateCcw,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  activeAlertsCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenDataStatus?: () => void;
}

// CyberCityIllustration SVG inline for zero external dependency & ultra-sharp rendering
const CyberCityIllustration: React.FC = () => (
  <div className="relative w-full h-24 overflow-hidden rounded-lg bg-[#040913] border border-cyan-500/20 shadow-inner mb-2.5">
    <div className="absolute inset-0 bg-gradient-to-t from-[#040913] via-transparent to-cyan-950/20 pointer-events-none" />
    <svg viewBox="0 0 300 100" className="w-full h-full object-cover" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="navBeam1" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#18bfff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#18bfff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="navBeam2" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#4d8dff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4d8dff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="navBldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#122c47" />
          <stop offset="100%" stopColor="#040913" />
        </linearGradient>
      </defs>
      {/* Holographic light beams */}
      <polygon points="50,100 58,0 66,0 74,100" fill="url(#navBeam1)" opacity="0.35" />
      <polygon points="120,100 130,0 138,0 148,100" fill="url(#navBeam2)" opacity="0.45" />
      <polygon points="200,100 212,0 220,0 232,100" fill="url(#navBeam1)" opacity="0.35" />

      {/* Buildings */}
      <rect x="15" y="38" width="20" height="62" fill="url(#navBldg)" stroke="#18bfff" strokeWidth="0.4" opacity="0.7" />
      <rect x="40" y="24" width="26" height="76" fill="url(#navBldg)" stroke="#18bfff" strokeWidth="0.4" opacity="0.85" />
      <rect x="72" y="10" width="30" height="90" fill="url(#navBldg)" stroke="#4d8dff" strokeWidth="0.5" />
      <line x1="87" y1="2" x2="87" y2="10" stroke="#18bfff" strokeWidth="1" />
      <rect x="108" y="30" width="24" height="70" fill="url(#navBldg)" stroke="#18bfff" strokeWidth="0.4" opacity="0.75" />
      <rect x="138" y="14" width="34" height="86" fill="url(#navBldg)" stroke="#18bfff" strokeWidth="0.5" />
      <line x1="155" y1="4" x2="155" y2="14" stroke="#25e6b0" strokeWidth="1" />
      <rect x="178" y="26" width="26" height="74" fill="url(#navBldg)" stroke="#18bfff" strokeWidth="0.4" opacity="0.8" />
      <rect x="210" y="12" width="30" height="88" fill="url(#navBldg)" stroke="#4d8dff" strokeWidth="0.5" />
      <line x1="225" y1="3" x2="225" y2="12" stroke="#18bfff" strokeWidth="1" />
      <rect x="246" y="34" width="22" height="66" fill="url(#navBldg)" stroke="#18bfff" strokeWidth="0.4" opacity="0.7" />
      <rect x="274" y="42" width="20" height="58" fill="url(#navBldg)" stroke="#18bfff" strokeWidth="0.4" opacity="0.6" />

      {/* Glowing windows */}
      <g fill="#18bfff" opacity="0.85">
        <rect x="78" y="18" width="3" height="2" />
        <rect x="85" y="18" width="3" height="2" />
        <rect x="92" y="18" width="3" height="2" fill="#25e6b0" />
        <rect x="78" y="26" width="3" height="2" />
        <rect x="92" y="26" width="3" height="2" />
        <rect x="144" y="22" width="4" height="2" />
        <rect x="154" y="22" width="4" height="2" fill="#25e6b0" />
        <rect x="164" y="22" width="4" height="2" />
        <rect x="144" y="32" width="4" height="2" />
        <rect x="164" y="32" width="4" height="2" fill="#ffb020" />
        <rect x="216" y="20" width="3" height="2" />
        <rect x="224" y="20" width="3" height="2" />
        <rect x="232" y="20" width="3" height="2" fill="#25e6b0" />
        <rect x="216" y="28" width="3" height="2" />
        <rect x="232" y="28" width="3" height="2" />
      </g>
      {/* Floor grid */}
      <line x1="0" y1="96" x2="300" y2="96" stroke="#18bfff" strokeWidth="0.6" opacity="0.5" />
      <line x1="40" y1="96" x2="20" y2="100" stroke="#18bfff" strokeWidth="0.4" opacity="0.4" />
      <line x1="100" y1="96" x2="90" y2="100" stroke="#18bfff" strokeWidth="0.4" opacity="0.4" />
      <line x1="160" y1="96" x2="160" y2="100" stroke="#18bfff" strokeWidth="0.4" opacity="0.4" />
      <line x1="220" y1="96" x2="230" y2="100" stroke="#18bfff" strokeWidth="0.4" opacity="0.4" />
    </svg>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ 
  activePage, 
  onNavigate, 
  activeAlertsCount,
  isOpenMobile = false,
  onCloseMobile,
  onOpenDataStatus
}) => {
  const sections = [
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analysis' as PageId, label: 'Report Analysis', icon: FileText },
        { id: 'trends' as PageId, label: 'AMR Trends', icon: TrendingUp },
        { id: 'matrix' as PageId, label: 'Resistance Matrix', icon: Grid3X3 },
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'alerts' as PageId, label: 'Alerts', icon: AlertTriangle, badge: activeAlertsCount || 7 },
        { id: 'reports' as PageId, label: 'Reports', icon: Database },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings' as PageId, label: 'Settings', icon: Settings },
      ]
    }
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-[#03070d]/80 z-40 md:hidden backdrop-blur-md transition-opacity"
        />
      )}

      {/* Mission Control Sidebar Drawer */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-60 bg-[#020406] text-slate-300 flex flex-col border-r border-white/[0.05] z-50 shrink-0 transition-transform duration-200 ${
        isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 shadow-[0_0_15px_rgba(24,191,255,0.25)]">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-white tracking-wider text-sm font-sans">RESISTRA AI</span>
              </div>
              <p className="text-[9.5px] text-cyan-300/80 font-mono tracking-tight leading-none mt-0.5">
                AI-Powered Antimicrobial Resistance Intelligence
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button 
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grouped Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              <div className="px-2.5 pb-1 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-semibold shadow-[0_0_15px_rgba(24,191,255,0.25)]'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(255,59,78,0.5)]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Synthetic Demonstration Data Card */}
        <div className="p-3 border-t border-white/[0.08] bg-[#07111d]/95">
          <CyberCityIllustration />
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
              SYNTHETIC DEMONSTRATION DATA
            </h4>
            <p className="text-[9px] text-slate-400 leading-tight">
              This prototype demonstrates the analytical workflow using synthetic surveillance data. Clinical deployment requires validated datasets, expert evaluation, regulatory review and prospective validation.
            </p>
            <div className="pt-1.5 border-t border-white/[0.06] text-[8.5px] text-slate-500 leading-tight">
              {onOpenDataStatus ? (
                <button 
                  onClick={onOpenDataStatus}
                  className="text-left text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Not a diagnostic system. Not a treatment recommendation.
                </button>
              ) : (
                <span>Not a diagnostic system. Not a treatment recommendation.</span>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

interface HeaderProps {
  activePage: PageId;
  activeAlertsCount: number;
  isDemoActive: boolean;
  onRunDemo: () => void;
  onResetDemo: () => void;
  onOpenMobileMenu?: () => void;
  onOpenDataStatus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onRunDemo,
  onResetDemo,
  isDemoActive,
  activeAlertsCount,
  onOpenMobileMenu,
  onOpenDataStatus
}) => {
  return (
    <header className="bg-[#020406] border-b border-white/[0.05] sticky top-0 z-20 px-4 sm:px-6 py-2.5 shadow-lg flex items-center justify-between gap-4">
      {/* Left: Title & Subtitle + System Active + Synthetic Data Pills */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(24,191,255,0.2)]">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
        </div>

        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide font-sans">
              AMR INTELLIGENCE CENTER
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-semibold shadow-[0_0_8px_rgba(37,230,176,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SYSTEM ACTIVE</span>
              </span>
              <button
                onClick={onOpenDataStatus}
                className="px-2.5 py-0.5 rounded-full bg-[#03070d]/80 border border-white/10 hover:border-cyan-500/30 text-slate-300 font-mono text-[10px] transition-colors cursor-pointer"
              >
                SYNTHETIC DATA
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
            Population-level resistance surveillance
          </p>
        </div>
      </div>

      {/* Right: Date/Time + Notifications + User Avatar */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Reset / Trigger if active */}
        {isDemoActive ? (
          <button
            onClick={onResetDemo}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] rounded-lg transition-colors cursor-pointer"
            title="Reset back to baseline"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" /> Reset Baseline
          </button>
        ) : (
          <button
            onClick={onRunDemo}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold text-[#03070d] bg-cyan-400 hover:bg-white rounded-lg shadow-[0_0_12px_rgba(24,191,255,0.3)] transition-all cursor-pointer"
          >
            <Zap className="w-3 h-3 fill-current" /> RUN DEMO
          </button>
        )}

        {/* Timestamp */}
        <div className="text-right text-[11px] font-mono text-slate-300 hidden md:block">
          <div>Apr 26, 2025</div>
          <div className="text-[10px] text-slate-500">14:32 UTC</div>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
          {activeAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_6px_rgba(255,59,78,0.8)]"></span>
          )}
        </button>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600/30 to-indigo-600/30 border border-white/15 flex items-center justify-center text-slate-300 text-xs font-mono font-bold shadow-inner">
          SA
        </div>
      </div>
    </header>
  );
};
