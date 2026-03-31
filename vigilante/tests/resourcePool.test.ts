import {
  countIds,
  canStageDeployment,
  applyDeployment,
  returnDeployment,
  DEFAULT_RESOURCE_POOL,
  RESOURCE_STARTING_QUANTITIES
} from '../lib/resourcePool';

describe('countIds', () => {
  it('counts occurrences of each id', () => {
    const result = countIds(['r1', 'r1', 'r2']);
    expect(result).toEqual({ r1: 2, r2: 1 });
  });

  it('returns empty object for empty array', () => {
    const result = countIds([]);
    expect(result).toEqual({});
  });
});

describe('canStageDeployment', () => {
  it('returns true when resources are available', () => {
    const pool = { r1: { qty: 3, deployed: 0 } };
    expect(canStageDeployment(pool, ['r1'])).toBe(true);
  });

  it('returns false when insufficient quantity', () => {
    const pool = { r1: { qty: 1, deployed: 0 } };
    expect(canStageDeployment(pool, ['r1', 'r1'])).toBe(false);
  });

  it('returns false when resource not in pool', () => {
    const pool = { r1: { qty: 3, deployed: 0 } };
    expect(canStageDeployment(pool, ['r2'])).toBe(false);
  });

  it('accounts for already deployed resources', () => {
    const pool = { r1: { qty: 3, deployed: 2 } };
    expect(canStageDeployment(pool, ['r1'])).toBe(true);
    expect(canStageDeployment(pool, ['r1', 'r1'])).toBe(false);
  });
});

describe('applyDeployment', () => {
  it('increases deployed count', () => {
    const pool = { r1: { qty: 3, deployed: 0 } };
    const result = applyDeployment(pool, ['r1']);
    expect(result.r1.deployed).toBe(1);
  });

  it('handles multiple deployments', () => {
    const pool = { r1: { qty: 3, deployed: 0 } };
    const result = applyDeployment(pool, ['r1', 'r1']);
    expect(result.r1.deployed).toBe(2);
  });

  it('does not modify original pool', () => {
    const pool = { r1: { qty: 3, deployed: 0 } };
    applyDeployment(pool, ['r1']);
    expect(pool.r1.deployed).toBe(0);
  });
});

describe('returnDeployment', () => {
  it('decreases deployed count', () => {
    const pool = { r1: { qty: 3, deployed: 2 } };
    const result = returnDeployment(pool, ['r1']);
    expect(result.r1.deployed).toBe(1);
  });

  it('does not go below zero', () => {
    const pool = { r1: { qty: 3, deployed: 0 } };
    const result = returnDeployment(pool, ['r1']);
    expect(result.r1.deployed).toBe(0);
  });
});

describe('DEFAULT_RESOURCE_POOL', () => {
  it('includes all starting resources', () => {
    Object.keys(RESOURCE_STARTING_QUANTITIES).forEach(id => {
      expect(DEFAULT_RESOURCE_POOL[id]).toBeDefined();
      expect(DEFAULT_RESOURCE_POOL[id].qty).toBe(RESOURCE_STARTING_QUANTITIES[id]);
      expect(DEFAULT_RESOURCE_POOL[id].deployed).toBe(0);
    });
  });

  it('includes upgrade buffs', () => {
    expect(DEFAULT_RESOURCE_POOL.b1).toEqual({ qty: 1, deployed: 0 });
    expect(DEFAULT_RESOURCE_POOL.b2).toEqual({ qty: 1, deployed: 0 });
  });
});