import { describe, it, expect } from 'vitest';
import { render, screen } from '../components/__tests__/test-utils';
import { Main } from './main';

vi.mock('../components/app/app', () => ({
  App: () => <div>Mocked App</div>,
}));

describe('Main', () => {
  it('should render main with App component', () => {
    render(<Main />);
    expect(screen.getByText('Mocked App')).toBeInTheDocument();
  });
});