import { AlertSeverity } from '../types';

export const formatPercent = (val: number, decimals: number = 1): string => {
  return `${val.toFixed(decimals)}%`;
};

export const formatPercentagePointChange = (change: number): string => {
  if (change > 0) {
    return `↑ +${change.toFixed(1)} percentage points`;
  } else if (change < 0) {
    return `↓ ${change.toFixed(1)} percentage points`;
  }
  return `→ 0.0 percentage points`;
};

export const getSeverityBadgeStyle = (severity: AlertSeverity | 'normal' | 'Critical' | 'High' | 'Moderate' | 'Watch' | 'Low'): string => {
  const s = severity.toLowerCase();
  switch (s) {
    case 'critical':
      return 'bg-rose-600 text-white border-rose-700';
    case 'high':
      return 'bg-rose-500 text-white border-rose-600';
    case 'moderate':
    case 'medium':
      return 'bg-amber-500 text-white border-amber-600';
    case 'watch':
    case 'low':
      return 'bg-sky-600 text-white border-sky-700';
    default:
      return 'bg-slate-200 text-slate-700 border-slate-300';
  }
};

export const getSeverityBgLight = (severity: AlertSeverity | 'normal'): string => {
  switch (severity) {
    case 'critical':
      return 'bg-rose-50 border-rose-200 text-rose-950';
    case 'high':
      return 'bg-rose-50/60 border-rose-200 text-rose-900';
    case 'moderate':
      return 'bg-amber-50 border-amber-200 text-amber-950';
    case 'watch':
      return 'bg-sky-50 border-sky-200 text-sky-950';
    default:
      return 'bg-slate-50 border-slate-200 text-slate-900';
  }
};
