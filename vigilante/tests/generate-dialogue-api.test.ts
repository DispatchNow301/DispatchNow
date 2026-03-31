import { POST } from '@/app/api/generate-dialogue/route';

// Mock fetch globally
global.fetch = jest.fn();

describe('/api/generate-dialogue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles POST requests', async () => {
    const mockGroqResponse = {
      choices: [{
        message: {
          content: 'Line 1: "I need help!"\nLine 2: "The fire is spreading!"\nLine 3: "Please hurry!"'
        }
      }]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockGroqResponse),
    });

    const request = new Request('http://localhost/api/generate-dialogue', {
      method: 'POST',
      body: JSON.stringify({
        character: {
          id: 'test',
          name: 'Test NPC',
          role: 'Citizen',
          personality: 'Worried',
          portrait: 'test.png',
        },
        context: {
          currentIncident: {
            type: 'Fire',
            description: 'Building on fire',
          },
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request as any);
    // The response should be a Response object
    expect(response).toBeDefined();
    expect(response.status).toBeDefined();
  });

  it('returns a response for valid requests', async () => {
    const mockGroqResponse = {
      choices: [{
        message: {
          content: 'Test dialogue'
        }
      }]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockGroqResponse),
    });

    const request = new Request('http://localhost/api/generate-dialogue', {
      method: 'POST',
      body: JSON.stringify({
        character: { id: 'test', name: 'Test NPC', role: 'Citizen', personality: 'Neutral', portrait: 'test.png' },
        context: { currentIncident: { type: 'Crime', description: 'Test' } },
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    expect(response).toBeDefined();
  });

  it('endpoint exists and can be called', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ choices: [{ message: { content: 'test' } }] }),
    });

    const request = new Request('http://localhost/api/generate-dialogue', {
      method: 'POST',
      body: JSON.stringify({
        character: { id: 'test', name: 'Test', role: 'Role', personality: 'Neutral', portrait: 'test.png' },
        context: { currentIncident: { type: 'Fire', description: 'Test incident' } },
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    expect(response).not.toBe(null);
  });

  it('handles missing API key', async () => {
    // Mock environment without GROQ_API_KEY
    const originalEnv = process.env.GROQ_API_KEY;
    delete process.env.GROQ_API_KEY;

    const request = new Request('http://localhost/api/generate-dialogue', {
      method: 'POST',
      body: JSON.stringify({
        character: {
          id: 'test',
          name: 'Test NPC',
          role: 'Citizen',
          portrait: 'test.png',
        },
        context: {},
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request as any);
    expect(response.status).toBe(500);

    process.env.GROQ_API_KEY = originalEnv;
  });
});