import { AntibioticResult } from '../types';

export interface AMRProfileAssessment {
  organism: string;
  facility: string;
  department: string;
  collectionDate: string;
  totalAntibioticsTested: number;
  resistantCount: number;
  intermediateCount: number;
  susceptibleCount: number;
  resistancePercentage: number;
  riskCategory: 'Critical' | 'High' | 'Moderate' | 'Watch' | 'Low';
  anomalyScore: number; // 0-100
  confidenceScore: number; // 0-100
  phenotypeMarkers: string[];
}

/**
 * Calculates antimicrobial resistance metrics for a single laboratory report profile.
 */
export function calculateReportProfileAssessment(
  organism: string,
  facility: string,
  department: string,
  collectionDate: string,
  findings: AntibioticResult[]
): AMRProfileAssessment {
  const total = findings.length;
  if (total === 0) {
    return {
      organism,
      facility,
      department,
      collectionDate,
      totalAntibioticsTested: 0,
      resistantCount: 0,
      intermediateCount: 0,
      susceptibleCount: 0,
      resistancePercentage: 0,
      riskCategory: 'Low',
      anomalyScore: 0,
      confidenceScore: 90,
      phenotypeMarkers: []
    };
  }

  const resistant = findings.filter(f => f.susceptibility === 'Resistant').length;
  const intermediate = findings.filter(f => f.susceptibility === 'Intermediate').length;
  const susceptible = findings.filter(f => f.susceptibility === 'Susceptible').length;

  const resistancePercentage = Math.round(((resistant + intermediate * 0.5) / total) * 100 * 10) / 10;

  // Identify specific resistance phenotypes (e.g. CRE, ESBL, MRSA, VRE, Colistin resistance)
  const phenotypeMarkers: string[] = [];

  const resistantDrugs = findings.filter(f => f.susceptibility === 'Resistant').map(f => f.antibiotic.toLowerCase());

  const hasCarbapenemResistance = resistantDrugs.some(d => d.includes('meropenem') || d.includes('imipenem') || d.includes('ertapenem'));
  const hasCephalosporinResistance = resistantDrugs.some(d => d.includes('ceftriaxone') || d.includes('cefotaxime') || d.includes('ceftazidime'));
  const hasFluoroquinoloneResistance = resistantDrugs.some(d => d.includes('ciprofloxacin') || d.includes('levofloxacin'));
  const hasColistinResistance = resistantDrugs.some(d => d.includes('colistin') || d.includes('polymyxin'));
  const hasMethicillinResistance = resistantDrugs.some(d => d.includes('oxacillin') || d.includes('cefoxitin') || d.includes('penicillin'));
  const hasVancomycinResistance = resistantDrugs.some(d => d.includes('vancomycin'));

  if (organism.includes('Klebsiella') || organism.includes('Escherichia') || organism.includes('Enterobacter')) {
    if (hasCarbapenemResistance) {
      phenotypeMarkers.push('Carbapenem-Resistant Enterobacteriaceae (CRE) Phenotype');
    } else if (hasCephalosporinResistance) {
      phenotypeMarkers.push('Extended-Spectrum Beta-Lactamase (ESBL) Phenotype');
    }
  }

  if (organism.includes('Staphylococcus') && (hasMethicillinResistance || hasCephalosporinResistance)) {
    phenotypeMarkers.push('Methicillin-Resistant S. aureus (MRSA) Phenotype');
  }

  if (organism.includes('Enterococcus') && hasVancomycinResistance) {
    phenotypeMarkers.push('Vancomycin-Resistant Enterococcus (VRE) Phenotype');
  }

  if (hasColistinResistance) {
    phenotypeMarkers.push('Polymyxin / Colistin Non-Susceptibility Marker');
  }

  if (hasFluoroquinoloneResistance) {
    phenotypeMarkers.push('Fluoroquinolone Co-Resistance Marker');
  }

  // Calculate Anomaly Score (0 - 100) based on unexpected high-level co-resistance
  let anomalyScore = 15;
  if (hasColistinResistance) anomalyScore += 50;
  if (hasCarbapenemResistance) anomalyScore += 30;
  if (phenotypeMarkers.length >= 3) anomalyScore += 15;
  anomalyScore = Math.min(100, Math.max(5, anomalyScore));

  // Determine Risk Category
  let riskCategory: 'Critical' | 'High' | 'Moderate' | 'Watch' | 'Low' = 'Low';
  if (hasColistinResistance || (hasCarbapenemResistance && organism.includes('Klebsiella'))) {
    riskCategory = 'Critical';
  } else if (hasCarbapenemResistance || phenotypeMarkers.length >= 2 || resistancePercentage >= 60) {
    riskCategory = 'High';
  } else if (resistancePercentage >= 35 || phenotypeMarkers.length >= 1) {
    riskCategory = 'Moderate';
  } else if (resistancePercentage >= 15) {
    riskCategory = 'Watch';
  }

  // Calculate Confidence Indicator (0 - 100%)
  const confidenceScore = Math.min(99, Math.max(85, Math.round(92 + (total >= 5 ? 5 : 2) - (intermediate > 2 ? 3 : 0))));

  return {
    organism,
    facility,
    department,
    collectionDate,
    totalAntibioticsTested: total,
    resistantCount: resistant,
    intermediateCount: intermediate,
    susceptibleCount: susceptible,
    resistancePercentage,
    riskCategory,
    anomalyScore,
    confidenceScore,
    phenotypeMarkers
  };
}

/**
 * Deterministic helper to calculate percentage point change.
 */
export function calculatePercentagePointChange(currentRate: number, previousRate: number): number {
  return Math.round((currentRate - previousRate) * 10) / 10;
}
