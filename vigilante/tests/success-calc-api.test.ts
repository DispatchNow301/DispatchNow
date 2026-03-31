import { POST } from '../app/api/success-calc/route';

// Mock NextRequest
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, options) => ({ json: () => data, status: options?.status || 200 }))
  }
}));

describe('/api/success-calc', () => {
  it('calculates success for crime incident', async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        incidentType: 'crime',
        vigilantes: [{
          name: 'Test Vigilante',
          stats: { strength: 3, intelligence: 3, speed: 3 }
        }],
        resources: ['r4'], // handcuffs
        buffIds: ['noir_focus']
      })
    };

    const response = await POST(mockReq as any);
    const data = await response.json();

    expect(data).toHaveProperty('successPercent');
    expect(data).toHaveProperty('rawOutput');
    expect(data.successPercent).toBeGreaterThan(25);
  });

  it('returns error for invalid JSON', async () => {
    const mockReq = {
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
    };

    const response = await POST(mockReq as any);
    const data = await response.json();

    expect(data.error).toBe('Invalid JSON');
  });

  it('returns error for missing required fields', async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({ incidentType: 'crime' })
    };

    const response = await POST(mockReq as any);
    const data = await response.json();

    expect(data.error).toContain('Expected incidentType, vigilantes array, and resources array');
  });

  it('handles team bonuses', async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        incidentType: 'crime',
        vigilantes: [
          { name: 'Vig1', stats: { strength: 3, intelligence: 3, speed: 3 } },
          { name: 'Vig2', stats: { strength: 3, intelligence: 3, speed: 3 } }
        ],
        resources: [],
        buffIds: []
      })
    };

    const response = await POST(mockReq as any);
    const data = await response.json();

    expect(data.rawOutput).toContain('Team +3%');
  });
});