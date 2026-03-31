import { getIncidentSpecificBonus, hasIncidentSpecificBonus } from '../lib/incidentSpecificBonuses';

describe('getIncidentSpecificBonus', () => {
  it('returns bonuses for known incident types', () => {
    const bonuses = getIncidentSpecificBonus('Kitchen fire');
    expect(bonuses).toHaveProperty('fire_extinguisher');
    expect(bonuses.fire_extinguisher).toBeGreaterThan(1);
  });

  it('returns empty object for unknown incident types', () => {
    const bonuses = getIncidentSpecificBonus('Unknown Incident');
    expect(bonuses).toEqual({});
  });

  it('normalizes incident type labels', () => {
    const bonuses1 = getIncidentSpecificBonus('kitchen fire');
    const bonuses2 = getIncidentSpecificBonus('Kitchen Fire');
    const bonuses3 = getIncidentSpecificBonus('kitchen_fire');
    expect(bonuses1).toEqual(bonuses2);
    expect(bonuses1).toEqual(bonuses3);
  });
});

describe('hasIncidentSpecificBonus', () => {
  it('returns true for incidents with bonuses', () => {
    expect(hasIncidentSpecificBonus('Kitchen fire')).toBe(true);
  });

  it('returns false for incidents without bonuses', () => {
    expect(hasIncidentSpecificBonus('Unknown Incident')).toBe(false);
  });

  it('normalizes incident type labels', () => {
    expect(hasIncidentSpecificBonus('kitchen fire')).toBe(true);
    expect(hasIncidentSpecificBonus('KITCHEN FIRE')).toBe(true);
  });
});