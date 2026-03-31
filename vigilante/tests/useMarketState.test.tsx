import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useMarketState } from '@/lib/useMarketState';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component
function TestComponent({ saveKey }: { saveKey: string }) {
  const { credits, resourcePool, purchasedUpgradeIds, handlePurchase } = useMarketState(saveKey);

  return (
    <div>
      <div data-testid="credits">{credits}</div>
      <div data-testid="resources">{Object.keys(resourcePool).length}</div>
      <div data-testid="upgrades">{purchasedUpgradeIds.length}</div>
      <button
        onClick={() => handlePurchase({ itemId: 'test', cost: 100, category: 'resource' })}
        data-testid="purchase-btn"
      >
        Purchase
      </button>
    </div>
  );
}

describe('useMarketState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('initializes with default values when no saved data', () => {
    render(<TestComponent saveKey="test-key" />);
    expect(screen.getByTestId('credits')).toHaveTextContent('500');
    // STARTING_UPGRADE_IDS is empty by default
    expect(screen.getByTestId('upgrades')).toHaveTextContent('0');
  });

  it('loads saved data from localStorage', () => {
    const savedData = {
      credits: 500,
      resourcePool: { 'r1': { qty: 10, deployed: 0 } },
      purchasedUpgradeIds: ['b1'],
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));

    render(<TestComponent saveKey="test-key" />);
    expect(screen.getByTestId('credits')).toHaveTextContent('500');
    expect(screen.getByTestId('upgrades')).toHaveTextContent('1');
  });

  it('saves data to localStorage on purchase', async () => {
    render(<TestComponent saveKey="test-key" />);
    const purchaseBtn = screen.getByTestId('purchase-btn');
    fireEvent.click(purchaseBtn);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  it('handles invalid localStorage data gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid json');

    // Should not crash
    expect(() => render(<TestComponent saveKey="test-key" />)).not.toThrow();
  });
});