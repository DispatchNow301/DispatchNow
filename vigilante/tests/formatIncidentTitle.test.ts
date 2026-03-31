import { formatIncidentTypeLabel } from '../lib/formatIncidentTitle';

describe('formatIncidentTypeLabel', () => {
  it('capitalizes single word', () => {
    expect(formatIncidentTypeLabel('fire')).toBe('Fire');
  });

  it('capitalizes multiple words', () => {
    expect(formatIncidentTypeLabel('kitchen fire')).toBe('Kitchen Fire');
  });

  it('handles hyphens', () => {
    expect(formatIncidentTypeLabel('drive-by shooting')).toBe('Drive-By Shooting');
  });

  it('handles mixed case input', () => {
    expect(formatIncidentTypeLabel('KITCHEN FIRE')).toBe('Kitchen Fire');
  });

  it('trims whitespace', () => {
    expect(formatIncidentTypeLabel('  kitchen fire  ')).toBe('Kitchen Fire');
  });

  it('handles empty string', () => {
    expect(formatIncidentTypeLabel('')).toBe('');
  });
});