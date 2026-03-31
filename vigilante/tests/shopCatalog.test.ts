import { mergePurchasedBuffIds, SHOP_ITEMS, SHOP_RESOURCES, SHOP_UPGRADES } from '../lib/shopCatalog';

describe('mergePurchasedBuffIds', () => {
  it('returns default buffs when raw is undefined', () => {
    const result = mergePurchasedBuffIds(undefined);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns default buffs when raw is not an array', () => {
    const result = mergePurchasedBuffIds('not an array');
    expect(Array.isArray(result)).toBe(true);
  });

  it('filters out invalid buff IDs', () => {
    const result = mergePurchasedBuffIds(['b1', 'invalid_buff', 123]);
    expect(result).toContain('b1');
    expect(result).not.toContain('invalid_buff');
    expect(result).not.toContain(123);
  });

  it('removes duplicates', () => {
    const result = mergePurchasedBuffIds(['buff1', 'buff1', 'buff2']);
    const unique = [...new Set(result)];
    expect(result).toEqual(unique);
  });
});

describe('SHOP_ITEMS', () => {
  it('contains all resources and upgrades', () => {
    expect(SHOP_ITEMS.length).toBe(SHOP_RESOURCES.length + SHOP_UPGRADES.length);
  });

  it('has unique IDs', () => {
    const ids = SHOP_ITEMS.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toEqual(uniqueIds.length);
  });

  it('all items have required properties', () => {
    SHOP_ITEMS.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('cost');
      expect(typeof item.cost).toBe('number');
      expect(item.cost).toBeGreaterThan(0);
    });
  });
});