import { describe, it, expect } from 'vitest';
import { render, screen } from '../components/__tests__/test-utils';
import { Header } from './header';

describe('Header', () => {
  it('should render header with title', () => {
    render(<Header />);
    expect(screen.getByText('Search App')).toBeInTheDocument();
  });
});