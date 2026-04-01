import { computeIncidentRollOutcome } from '../lib/incidentRoll';
import type { VigilanteForSuccess } from '../lib/successModifiers';

describe('computeIncidentRollOutcome', () => {
  const mockVigilante: VigilanteForSuccess = {
    id: '1',
    name: 'Test Vigilante',
    stats: { strength: 3, intelligence: 3, speed: 3 },
  };

  it('computes a roll outcome with success determination', () => {
    const result = computeIncidentRollOutcome({
      baseChancePercent: 50,
      archetype: 'crime',
      vigilantes: [mockVigilante],
      resourceIds: [],
    });

    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('rolled');
    expect(result.rolled).toBeGreaterThanOrEqual(0);
    expect(result.rolled).toBeLessThanOrEqual(100);
    expect(result.adjustedPercent).toBeGreaterThanOrEqual(1);
    expect(result.adjustedPercent).toBeLessThanOrEqual(99);
  });

  it('succeeds when roll is below adjusted percent', () => {
    const mockRng = jest.fn().mockReturnValue(0.25); // roll of 25
    const result = computeIncidentRollOutcome({
      baseChancePercent: 50,
      archetype: 'crime',
      vigilantes: [mockVigilante],
      resourceIds: [],
      rng: mockRng,
    });

    expect(result.rolled).toBeLessThan(result.adjustedPercent);
    expect(result.success).toBe(true);
  });

  it('fails when roll is above adjusted percent', () => {
    const mockRng = jest.fn().mockReturnValue(0.75); // roll of 75
    const result = computeIncidentRollOutcome({
      baseChancePercent: 30,
      archetype: 'crime',
      vigilantes: [mockVigilante],
      resourceIds: [],
      rng: mockRng,
    });

    expect(result.rolled).toBeGreaterThan(result.adjustedPercent);
    expect(result.success).toBe(false);
  });

  it('includes breakdown multipliers', () => {
    const result = computeIncidentRollOutcome({
      baseChancePercent: 50,
      archetype: 'crime',
      vigilantes: [mockVigilante],
      resourceIds: ['r4'], // handcuffs
      buffIds: ['noir_focus'],
    });

    expect(result).toHaveProperty('resourceMultiplier');
    expect(result).toHaveProperty('buffMultiplier');
    expect(result).toHaveProperty('vigilanteMultiplier');
    expect(result).toHaveProperty('incidentSpecificMultiplier');
  });
});