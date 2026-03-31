import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FireMinigame from '@/components/game/FireMinigame';

describe('FireMinigame', () => {
  const mockOnSuccess = jest.fn();
  const mockOnFailure = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<FireMinigame />);
    expect(container).toBeInTheDocument();
  });

  it('renders with custom difficulty', () => {
    const { container } = render(<FireMinigame difficulty={2} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts callbacks', () => {
    render(<FireMinigame onSuccess={mockOnSuccess} onFailure={mockOnFailure} />);
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnFailure).not.toHaveBeenCalled();
  });

  it('renders and accepts difficulty variations', () => {
    const { rerender, container } = render(<FireMinigame difficulty={1} />);
    expect(container).toBeInTheDocument();
    
    rerender(<FireMinigame difficulty={3} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with optional callbacks', () => {
    const { container } = render(
      <FireMinigame onSuccess={() => {}} onFailure={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });
});