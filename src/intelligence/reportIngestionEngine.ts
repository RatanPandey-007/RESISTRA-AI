import { SurveillanceRecord, MedicalReport, EarlyWarningAlert } from '../types';
import { calculateTemporalTrend } from './trendEngine';
import { detectAnomaly } from './anomalyEngine';
import { calculateRiskAssessment } from './riskEngine';
import { generateExplainableSignal } from './explainabilityEngine';

export interface IngestionResult {
  updatedDataset: SurveillanceRecord[];
  generatedAlerts: EarlyWarningAlert[];
  ingestedRecordCount: number;
}

/**
 * RESISTRA Intelligence Service — Dynamic Report Ingestion Engine
 * Ingests a medical/lab culture report into the live dataset and recalculates all metrics, trends, anomalies, risks, and early warning alerts.
 */
export function ingestReportIntoDataset(
  existingDataset: SurveillanceRecord[],
  report: MedicalReport
): IngestionResult {
  const newRecords: SurveillanceRecord[] = [];

  report.antibioticsTested.forEach((ab, idx) => {
    newRecords.push({
      id: `SRV-INGESTED-${report.reportNumber}-${idx}`,
      reportId: report.reportNumber,
      date: report.collectionDate,
      facility: report.facility,
      department: report.department || 'Microbiology Lab',
      region: 'Metro Region',
      specimenType: (report.sampleType as any) || 'Urine Culture',
      organism: report.organismIdentified,
      antibiotic: ab.antibiotic,
      susceptibility: ab.susceptibility,
      micValue: ab.micValue,
      resistant: ab.susceptibility === 'Resistant' || ab.susceptibility === 'Intermediate',
      sampleCount: 1,
      patientContext: { patientId: report.patientId },
      dataSource: report.dataSource
    });
  });

  const updatedDataset = [...newRecords, ...existingDataset];

  // Re-run intelligence pipeline for top tracked pairs
  const trackedPairs = [
    { organism: 'Escherichia coli', antibiotic: 'Ciprofloxacin', facility: 'North Suburbs Health Zone' },
    { organism: 'Klebsiella pneumoniae', antibiotic: 'Meropenem', facility: 'St. Jude General Hospital' },
    { organism: 'Acinetobacter baumannii', antibiotic: 'Colistin', facility: 'University Hospital Center' },
    { organism: 'Staphylococcus aureus', antibiotic: 'Vancomycin', facility: 'Eastside Medical Center' },
    { organism: 'Pseudomonas aeruginosa', antibiotic: 'Meropenem', facility: 'Regional Burn Unit' }
  ];

  // If ingested report organism & antibiotic pair isn't in tracked list, add it dynamically
  report.antibioticsTested.forEach(ab => {
    if (!trackedPairs.some(p => p.organism === report.organismIdentified && p.antibiotic === ab.antibiotic)) {
      trackedPairs.unshift({
        organism: report.organismIdentified,
        antibiotic: ab.antibiotic,
        facility: report.facility
      });
    }
  });

  const generatedAlerts: EarlyWarningAlert[] = [];

  trackedPairs.forEach((pair, idx) => {
    const trend = calculateTemporalTrend(updatedDataset, pair.organism, pair.antibiotic);
    const anomaly = detectAnomaly(trend);
    const risk = calculateRiskAssessment(trend, anomaly);

    if (risk.riskCategory === 'CRITICAL' || risk.riskCategory === 'HIGH' || risk.riskCategory === 'MODERATE' || anomaly.isAnomaly) {
      const explainableSignal = generateExplainableSignal(trend, anomaly, risk, pair.facility);

      const surveillanceActions = [
        `Review local laboratory surveillance data for ${pair.organism}.`,
        `Consider confirmatory laboratory review of ${pair.antibiotic} MIC values.`,
        `Consider infection-control surveillance audit in ${pair.facility}.`,
        `Review local antibiogram for target pathogen.`,
        `Escalate findings to the appropriate antimicrobial stewardship team.`
      ];

      generatedAlerts.push({
        alertId: `ALT-DYNAMIC-${idx + 101}`,
        severity: risk.riskCategory,
        organism: pair.organism,
        antibiotic: pair.antibiotic,
        facility: pair.facility,
        region: 'Metro Region',
        detectedAt: report.collectionDate,
        resistanceChange: {
          previousRate: trend.previousRate,
          currentRate: trend.currentRate,
          absoluteChange: trend.absoluteChange,
          relativeChange: trend.relativeChange
        },
        anomalyScore: anomaly.anomalyScore,
        confidenceScore: explainableSignal.confidenceScore,
        reasons: risk.contributingFactors,
        explainableSignal,
        recommendedSurveillanceAction: surveillanceActions,
        status: 'active'
      });
    }
  });

  return {
    updatedDataset,
    generatedAlerts,
    ingestedRecordCount: newRecords.length
  };
}
