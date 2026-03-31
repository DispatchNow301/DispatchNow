import { generateAIDialogue } from '@/lib/aiDialogue';

// Mock fetch
global.fetch = jest.fn();

describe('generateAIDialogue', () => {
  const mockContext = {
    characterId: 'test-char',
    characterRole: 'Citizen' as const,
    overallStory: 'Test story',
    pastIncidents: [{ type: 'theft', resolution: 'resolved' }],
    currentIncident: { type: 'fire', description: 'Building on fire' },
    situation: 'Emergency',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when NPC profile not found', async () => {
    // Mock getNPCProfile to return null
    jest.mock('@/lib/npcDialogueData', () => ({
      getNPCProfile: jest.fn(() => null),
    }));

    const result = await generateAIDialogue(mockContext);
    expect(result).toBeNull();
  });

  it('returns dialogue on successful API call', async () => {
    const mockResponse = {
      lines: [{ type: 'current', text: 'Help! The building is on fire!' }],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    // Mock getNPCProfile
    jest.mock('@/lib/npcDialogueData', () => ({
      getNPCProfile: jest.fn(() => ({
        id: 'test-char',
        name: 'Test NPC',
        role: 'Citizen',
        portrait: 'test.png',
        personality: 'Worried',
        lines: [],
      })),
    }));

    const result = await generateAIDialogue(mockContext);
    expect(result).not.toBeNull();
    expect(result?.text).toBe('Help! The building is on fire!');
    expect(result?.type).toBe('current');
  });

  it('returns null on API failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const result = await generateAIDialogue(mockContext);
    expect(result).toBeNull();
  });

  it('handles custom profile', async () => {
    const contextWithCustom = {
      ...mockContext,
      customProfile: {
        name: 'Custom NPC',
        portrait: 'custom.png',
        personality: 'Custom personality',
      },
    };

    const mockResponse = {
      lines: [{ type: 'story', text: 'Custom dialogue' }],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await generateAIDialogue(contextWithCustom);
    expect(result?.speakerName).toBe('Custom NPC');
  });
});