import { TemporalTrend, AnomalyResult, RiskAssessment, RiskCategory } from '../types';

/**
 * RESISTRA Intelligence Service — Transparent Risk Score Engine
 * Computes explainable risk scores based on magnitude of increase, persistence, anomaly score, sample volume, and multi-facility spread.
 */
export function calculateRiskAssessment(
  trend: TemporalTrend,
  anomaly: AnomalyResult,
  facilityCount: number = 1
): RiskAssessment {
  const {
    currentRate,
    absoluteChange,
    consecutiveIncreasingPeriods,
    organism,
    antibiotic
  } = trend;

  const contributingFactors: string[] = [];
  let score = 20.0;

  // Factor 1: Magnitude of resistance increase
  if (absoluteChange >= 15.0) {
    score += 35.0;
    contributingFactors.push(`+${absoluteChange.toFixed(1)} percentage-point resistance increase`);
  } else if (absoluteChange >= 8.0) {
    score += 20.0;
    contributingFactors.push(`+${absoluteChange.toFixed(1)} percentage-point resistance increase`);
  } else if (absoluteChange >= 4.0) {
    score += 10.0;
    contributingFactors.push(`+${absoluteChange.toFixed(1)} percentage-point resistance increase`);
  }

  // Factor 2: Persistence (consecutive increasing periods)
  if (consecutiveIncreasingPeriods >= 3) {
    score += 20.0;
    contributingFactors.push(`${consecutiveIncreasingPeriods} consecutive increasing reporting periods`);
  } else if (consecutiveIncreasingPeriods >= 2) {
    score += 10.0;
    contributingFactors.push(`${consecutiveIncreasingPeriods} consecutive increasing reporting periods`);
  }

  // Factor 3: Anomaly score
  if (anomaly.anomalyScore >= 75.0) {
    score += 20.0;
    contributingFactors.push(`Anomaly score (${anomaly.anomalyScore}/100) above surveillance threshold`);
  } else if (anomaly.anomalyScore >= 50.0) {
    score += 10.0;
    contributingFactors.push(`Elevated statistical anomaly score (${anomaly.anomalyScore}/100)`);
  }

  // Factor 4: High baseline threshold
  if (currentRate >= 60.0) {
    score += 15.0;
    contributingFactors.push(`High absolute prevalence (${currentRate}%) exceeding 60% empirical threshold`);
  } else if (currentRate >= 40.0) {
    score += 10.0;
    contributingFactors.push(`Prevalence (${currentRate}%) exceeding 40% warning threshold`);
  }

  // Factor 5: Multi-facility spread
  if (facilityCount > 1) {
    score += 10.0;
    contributingFactors.push(`Observed across ${facilityCount} contributing regional facilities`);
  }

  const finalScore = Math.min(99.0, Math.max(5.0, Math.round(score * 10) / 10));

  // Category mapping
  let riskCategory: RiskCategory = 'WATCH';
  if (finalScore >= 80.0 || absoluteChange >= 15.0) {
    riskCategory = 'CRITICAL';
  } else if (finalScore >= 60.0 || absoluteChange >= 10.0) {
    riskCategory = 'HIGH';
  } else if (finalScore >= 40.0 || absoluteChange >= 4.0) {
    riskCategory = 'MODERATE';
  }

  const explanation = contributingFactors.length > 0 
    ? contributingFactors.join(' • ')
    : 'Baseline resistance profile within standard surveillance thresholds.';

  return {
    organism,
    antibiotic,
    riskCategory,
    riskScore: finalScore,
    contributingFactors,
    explanation
  };
}
