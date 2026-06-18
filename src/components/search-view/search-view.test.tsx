import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithRouter, screen, waitFor } from '../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchView } from './search-view';
import { useCharacters } from '../../hooks/use-characters';
import type { SearchResult } from '../../types/types';
import type { UseQueryResult } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../../hooks/use-characters', () => ({
  useCharacters: vi.fn(),
}));

const mockCharacters: SearchResult[] = [
  {
    id: '1',
    name: 'James T. Kirk',
    description: 'Captain of USS Enterprise',
    gender: 'M',
    deceased: false,
    hologram: false,
    species: 'Human',
    organizations: ['Starfleet', 'USS Enterprise'],
  },
  {
    id: '2',
    name: 'Spock',
    description: 'Science Officer',
    gender: 'M',
    deceased: false,
    hologram: false,
    species: 'Vulcan',
    organizations: ['Starfleet'],
  },
];

const mockQuery = <T,>(overrides: {
  data?: T;
  isLoading?: boolean;
  error?: Error | null;
  refetch?: () => void;
}): UseQueryResult<T, Error> => {
  return {
    data: overrides.data,
    isLoading: overrides.isLoading ?? false,
    error: overrides.error ?? null,
    refetch: overrides.refetch ?? vi.fn(),
  } as UseQueryResult<T, Error>;
};

// Кастомная render-функция с QueryClientProvider
const renderSearchView = (ui: React.ReactElement, queryClient?: QueryClient) => {
  const client = queryClient || new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return renderWithRouter(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe('SearchView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Loading State', () => {    
    it('should show the Loader when is loading', () => {
      vi.mocked(useCharacters).mockReturnValue(
        mockQuery<SearchResult[]>({ isLoading: true, data: [] })
      );
      renderSearchView(<SearchView />);
      expect(screen.getByText(/Loading characters from Star Trek universe/i)).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    it('should display characters when data is loaded', async () => {
      vi.mocked(useCharacters).mockReturnValue(
        mockQuery<SearchResult[]>({ data: mockCharacters })
      );
      renderSearchView(<SearchView />);
      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
        expect(screen.getByText('Spock')).toBeInTheDocument();
      });
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', async () => {
      vi.mocked(useCharacters).mockReturnValue(
        mockQuery<SearchResult[]>({ error: new Error('Failed to load data') })
      );
      renderSearchView(<SearchView />);
      await waitFor(() => {
        expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      });
    });
  });

  describe('Refresh Button – Cache Invalidation', () => {
    it('should call invalidateQueries when refresh button is clicked', async () => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
      
      vi.mocked(useCharacters).mockReturnValue(
        mockQuery<SearchResult[]>({ data: mockCharacters })
      );

      renderSearchView(<SearchView />, queryClient);
      
      const refreshButton = await screen.findByText('Refresh Data');
      await userEvent.click(refreshButton);
      
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['characters'] });
    });
  });
});