import { describe, it, expect } from 'vitest';
import { render, screen } from './components/__tests__/test-utils';
import { App } from './App';

describe('Root App', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByText('Search App')).toBeInTheDocument();
  });
});