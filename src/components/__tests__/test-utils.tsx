import { type ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../../context/theme-context';
import { 
  render as rtlRender, 
  screen,
  waitFor,
  fireEvent,
  act  } from '@testing-library/react';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
  },
});

export const renderWithRouter = (
  ui: ReactElement,
  { route = '/' } = {}
) => {
  window.history.pushState({}, 'Test page', route);
  
  const testQueryClient = createTestQueryClient();
  
  return rtlRender(
    <BrowserRouter>
      <QueryClientProvider client={testQueryClient}>
        <ThemeProvider>
          {ui}
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export { 
  rtlRender as render,
  screen, 
  waitFor, 
  fireEvent, 
  act 
};