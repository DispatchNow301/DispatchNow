/**
 * @jest-environment jsdom
 */
import { calculateSimpleSuccess } from '@/lib/simpleSuccessCalc';

describe('calculateSimpleSuccess', () => {
  it('calculates base success for crime incident', () => {
    const result = calculateSimpleSuccess(
      50, // baseChancePercent
      'crime',
      'Crime',
      [{
        id: 'v1',
        stats: { strength: 3, intelligence: 3, speed: 3 }
      } as any],
      [],
      []
    );

    expect(result.successPercent).toBeGreaterThan(0);
    expect(result.successPercent).toBeLessThanOrEqual(100);
  });

  it('includes stat bonus for high stats', () => {
    const weak = calculateSimpleSuccess(
      50,
      'crime',
      'Crime',
      [{
        id: 'v1',
        stats: { strength: 1, intelligence: 1, speed: 1 }
      } as any],
      [],
      []
    );

    const strong = calculateSimpleSuccess(
      50,
      'crime',
      'Crime',
      [{
        id: 'v1',
        stats: { strength: 5, intelligence: 5, speed: 5 }
      } as any],
      [],
      []
    );

    expect(strong.successPercent).toBeGreaterThan(weak.successPercent);
  });

  it('includes resource bonus', () => {
    const noRes = calculateSimpleSuccess(
      50,
      'crime',
      'Crime',
      [{
        id: 'v1',
        stats: { strength: 3, intelligence: 3, speed: 3 }
      } as any],
      [],
      []
    );

    const withRes = calculateSimpleSuccess(
      50,
      'crime',
      'Crime',
      [{
        id: 'v1',
        stats: { strength: 3, intelligence: 3, speed: 3 }
      } as any],
      ['r4'], // handcuffs
      []
    );

    expect(withRes.successPercent).toBeGreaterThanOrEqual(noRes.successPercent);
  });

  it('includes team bonus for multiple vigilantes', () => {
    const single = calculateSimpleSuccess(
      50,
      'crime',
      'Crime',
      [
        { id: 'v1', stats: { strength: 3, intelligence: 3, speed: 3 } } as any
      ],
      [],
      []
    );

    const team = calculateSimpleSuccess(
      50,
      'crime',
      'Crime',
      [
        { id: 'v1', stats: { strength: 3, intelligence: 3, speed: 3 } } as any,
        { id: 'v2', stats: { strength: 3, intelligence: 3, speed: 3 } } as any
      ],
      [],
      []
    );

    expect(team.successPercent).toBeGreaterThanOrEqual(single.successPercent);
  });

  it('includes buff bonus for aligned buffs', () => {
    const noBuff = calculateSimpleSuccess(
      50,
      'crime',
      'Crime',
      [{
        id: 'v1',
        stats: { strength: 3, intelligence: 3, speed: 3 }
      } as any],
      [],
      []
    );

    const withBuff = calculateSimpleSuccess(
      50,
      'crime',
      'Crime',
      [{
        id: 'v1',
        stats: { strength: 3, intelligence: 3, speed: 3 }
      } as any],
      [],
      ['street_network']
    );

    expect(withBuff.successPercent).toBeGreaterThanOrEqual(noBuff.successPercent);
  });

  it('handles multiple resource types', () => {
    const result = calculateSimpleSuccess(
      50,
      'crime',
      'Crime',
      [{
        id: 'v1',
        stats: { strength: 3, intelligence: 3, speed: 3 }
      } as any],
      ['r4', 'r5'],
      []
    );

    expect(result.successPercent).toBeGreaterThan(0);
    expect(result.successPercent).toBeLessThanOrEqual(100);
  });

  it('clamps success percent between 0 and 100', () => {
    // Very low stats with no bonuses
    const lowResult = calculateSimpleSuccess(
      1,
      'crime',
      'Crime',
      [{
        id: 'v1',
        stats: { strength: 1, intelligence: 1, speed: 1 }
      } as any],
      [],
      []
    );

    expect(lowResult.successPercent).toBeGreaterThanOrEqual(0);
    expect(lowResult.successPercent).toBeLessThanOrEqual(100);

    // Very high everything
    const highResult = calculateSimpleSuccess(
      99,
      'crime',
      'Crime',
      [
        { id: 'v1', stats: { strength: 5, intelligence: 5, speed: 5 } } as any,
        { id: 'v2', stats: { strength: 5, intelligence: 5, speed: 5 } } as any,
        { id: 'v3', stats: { strength: 5, intelligence: 5, speed: 5 } } as any
      ],
      ['r4', 'r5'],
      ['street_network']
    );

    expect(highResult.successPercent).toBeGreaterThanOrEqual(0);
    expect(highResult.successPercent).toBeLessThanOrEqual(100);
  });
});