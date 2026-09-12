import { TemporalTrend, AnomalyResult } from '../types';

/**
 * RESISTRA Intelligence Service — Anomaly Detection Engine
 * Integrates statistical Z-score variance analysis with features matching Python Isolation Forest model:
 * [current_rate, previous_rate, absolute_change, rolling_mean, rolling_std, consecutive_increases, sample_volume]
 */
export function detectAnomaly(trend: TemporalTrend): AnomalyResult {
  const {
    currentRate,
    absoluteChange,
    rollingBaseline,
    rollingStdDev,
    consecutiveIncreasingPeriods,
    organism,
    antibiotic
  } = trend;

  // Feature Extraction matching Python Isolation Forest Vector
  const devFromMean = currentRate - rollingBaseline;
  
  // Compute Z-score deviation against rolling std dev
  const std = rollingStdDev > 0.5 ? rollingStdDev : 1.5;
  const zScore = devFromMean / std;

  // Calculate Anomaly Score (0 - 100)
  let rawScore = 15.0;

  if (absoluteChange >= 15.0) rawScore += 45.0;
  else if (absoluteChange >= 8.0) rawScore += 30.0;
  else if (absoluteChange >= 4.0) rawScore += 15.0;

  if (zScore >= 2.5) rawScore += 25.0;
  else if (zScore >= 1.5) rawScore += 15.0;

  if (consecutiveIncreasingPeriods >= 3) rawScore += 15.0;
  else if (consecutiveIncreasingPeriods >= 2) rawScore += 8.0;

  if (currentRate >= 60.0) rawScore += 10.0;

  const anomalyScore = Math.min(99.0, Math.max(5.0, Math.round(rawScore * 10) / 10));
  const isAnomaly = anomalyScore >= 60.0 || absoluteChange >= 10.0;

  let anomalyType: 'SPIKE' | 'DRIFT' | 'CLUSTER' = 'SPIKE';
  if (consecutiveIncreasingPeriods >= 3) anomalyType = 'DRIFT';

  let explanation = `Normal baseline variation (${currentRate}% vs rolling mean ${rollingBaseline}%).`;
  if (isAnomaly) {
    explanation = `Unusual resistance ${anomalyType.toLowerCase()} detected: +${absoluteChange.toFixed(1)} percentage-point shift (Z-score: ${zScore.toFixed(2)}) over ${consecutiveIncreasingPeriods || 1} observation period(s).`;
  }

  return {
    organism,
    antibiotic,
    anomalyScore,
    isAnomaly,
    anomalyType,
    deviationFromBaseline: Math.round(devFromMean * 10) / 10,
    explanation,
    modelUsed: 'STATISTICAL_ZSCORE'
  };
}
