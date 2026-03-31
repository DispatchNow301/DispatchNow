import { GAME_STORY } from '@/lib/gameStory';

describe('gameStory', () => {
  it('exports GAME_STORY as a non-empty string', () => {
    expect(typeof GAME_STORY).toBe('string');
    expect(GAME_STORY.length).toBeGreaterThan(0);
  });

  it('contains key story elements', () => {
    expect(GAME_STORY).toContain('vigilante');
    expect(GAME_STORY).toContain('father');
    expect(GAME_STORY).toContain('organization');
    expect(GAME_STORY).toContain('city');
  });
});