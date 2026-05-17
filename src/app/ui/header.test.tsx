import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '../../components/__tests__/test-utils';
import { Header } from './header';

describe('Header', () => {
  it('should render header with title', () => {
    render(<BrowserRouter>
        <Header />
      </BrowserRouter>);
    expect(screen.getByText('Search App')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });
});