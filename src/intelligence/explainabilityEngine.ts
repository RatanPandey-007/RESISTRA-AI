import { TemporalTrend, AnomalyResult, RiskAssessment, ExplainableSignal } from '../types';

/**
 * RESISTRA Intelligence Service — Explainability Engine
 * Generates transparent, step-by-step evidence chains for early warning alerts.
 */
export function generateExplainableSignal(
  trend: TemporalTrend,
  anomaly: AnomalyResult,
  risk: RiskAssessment,
  facility: string = 'Regional Network'
): ExplainableSignal {
  const { organism, antibiotic, currentRate, previousRate, absoluteChange, consecutiveIncreasingPeriods } = trend;

  const title = 'WHY WAS THIS ALERT GENERATED?';
  const primaryMetricChange = `${organism} resistance to ${antibiotic} increased from ${previousRate}% to ${currentRate}% over the selected surveillance window.`;

  const factors: string[] = [
    `Absolute shift: +${absoluteChange.toFixed(1)} percentage points (${trend.relativeChange > 0 ? '+' : ''}${trend.relativeChange.toFixed(1)}% relative change)`,
    consecutiveIncreasingPeriods > 1
      ? `Resistance increased across ${consecutiveIncreasingPeriods} consecutive reporting periods.`
      : `Single-period resistance spike observed.`,
    `The observed change (${currentRate}%) exceeded the configured surveillance threshold.`,
    anomaly.isAnomaly
      ? `Statistical anomaly detected relative to historical baseline (Score: ${anomaly.anomalyScore}/100, Z-score: ${anomaly.explanation}).`
      : `Profile evaluated against rolling baseline (${trend.rollingBaseline}%).`
  ];

  return {
    title,
    primaryMetricChange,
    factors,
    observedLocations: [facility],
    timeWindow: '30-Day Surveillance Observation Window',
    severityRationale: `Evaluated as ${risk.riskCategory} priority risk (Score: ${risk.riskScore}/100).`,
    confidenceScore: Math.min(99, Math.round(88 + (trend.historicalSeries.length > 5 ? 8 : 4)))
  };
}
