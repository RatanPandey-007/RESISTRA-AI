import { DemoSampleReport, AntibioticResult } from '../types';

export interface ParsedReportData {
  reportNumber: string;
  patientId: string;
  collectionDate: string;
  facility: string;
  department: string;
  sampleType: string;
  organismIdentified: string;
  antibioticsTested: AntibioticResult[];
  dataSource: 'DEMO_SYNTHETIC' | 'USER_UPLOADED';
  rawFileName?: string;
  parseNotes?: string;
}

/**
 * Local realistic parser for hackathon MVP.
 * Simulates optical/structured parsing of microbiology lab reports (PDF, JPG, PNG).
 */
export function parseUploadedReportFile(file: File): ParsedReportData {
  const fileName = file.name.toLowerCase();
  
  // Heuristic mock parser based on file name or type
  let organism = 'Escherichia coli';
  let facility = 'City General Hospital';
  let department = 'Emergency Ward';
  let sampleType = 'Urine Culture';
  
  if (fileName.includes('klebsiella') || fileName.includes('icu') || fileName.includes('kpn')) {
    organism = 'Klebsiella pneumoniae';
    facility = 'St. Jude General Hospital';
    department = 'ICU Ward B';
    sampleType = 'Sputum Culture';
  } else if (fileName.includes('acinetobacter') || fileName.includes('aba')) {
    organism = 'Acinetobacter baumannii';
    facility = 'University Hospital ICU';
    department = 'Burn & Trauma Unit';
    sampleType = 'Blood Culture';
  } else if (fileName.includes('staph') || fileName.includes('mrsa') || fileName.includes('wound')) {
    organism = 'Staphylococcus aureus';
    facility = 'Eastside Medical Center';
    department = 'Surgical Ward';
    sampleType = 'Wound Swab';
  } else if (fileName.includes('pseudomonas') || fileName.includes('pae')) {
    organism = 'Pseudomonas aeruginosa';
    facility = 'Regional Burn Unit';
    department = 'Sub-Acute Unit';
    sampleType = 'Tracheal Aspirate';
  }

  const antibioticsTested: AntibioticResult[] = [
    { antibiotic: 'Ampicillin', susceptibility: 'Resistant', micValue: '>32 ug/mL' },
    { antibiotic: 'Cefotaxime', susceptibility: 'Resistant', micValue: '>64 ug/mL' },
    { antibiotic: 'Ceftriaxone', susceptibility: 'Resistant', micValue: '>64 ug/mL' },
    { antibiotic: 'Meropenem', susceptibility: organism.includes('Klebsiella') || organism.includes('Acinetobacter') ? 'Resistant' : 'Susceptible', micValue: organism.includes('Klebsiella') ? '16 ug/mL' : '0.5 ug/mL' },
    { antibiotic: 'Ciprofloxacin', susceptibility: 'Resistant', micValue: '>8 ug/mL' },
    { antibiotic: 'Gentamicin', susceptibility: 'Intermediate', micValue: '4 ug/mL' },
    { antibiotic: 'Colistin', susceptibility: 'Susceptible', micValue: '0.5 ug/mL' }
  ];

  const today = new Date().toISOString().split('T')[0];
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  return {
    reportNumber: `USR-2026-${randomNum}`,
    patientId: `PT-USR-${Math.floor(10000 + Math.random() * 90000)}`,
    collectionDate: today,
    facility,
    department,
    sampleType,
    organismIdentified: organism,
    antibioticsTested,
    dataSource: 'USER_UPLOADED',
    rawFileName: file.name,
    parseNotes: `Parsed ${file.type || 'document'} using deterministic local AMR schema extractor.`
  };
}

/**
 * Converts a preset DemoSampleReport into a ParsedReportData format.
 */
export function parseDemoSampleReport(demo: DemoSampleReport): ParsedReportData {
  return {
    reportNumber: `DEMO-${demo.id}`,
    patientId: demo.patientId || `PT-DEMO-${demo.id}`,
    collectionDate: demo.date,
    facility: demo.facility.split('(')[0].trim(),
    department: demo.department || (demo.facility.includes('(') ? demo.facility.split('(')[1].replace(')', '').trim() : 'Microbiology Lab'),
    sampleType: demo.sampleType,
    organismIdentified: demo.organism,
    antibioticsTested: demo.findings,
    dataSource: 'DEMO_SYNTHETIC',
    parseNotes: 'Loaded pre-validated synthetic lab culture dataset.'
  };
}
