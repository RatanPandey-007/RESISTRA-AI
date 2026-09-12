import { SurveillanceRecord } from '../types';

export const DATASET_METRICS = {
  baselineReports: 5000,
  baselineIsolates: 14280,
  ingestedReportsDelta: 200,
  ingestedIsolatesDelta: 450,
  postDemoReports: 5200,
  postDemoIsolates: 14730,
  contributingFacilities: 38
};

/**
 * Baseline Surveillance Dataset.
 * E. coli + Ciprofloxacin baseline rate is at 31.0%.
 */
export const BASELINE_SURVEILLANCE_DATASET: SurveillanceRecord[] = [
  // E. coli + Ciprofloxacin Baseline Series (Oct 2025 - Aug 2026 at ~31% stable baseline)
  ...generateIsolateBatch('2025-10-15', 'Escherichia coli', 'Ciprofloxacin', 'North Suburbs Health Zone', 'Outpatient Clinic', 'Metro Region', 30.5, 100),
  ...generateIsolateBatch('2025-11-15', 'Escherichia coli', 'Ciprofloxacin', 'North Suburbs Health Zone', 'Outpatient Clinic', 'Metro Region', 30.8, 100),
  ...generateIsolateBatch('2025-12-15', 'Escherichia coli', 'Ciprofloxacin', 'North Suburbs Health Zone', 'Outpatient Clinic', 'Metro Region', 31.0, 100),
  ...generateIsolateBatch('2026-01-15', 'Escherichia coli', 'Ciprofloxacin', 'North Suburbs Health Zone', 'Outpatient Clinic', 'Metro Region', 31.2, 100),
  ...generateIsolateBatch('2026-02-15', 'Escherichia coli', 'Ciprofloxacin', 'North Suburbs Health Zone', 'Outpatient Clinic', 'Metro Region', 30.9, 100),
  ...generateIsolateBatch('2026-03-15', 'Escherichia coli', 'Ciprofloxacin', 'North Suburbs Health Zone', 'Outpatient Clinic', 'Metro Region', 31.0, 100),
  ...generateIsolateBatch('2026-04-15', 'Escherichia coli', 'Ciprofloxacin', 'North Suburbs Health Zone', 'Outpatient Clinic', 'Metro Region', 31.1, 100),
  ...generateIsolateBatch('2026-05-15', 'Escherichia coli', 'Ciprofloxacin', 'North Suburbs Health Zone', 'Outpatient Clinic', 'Metro Region', 30.8, 100),
  ...generateIsolateBatch('2026-06-15', 'Escherichia coli', 'Ciprofloxacin', 'North Suburbs Health Zone', 'Outpatient Clinic', 'Metro Region', 31.0, 100),
  ...generateIsolateBatch('2026-07-15', 'Escherichia coli', 'Ciprofloxacin', 'North Suburbs Health Zone', 'Outpatient Clinic', 'Metro Region', 31.2, 100),
  ...generateIsolateBatch('2026-08-15', 'Escherichia coli', 'Ciprofloxacin', 'North Suburbs Health Zone', 'Outpatient Clinic', 'Metro Region', 31.0, 100),

  // Klebsiella pneumoniae + Meropenem ICU Baseline Series (30.2%)
  ...generateIsolateBatch('2025-10-10', 'Klebsiella pneumoniae', 'Meropenem', 'St. Jude General Hospital', 'ICU Ward B', 'Metro Central', 30.0, 80),
  ...generateIsolateBatch('2026-03-10', 'Klebsiella pneumoniae', 'Meropenem', 'St. Jude General Hospital', 'ICU Ward B', 'Metro Central', 30.2, 80),
  ...generateIsolateBatch('2026-08-10', 'Klebsiella pneumoniae', 'Meropenem', 'St. Jude General Hospital', 'ICU Ward B', 'Metro Central', 30.2, 80),

  // Acinetobacter baumannii + Colistin Series
  ...generateIsolateBatch('2026-03-01', 'Acinetobacter baumannii', 'Colistin', 'University Hospital Center', 'Burn & Trauma ICU', 'Metro Region', 11.5, 50),
  ...generateIsolateBatch('2026-08-01', 'Acinetobacter baumannii', 'Colistin', 'University Hospital Center', 'Burn & Trauma ICU', 'Metro Region', 11.5, 50),

  // Staphylococcus aureus + Vancomycin Series (4.2%)
  ...generateIsolateBatch('2026-03-15', 'Staphylococcus aureus', 'Vancomycin', 'Eastside Medical Center', 'Surgical Ward', 'East District', 4.2, 60),
  ...generateIsolateBatch('2026-08-15', 'Staphylococcus aureus', 'Vancomycin', 'Eastside Medical Center', 'Surgical Ward', 'East District', 4.2, 60),

  // Pseudomonas aeruginosa + Meropenem Series (28.0%)
  ...generateIsolateBatch('2026-03-20', 'Pseudomonas aeruginosa', 'Meropenem', 'Regional Burn Unit', 'Sub-Acute Unit', 'West District', 28.0, 50),
  ...generateIsolateBatch('2026-08-20', 'Pseudomonas aeruginosa', 'Meropenem', 'Regional Burn Unit', 'Sub-Acute Unit', 'West District', 28.0, 50)
];

/**
 * Designated Demo Ingestion Batch:
 * New laboratory reports representing 200 reports / 450 isolates where E. coli + Ciprofloxacin is at 48.0% resistance!
 * Ingesting this batch produces the exact +17.0 percentage-point increase (31.0% -> 48.0%).
 */
export const DEMO_INGESTION_BATCH: SurveillanceRecord[] = [
  ...generateIsolateBatch('2026-09-12', 'Escherichia coli', 'Ciprofloxacin', 'North Suburbs Health Zone', 'Outpatient Community Clinics', 'Metro Region', 48.0, 450),
  ...generateIsolateBatch('2026-09-12', 'Klebsiella pneumoniae', 'Meropenem', 'St. Jude General Hospital', 'ICU Ward B', 'Metro Central', 48.2, 80)
];

/**
 * Default initial dataset pointing to baseline dataset.
 */
export const INITIAL_SURVEILLANCE_DATASET: SurveillanceRecord[] = [...BASELINE_SURVEILLANCE_DATASET];

function generateIsolateBatch(
  date: string,
  organism: string,
  antibiotic: string,
  facility: string,
  department: string,
  region: string,
  resistantPercentage: number,
  count: number
): SurveillanceRecord[] {
  const records: SurveillanceRecord[] = [];
  const resistantCount = Math.round((resistantPercentage / 100) * count);

  for (let i = 0; i < count; i++) {
    const isResistant = i < resistantCount;
    records.push({
      id: `SRV-${date}-${organism.substring(0, 3)}-${antibiotic.substring(0, 3)}-${i}`,
      reportId: `REP-${date}-${i}`,
      date,
      facility,
      department,
      region,
      specimenType: 'Urine Culture',
      organism,
      antibiotic,
      susceptibility: isResistant ? 'Resistant' : 'Susceptible',
      micValue: isResistant ? '>16 ug/mL' : '0.5 ug/mL',
      resistant: isResistant,
      sampleCount: 1,
      dataSource: 'DEMO_SYNTHETIC'
    });
  }

  return records;
}
