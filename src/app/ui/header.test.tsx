import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '../../components/__tests__/test-utils';
import { Header } from './header';
import { ThemeProvider } from '../../context/theme-context';


describe('Header', () => {
  it('should render header with title', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </BrowserRouter>);
    expect(screen.getByText('STAR TREK Heroes Search')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });
  it('should render theme toggle button', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText(/theme/)).toBeInTheDocument();
  });
});