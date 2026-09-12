import { calculateTemporalTrend } from './trendEngine';
import { detectAnomaly } from './anomalyEngine';
import { calculateRiskAssessment } from './riskEngine';
import { SurveillanceRecord } from '../types';

export interface TestCaseResult {
  caseName: string;
  passed: boolean;
  details: string;
  output: any;
}

/**
 * Developer validation suite running the 4 required test cases.
 */
export function runValidationSuite(): TestCaseResult[] {
  const results: TestCaseResult[] = [];

  // CASE 1: 31% -> 48% (+17 percentage points)
  const case1Records: SurveillanceRecord[] = [
    ...generateTestBatch('2026-08-01', 'Escherichia coli', 'Ciprofloxacin', 31, 100),
    ...generateTestBatch('2026-09-01', 'Escherichia coli', 'Ciprofloxacin', 48, 100)
  ];
  const trend1 = calculateTemporalTrend(case1Records, 'Escherichia coli', 'Ciprofloxacin');
  const anomaly1 = detectAnomaly(trend1);
  const risk1 = calculateRiskAssessment(trend1, anomaly1);

  const case1Passed = 
    trend1.trendDirection === 'INCREASING' &&
    trend1.absoluteChange === 17.0 &&
    (risk1.riskCategory === 'HIGH' || risk1.riskCategory === 'CRITICAL');

  results.push({
    caseName: 'CASE 1: 31% → 48% Resistance Spike',
    passed: case1Passed,
    details: `Output: trend=${trend1.trendDirection}, absChange=+${trend1.absoluteChange} percentage points, risk=${risk1.riskCategory}`,
    output: { trend: trend1, risk: risk1 }
  });

  // CASE 2: Stable resistance (30% -> 30.2%)
  const case2Records: SurveillanceRecord[] = [
    ...generateTestBatch('2026-08-01', 'Staphylococcus aureus', 'Vancomycin', 30.0, 100),
    ...generateTestBatch('2026-09-01', 'Staphylococcus aureus', 'Vancomycin', 30.2, 100)
  ];
  const trend2 = calculateTemporalTrend(case2Records, 'Staphylococcus aureus', 'Vancomycin');
  const anomaly2 = detectAnomaly(trend2);
  const risk2 = calculateRiskAssessment(trend2, anomaly2);

  const case2Passed = trend2.trendDirection === 'STABLE' && !anomaly2.isAnomaly && (risk2.riskCategory === 'WATCH' || risk2.riskCategory === 'MODERATE');

  results.push({
    caseName: 'CASE 2: Stable Resistance Baseline',
    passed: case2Passed,
    details: `Output: trend=${trend2.trendDirection}, absChange=+${trend2.absoluteChange} percentage points, risk=${risk2.riskCategory}`,
    output: { trend: trend2, risk: risk2 }
  });

  // CASE 3: Sudden isolated spike (10% -> 35%)
  const case3Records: SurveillanceRecord[] = [
    ...generateTestBatch('2026-08-01', 'Acinetobacter baumannii', 'Colistin', 10.0, 100),
    ...generateTestBatch('2026-09-01', 'Acinetobacter baumannii', 'Colistin', 35.0, 100)
  ];
  const trend3 = calculateTemporalTrend(case3Records, 'Acinetobacter baumannii', 'Colistin');
  const anomaly3 = detectAnomaly(trend3);

  const case3Passed = anomaly3.isAnomaly && anomaly3.anomalyScore >= 60.0;

  results.push({
    caseName: 'CASE 3: Sudden Isolated Resistance Spike',
    passed: case3Passed,
    details: `Output: isAnomaly=${anomaly3.isAnomaly}, anomalyScore=${anomaly3.anomalyScore}/100`,
    output: { trend: trend3, anomaly: anomaly3 }
  });

  // CASE 4: Persistent increase across multiple periods (20% -> 28% -> 38% -> 48%)
  const case4Records: SurveillanceRecord[] = [
    ...generateTestBatch('2026-06-01', 'Klebsiella pneumoniae', 'Meropenem', 20.0, 100),
    ...generateTestBatch('2026-07-01', 'Klebsiella pneumoniae', 'Meropenem', 28.0, 100),
    ...generateTestBatch('2026-08-01', 'Klebsiella pneumoniae', 'Meropenem', 38.0, 100),
    ...generateTestBatch('2026-09-01', 'Klebsiella pneumoniae', 'Meropenem', 48.0, 100)
  ];
  const trend4 = calculateTemporalTrend(case4Records, 'Klebsiella pneumoniae', 'Meropenem');
  const anomaly4 = detectAnomaly(trend4);
  const risk4 = calculateRiskAssessment(trend4, anomaly4);

  const case4Passed = trend4.consecutiveIncreasingPeriods >= 3 && (risk4.riskCategory === 'HIGH' || risk4.riskCategory === 'CRITICAL');

  results.push({
    caseName: 'CASE 4: Persistent Increase Across Multiple Periods',
    passed: case4Passed,
    details: `Output: consecutiveIncreasingPeriods=${trend4.consecutiveIncreasingPeriods}, risk=${risk4.riskCategory}`,
    output: { trend: trend4, risk: risk4 }
  });

  return results;
}

function generateTestBatch(date: string, organism: string, antibiotic: string, resistantPercentage: number, count: number): SurveillanceRecord[] {
  const records: SurveillanceRecord[] = [];
  const resistantCount = Math.round((resistantPercentage / 100) * count);
  for (let i = 0; i < count; i++) {
    records.push({
      id: `TEST-${date}-${i}`,
      reportId: `REP-TEST-${date}`,
      date,
      facility: 'Test Hospital',
      department: 'Lab Unit',
      region: 'Test Region',
      specimenType: 'Urine Culture',
      organism,
      antibiotic,
      susceptibility: i < resistantCount ? 'Resistant' : 'Susceptible',
      resistant: i < resistantCount,
      sampleCount: 1,
      dataSource: 'DEMO_SYNTHETIC'
    });
  }
  return records;
}
