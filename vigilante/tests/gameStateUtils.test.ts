import { initialState, loadState } from '../lib/gameStateUtils';
import type { GameState } from '../lib/gameTypes';

describe('initialState', () => {
  it('returns a valid initial game state', () => {
    const state = initialState();
    expect(state).toHaveProperty('level', 1);
    expect(state).toHaveProperty('credits', 500);
    expect(state.ownedVigilanteIds).toEqual(['bruce', 'parya']);
    expect(state.reputation).toBe(100);
  });

  it('has default panels visibility', () => {
    const state = initialState();
    expect(state.showIncidentPanel).toBe(true);
    expect(state.showMinigamePanel).toBe(false);
    expect(state.showPolicePanel).toBe(false);
    expect(state.showInventoryPanel).toBe(true);
  });
});

describe('loadState', () => {
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    jest.clearAllMocks();
  });

  it('returns initial state when no save exists', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const state = loadState('testKey');
    expect(state.level).toBe(1);
  });

  it('loads and validates saved state', () => {
    const savedState: Partial<GameState> = {
      level: 3,
      credits: 1000,
      reputation: 80,
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedState));
    const state = loadState('testKey');
    expect(state.level).toBe(3);
    expect(state.credits).toBe(1000);
    expect(state.reputation).toBe(80);
  });

  it('handles invalid saved data gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json');
    const state = loadState('testKey');
    expect(state.level).toBe(1); // falls back to initial
  });
});