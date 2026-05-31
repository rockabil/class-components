import { QueryClient } from '@tanstack/react-query';

const CACHE_TTL = Number(import.meta.env.VITE_CACHE_TTL) || 5 * 60 * 1000; // 5 минут

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TTL,
      gcTime: CACHE_TTL * 2,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});