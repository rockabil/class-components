'use client';
import { ThemeProvider } from '@/context/theme-context';
import { ErrorBoundary } from '@/components/error-boundary/error-boundary';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api/query-client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}