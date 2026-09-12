import { SurveillanceRecord, TemporalTrend, TrendDirection } from '../types';

/**
 * RESISTRA Intelligence Service — Temporal Trend Engine
 * Computes longitudinal trends, rolling baselines, absolute/relative changes, and consecutive periods drift.
 */
export function calculateTemporalTrend(
  records: SurveillanceRecord[],
  targetOrganism: string,
  targetAntibiotic: string
): TemporalTrend {
  // Filter for target pair
  const matches = records.filter(
    r => r.organism.toLowerCase() === targetOrganism.toLowerCase() &&
         r.antibiotic.toLowerCase() === targetAntibiotic.toLowerCase()
  );

  if (matches.length === 0) {
    return {
      organism: targetOrganism,
      antibiotic: targetAntibiotic,
      currentRate: 0,
      previousRate: 0,
      absoluteChange: 0,
      relativeChange: 0,
      rollingBaseline: 0,
      rollingStdDev: 0,
      trendDirection: 'STABLE',
      consecutiveIncreasingPeriods: 0,
      observationPeriodCount: 0,
      historicalSeries: []
    };
  }

  // Sort by date YYYY-MM
  const periodMap: Record<string, { total: number; resistant: number }> = {};
  matches.forEach(m => {
    const period = m.date.substring(0, 7); // e.g. "2026-09"
    if (!periodMap[period]) {
      periodMap[period] = { total: 0, resistant: 0 };
    }
    periodMap[period].total += m.sampleCount;
    if (m.resistant) {
      periodMap[period].resistant += m.sampleCount;
    }
  });

  const sortedPeriods = Object.keys(periodMap).sort();
  const series = sortedPeriods.map(p => {
    const total = periodMap[p].total;
    const resistant = periodMap[p].resistant;
    const rate = total > 0 ? Math.round((resistant / total) * 100 * 10) / 10 : 0;
    return { month: p, rate, sampleCount: total };
  });

  if (series.length === 1) {
    return {
      organism: targetOrganism,
      antibiotic: targetAntibiotic,
      currentRate: series[0].rate,
      previousRate: series[0].rate,
      absoluteChange: 0,
      relativeChange: 0,
      rollingBaseline: series[0].rate,
      rollingStdDev: 0,
      trendDirection: 'STABLE',
      consecutiveIncreasingPeriods: 0,
      observationPeriodCount: 1,
      historicalSeries: series
    };
  }

  const currentRate = series[series.length - 1].rate;
  const previousRate = series[series.length - 2].rate;

  // Absolute change in percentage points (e.g. 48% - 31% = +17.0)
  const absoluteChange = Math.round((currentRate - previousRate) * 10) / 10;

  // Relative change in % (e.g. +17 / 31 * 100 = +54.8%)
  const relativeChange = previousRate > 0 
    ? Math.round(((currentRate - previousRate) / previousRate) * 100 * 10) / 10
    : absoluteChange > 0 ? 100 : 0;

  // Rolling baseline and StdDev calculation over baseline series (excluding latest spike period if evaluating baseline)
  const rates = series.map(s => s.rate);
  const sum = rates.reduce((a, b) => a + b, 0);
  const rollingBaseline = Math.round((sum / rates.length) * 10) / 10;

  const variance = rates.reduce((a, b) => a + Math.pow(b - rollingBaseline, 2), 0) / rates.length;
  const rollingStdDev = Math.round(Math.sqrt(variance) * 10) / 10;

  // Calculate consecutive increasing periods count
  let consecutiveIncreasingPeriods = 0;
  for (let i = series.length - 1; i > 0; i--) {
    if (series[i].rate > series[i - 1].rate) {
      consecutiveIncreasingPeriods++;
    } else {
      break;
    }
  }

  // Trend direction mapping
  let trendDirection: TrendDirection = 'STABLE';
  if (absoluteChange >= 2.0) {
    trendDirection = 'INCREASING';
  } else if (absoluteChange <= -2.0) {
    trendDirection = 'DECREASING';
  }

  return {
    organism: targetOrganism,
    antibiotic: targetAntibiotic,
    currentRate,
    previousRate,
    absoluteChange,
    relativeChange,
    rollingBaseline,
    rollingStdDev,
    trendDirection,
    consecutiveIncreasingPeriods,
    observationPeriodCount: series.length,
    historicalSeries: series
  };
}
