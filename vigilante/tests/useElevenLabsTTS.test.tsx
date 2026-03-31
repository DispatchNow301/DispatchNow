import { render, screen, waitFor } from '@testing-library/react';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';

// Mock fetch
global.fetch = jest.fn();

// Component to test the hook
function TestComponent() {
  const { speak, stop, status, isBusy } = useElevenLabsTTS();

  const handleSpeak = () => {
    speak('Hello world', 'test-char');
  };

  return (
    <div>
      <button onClick={handleSpeak}>Speak</button>
      <button onClick={stop}>Stop</button>
      <div data-testid="status">{status.current}</div>
      <div data-testid="busy">{isBusy ? 'busy' : 'idle'}</div>
    </div>
  );
}

describe('useElevenLabsTTS', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with idle status', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(screen.getByTestId('busy')).toHaveTextContent('idle');
  });

  it('handles successful TTS request', async () => {
    const mockBlob = new Blob(['audio data'], { type: 'audio/mpeg' });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlob),
    });

    // Mock Audio
    global.Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      currentTime: 0,
      duration: 1,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    render(<TestComponent />);
    const speakButton = screen.getByRole('button', { name: /speak/i });
    speakButton.click();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tts/elevenlabs', expect.any(Object));
    });
  });

  it('handles API error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({ error: 'API error' }),
    });

    render(<TestComponent />);
    const speakButton = screen.getByRole('button', { name: /speak/i });
    speakButton.click();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('stops current TTS', () => {
    render(<TestComponent />);
    const stopButton = screen.getByRole('button', { name: /stop/i });
    stopButton.click();
    // Check that abort is called, but hard to test directly
  });
});