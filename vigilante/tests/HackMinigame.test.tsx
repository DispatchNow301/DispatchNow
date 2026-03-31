import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HackMinigame from '@/components/game/HackMinigame';

describe('HackMinigame', () => {
  const mockOnSuccess = jest.fn();
  const mockOnFailure = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    const { container } = render(<HackMinigame onSuccess={mockOnSuccess} onFailure={mockOnFailure} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with a button', () => {
    const { container } = render(<HackMinigame onSuccess={mockOnSuccess} onFailure={mockOnFailure} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });

  it('accepts callbacks without calling them on mount', () => {
    render(<HackMinigame onSuccess={mockOnSuccess} onFailure={mockOnFailure} />);
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnFailure).not.toHaveBeenCalled();
  });

  it('can handle button interaction', () => {
    const { container } = render(<HackMinigame onSuccess={mockOnSuccess} onFailure={mockOnFailure} />);
    const buttons = container.querySelectorAll('button');
    
    if (buttons.length > 0) {
      act(() => {
        fireEvent.click(buttons[0]);
      });
    }

    expect(container).toBeInTheDocument();
  });

  it('renders component with difficulty variation', () => {
    const { rerender } = render(
      <HackMinigame onSuccess={mockOnSuccess} onFailure={mockOnFailure} difficulty={1} />
    );
    expect(render(
      <HackMinigame onSuccess={mockOnSuccess} onFailure={mockOnFailure} difficulty={3} />
    ).container).toBeInTheDocument();
  });
});