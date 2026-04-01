import {
  isVigilanteRecovering,
  pruneExpiredInjuries,
  rollInjuryUpdatesAfterResolve,
  VIGILANTE_INJURY_CHANCE,
  VIGILANTE_INJURY_DURATION_MS
} from '../lib/vigilanteInjury';

describe('isVigilanteRecovering', () => {
  it('returns true when vigilante is injured', () => {
    const now = Date.now();
    const injuryUntil = { 'vig1': now + 1000 };
    expect(isVigilanteRecovering(now, injuryUntil, 'vig1')).toBe(true);
  });

  it('returns false when vigilante is not injured', () => {
    const now = Date.now();
    const injuryUntil = { 'vig1': now - 1000 };
    expect(isVigilanteRecovering(now, injuryUntil, 'vig1')).toBe(false);
  });

  it('returns false when no injury data', () => {
    const now = Date.now();
    expect(isVigilanteRecovering(now, undefined, 'vig1')).toBe(false);
  });
});

describe('pruneExpiredInjuries', () => {
  it('removes expired injuries', () => {
    const now = Date.now();
    const injuries = { 'vig1': now - 1000, 'vig2': now + 1000 };
    const result = pruneExpiredInjuries(injuries, now);
    expect(result).toEqual({ 'vig2': now + 1000 });
  });

  it('returns empty object for undefined input', () => {
    const now = Date.now();
    const result = pruneExpiredInjuries(undefined, now);
    expect(result).toEqual({});
  });
});

describe('rollInjuryUpdatesAfterResolve', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1); // below injury chance
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('injures vigilantes based on random roll', () => {
    const now = Date.now();
    const deployedIds = ['vig1'];
    const previous = {};

    // Mock random to return value below injury chance
    jest.spyOn(Math, 'random').mockReturnValue(0.05);
    const result = rollInjuryUpdatesAfterResolve(now, deployedIds, previous);
    expect(result.vig1).toBe(now + VIGILANTE_INJURY_DURATION_MS);
  });

  it('does not injure when random roll is above chance', () => {
    const now = Date.now();
    const deployedIds = ['vig1'];
    const previous = {};

    // Mock random to return value above injury chance
    jest.spyOn(Math, 'random').mockReturnValue(0.2);
    const result = rollInjuryUpdatesAfterResolve(now, deployedIds, previous);
    expect(result).toEqual({});
  });

  it('prunes expired injuries', () => {
    const now = Date.now();
    const deployedIds = ['vig1'];
    const previous = { 'vig2': now - 1000 };

    jest.spyOn(Math, 'random').mockReturnValue(0.2);
    const result = rollInjuryUpdatesAfterResolve(now, deployedIds, previous);
    expect(result.vig2).toBeUndefined();
  });
});