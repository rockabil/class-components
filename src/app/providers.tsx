'use client';
import { ThemeProvider } from '../context/theme-context';
import { ErrorBoundary } from '../components/error-boundary/error-boundary';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ErrorBoundary>
  );
}