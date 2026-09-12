import React from 'react';

interface SpatialCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'rose' | 'amber' | 'blue' | 'none';
  elevated?: boolean;
  title?: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'cyan' | 'rose' | 'amber' | 'blue' | 'emerald';
  onClick?: () => void;
}

export const SpatialCard: React.FC<SpatialCardProps> = ({
  children,
  className = '',
  glow = 'none',
  elevated = false,
  title,
  subtitle,
  badge,
  badgeColor = 'cyan',
  onClick
}) => {
  const glowStyles = {
    cyan: 'border-cyan-500/30 shadow-[0_0_25px_-5px_rgba(0,240,255,0.15)]',
    rose: 'border-rose-500/30 shadow-[0_0_25px_-5px_rgba(244,63,94,0.2)]',
    amber: 'border-amber-500/30 shadow-[0_0_25px_-5px_rgba(245,158,11,0.18)]',
    blue: 'border-blue-500/30 shadow-[0_0_25px_-5px_rgba(59,130,246,0.2)]',
    none: 'border-white/[0.08]'
  };

  const badgeStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    blue: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
  };

  const baseGlass = elevated
    ? 'bg-space-850/80 backdrop-blur-2xl shadow-2xl'
    : 'bg-space-900/65 backdrop-blur-xl shadow-lg';

  const interactiveClasses = onClick
    ? 'cursor-pointer hover:-translate-y-1 hover:border-white/20 hover:bg-space-850/90 transition-all duration-200'
    : 'hover:-translate-y-0.5 hover:border-white/[0.14] transition-all duration-200';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl border ${glowStyles[glow]} ${baseGlass} ${interactiveClasses} p-5 overflow-hidden group ${className}`}
    >
      {/* Top subtle specular highlight edge */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Subtle corner light reflection */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/[0.02] rounded-full blur-xl pointer-events-none group-hover:bg-white/[0.04] transition-all" />

      {/* Optional Card Header */}
      {(title || badge) && (
        <div className="flex items-start justify-between gap-3 mb-3 border-b border-white/[0.06] pb-3">
          <div>
            {title && (
              <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {badge && (
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${badgeStyles[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>
      )}

      {children}
    </div>
  );
};
