import { checkAchievements, updateAchievementProgress, getQuickResponseCount } from '@/lib/achievementTracker';
import type { AchievementProgress } from '@/lib/gameTypes';

const createInitialProgress = (): AchievementProgress => ({
  totalCreditsEarned: 0,
  highestSinglePayout: 0,
  currentStreak: 0,
  bestStreak: 0,
  recentResolutions: [],
  dispatchesStarted: 0,
  incidentsByArchetype: {},
  maxResourceInventory: {},
  uniqueVigilantesOwned: new Set(),
  vigilanteInjuries: 0,
  totalPlaytimeMs: 0,
  sessionStartTime: Date.now(),
});

describe('updateAchievementProgress', () => {
  const initialProgress: AchievementProgress = createInitialProgress();

  it('increments dispatchesStarted on incident_spawned', () => {
    const result = updateAchievementProgress(initialProgress, { type: 'incident_spawned' });
    expect(result.dispatchesStarted).toBe(1);
  });

  it('adds to recentResolutions on quick deployment', () => {
    const result = updateAchievementProgress(initialProgress, {
      type: 'deployment_made',
      data: { deploymentTimeMs: 5000 }
    });
    expect(result.recentResolutions.length).toBe(1);
  });

  it('updates incidentsByArchetype on successful resolution', () => {
    const result = updateAchievementProgress(initialProgress, {
      type: 'incident_resolved',
      data: { archetype: 'crime', success: true }
    });
    expect(result.incidentsByArchetype.crime).toBe(1);
  });

  it('updates currentStreak on success', () => {
    const result = updateAchievementProgress(initialProgress, {
      type: 'incident_resolved',
      data: { success: true }
    });
    expect(result.currentStreak).toBe(1);
    expect(result.bestStreak).toBe(1);
  });

  it('resets currentStreak on failure', () => {
    const progressWithStreak = { ...initialProgress, currentStreak: 3 };
    const result = updateAchievementProgress(progressWithStreak, {
      type: 'incident_resolved',
      data: { success: false }
    });
    expect(result.currentStreak).toBe(0);
  });

  it('adds vigilante to unique set', () => {
    const result = updateAchievementProgress(initialProgress, {
      type: 'vigilante_recruited',
      data: { vigilanteId: 'test_vigilante' }
    });
    expect(result.uniqueVigilantesOwned.has('test_vigilante')).toBe(true);
  });

  it('updates maxResourceInventory', () => {
    const result = updateAchievementProgress(initialProgress, {
      type: 'resource_change',
      data: { quantities: { r1: 5 } }
    });
    expect(result.maxResourceInventory.r1).toBe(5);
  });

  it('updates credits earned', () => {
    const result = updateAchievementProgress(initialProgress, {
      type: 'credit_earned',
      data: { credits: 100 }
    });
    expect(result.totalCreditsEarned).toBe(100);
    expect(result.highestSinglePayout).toBe(100);
  });

  it('increments vigilanteInjuries', () => {
    const result = updateAchievementProgress(initialProgress, { type: 'vigilante_injured' });
    expect(result.vigilanteInjuries).toBe(1);
  });

  it('increments totalPlaytimeMs on session_tick', () => {
    const result = updateAchievementProgress(initialProgress, { type: 'session_tick' });
    expect(result.totalPlaytimeMs).toBe(1000);
  });
});

describe('checkAchievements', () => {
  const initialProgress: AchievementProgress = createInitialProgress();

  const baseState: GameState = {
    level: 1,
    selectedIncidentId: null,
    incidents: [],
    showIncidentPanel: true,
    showMinigamePanel: false,
    showPolicePanel: false,
    showInventoryPanel: true,
    inventoryTab: 'vigilantes',
    ownedVigilanteIds: ['bruce'],
    recruitLeads: [],
    consumedTheftSiteIds: [],
    resourcePool: {},
    credits: 500,
    purchasedUpgradeIds: [],
    vigilanteInjuryUntil: {},
    careerStats: {
      dispatchesCompleted: 0,
      incidentsResolvedSuccess: 0,
      incidentsResolvedFailure: 0,
      vigilantesRecruited: 0,
      totalCreditsEarned: 0,
    },
    purchasedBuffIds: [],
    unlockedAchievementIds: [],
    achievementProgress: initialProgress,
    activeMinigame: null,
    reputation: 100,
    recentResolutions: [],
    dispatchesStarted: 0,
    incidentsByArchetype: {},
    maxResourceInventory: {},
    uniqueVigilantesOwned: new Set(['bruce']),
    vigilanteInjuries: 0,
    totalPlaytimeMs: 0,
    sessionStartTime: Date.now(),
  };

  it('unlocks first_steps on first dispatch', () => {
    const state = { ...baseState, careerStats: { ...baseState.careerStats, dispatchesCompleted: 1 } };
    const unlocked = checkAchievements(state, initialProgress);
    expect(unlocked.some(a => a.achievementId === 'first_steps')).toBe(true);
  });

  it('unlocks first_rescue on first success', () => {
    const state = { ...baseState, careerStats: { ...baseState.careerStats, incidentsResolvedSuccess: 1 } };
    const unlocked = checkAchievements(state, initialProgress);
    expect(unlocked.some(a => a.achievementId === 'first_rescue')).toBe(true);
  });

  it('unlocks streak achievements', () => {
    const progress = { ...initialProgress, bestStreak: 5 };
    const unlocked = checkAchievements(baseState, progress);
    expect(unlocked.some(a => a.achievementId === 'streak_5')).toBe(true);
  });

  it('unlocks archetype specialists', () => {
    const progress = { ...initialProgress, incidentsByArchetype: { crime: 50 } };
    const unlocked = checkAchievements(baseState, progress);
    expect(unlocked.some(a => a.achievementId === 'crime_fighter')).toBe(true);
  });
});

describe('getQuickResponseCount', () => {
  it('counts recent resolutions within 10 seconds', () => {
    const initialProgress = createInitialProgress();
    const now = Date.now();
    const progress: AchievementProgress = {
      ...initialProgress,
      recentResolutions: [now - 5000, now - 15000, now - 2000]
    };
    const count = getQuickResponseCount(progress);
    expect(count).toBe(2); // Two within 10 seconds
  });
});