import { calculateSimpleSuccess, generateRoll } from '../lib/simpleSuccessCalc';
import type { VigilanteSheet } from '../app/components/data/vigilante';

describe('calculateSimpleSuccess', () => {
  const mockVigilante: VigilanteSheet = {
    id: '1',
    name: 'Test Vigilante',
    stats: { strength: 3, intelligence: 3, speed: 3 },
    // Add other required properties as needed
  } as VigilanteSheet;

  it('calculates base success correctly', () => {
    const result = calculateSimpleSuccess(50, 'crime', 'Test Incident', [], [], [], 0);
    expect(result.successPercent).toBe(50);
    expect(result.breakdown).toContainEqual({ label: 'Base', value: 50 });
  });

  it('applies vigilante stat bonuses', () => {
    const result = calculateSimpleSuccess(50, 'crime', 'Test Incident', [mockVigilante], [], [], 0);
    expect(result.successPercent).toBeGreaterThan(50);
    expect(result.breakdown.some(item => item.label === 'Vigilante fit')).toBe(true);
  });

  it('applies resource bonuses', () => {
    const result = calculateSimpleSuccess(50, 'crime', 'Test Incident', [], ['r3'], [], 0); // walkie talkie
    expect(result.successPercent).toBe(50); // no bonus for this resource in crime
    expect(result.breakdown.some(item => item.label === 'Helpful gear')).toBe(false);
  });

  it('applies incident-specific bonuses', () => {
    const result = calculateSimpleSuccess(50, 'fire_rescue', 'Kitchen fire', [], ['r2'], [], 0); // fire extinguisher
    expect(result.successPercent).toBeGreaterThan(50);
    expect(result.breakdown.some(item => item.label.includes('synergy'))).toBe(true);
  });

  it('applies team size bonuses', () => {
    const result = calculateSimpleSuccess(50, 'crime', 'Test Incident', [mockVigilante, mockVigilante], [], [], 0);
    expect(result.successPercent).toBeGreaterThan(50);
    expect(result.breakdown.some(item => item.label === 'Team coordination')).toBe(true);
  });

  it('applies buff bonuses', () => {
    const result = calculateSimpleSuccess(50, 'crime', 'Test Incident', [], [], ['noir_focus'], 0);
    expect(result.successPercent).toBeGreaterThan(50);
    expect(result.breakdown.some(item => item.label === 'Strategic upgrades')).toBe(true);
  });

  it('applies flat bonus', () => {
    const result = calculateSimpleSuccess(50, 'crime', 'Test Incident', [], [], [], 10);
    expect(result.successPercent).toBe(60);
    expect(result.breakdown.some(item => item.label === 'Rapid Response')).toBe(true);
  });

  it('caps success between 1 and 99', () => {
    const result = calculateSimpleSuccess(100, 'crime', 'Test Incident', [], [], [], 10);
    expect(result.successPercent).toBe(99);
  });
});

describe('generateRoll', () => {
  it('generates a roll between 0 and 100', () => {
    const roll = generateRoll(0.5);
    expect(roll).toBeGreaterThanOrEqual(0);
    expect(roll).toBeLessThanOrEqual(100);
  });

  it('produces more predictable rolls with higher archetype fit', () => {
    const rollsLowFit = Array.from({ length: 100 }, () => generateRoll(0));
    const rollsHighFit = Array.from({ length: 100 }, () => generateRoll(1));

    const varianceLow = calculateVariance(rollsLowFit);
    const varianceHigh = calculateVariance(rollsHighFit);

    // Higher fit should have lower variance (more predictable)
    expect(varianceHigh).toBeLessThan(varianceLow);
  });
});

function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  return numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / numbers.length;
}