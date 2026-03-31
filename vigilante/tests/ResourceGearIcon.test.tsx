import { render } from '@testing-library/react';
import { ResourceGearIcon } from '../components/game/ResourceGearIcon';

describe('ResourceGearIcon', () => {
  it('renders the correct icon for r1', () => {
    const { container } = render(<ResourceGearIcon resourceId="r1" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders the correct icon for r2', () => {
    const { container } = render(<ResourceGearIcon resourceId="r2" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies className correctly', () => {
    const { container } = render(<ResourceGearIcon resourceId="r1" className="test-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('test-class');
  });

  it('has aria-hidden attribute', () => {
    const { container } = render(<ResourceGearIcon resourceId="r1" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden');
  });
});