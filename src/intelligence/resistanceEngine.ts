import { SurveillanceRecord, ResistanceMetric, FilterOptions } from '../types';

/**
 * RESISTRA Intelligence Service — Resistance Engine
 * Calculates resistance rates: resistanceRate = (resistantIsolates / totalTestedIsolates) * 100
 */
export function calculateResistanceMetric(
  records: SurveillanceRecord[],
  filters?: FilterOptions
): ResistanceMetric[] {
  let filtered = records;

  if (filters?.organism && filters.organism !== 'All') {
    filtered = filtered.filter(r => r.organism.toLowerCase() === filters.organism?.toLowerCase());
  }
  if (filters?.antibiotic && filters.antibiotic !== 'All') {
    filtered = filtered.filter(r => r.antibiotic.toLowerCase() === filters.antibiotic?.toLowerCase());
  }
  if (filters?.facility && filters.facility !== 'All') {
    filtered = filtered.filter(r => r.facility.toLowerCase().includes(filters.facility?.toLowerCase() || ''));
  }
  if (filters?.region && filters.region !== 'All') {
    filtered = filtered.filter(r => r.region.toLowerCase() === filters.region?.toLowerCase());
  }

  // Group by Organism x Antibiotic
  const groups: Record<string, { total: number; resistant: number; organism: string; antibiotic: string }> = {};

  filtered.forEach(rec => {
    const key = `${rec.organism}__${rec.antibiotic}`;
    if (!groups[key]) {
      groups[key] = { total: 0, resistant: 0, organism: rec.organism, antibiotic: rec.antibiotic };
    }
    groups[key].total += rec.sampleCount;
    if (rec.resistant) {
      groups[key].resistant += rec.sampleCount;
    }
  });

  return Object.values(groups).map(g => {
    const rate = g.total > 0 ? Math.round((g.resistant / g.total) * 100 * 10) / 10 : 0;
    return {
      organism: g.organism,
      antibiotic: g.antibiotic,
      totalTestedIsolates: g.total,
      resistantIsolates: g.resistant,
      resistanceRate: rate
    };
  });
}
