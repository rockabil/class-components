import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithRouter, screen, waitFor } from '../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchView } from './search-view';
import { useCharacters } from '../../hooks/use-characters';
import type { SearchResult } from '../../types/types';
import type { UseQueryResult } from '@tanstack/react-query';

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

      renderWithRouter(<SearchView />);
      expect(screen.getByText(/Loading characters from Star Trek universe/i)).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    it('should display characters when data is loaded', async () => {
      vi.mocked(useCharacters).mockReturnValue(
        mockQuery<SearchResult[]>({ data: mockCharacters })
      );
      
      renderWithRouter(<SearchView />);

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

      renderWithRouter(<SearchView />);

      await waitFor(() => {
        expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      });
    });
  });

  describe('Refresh Button', () => {
    it('should call refetch when refresh button is clicked', async () => {
      const mockRefetch = vi.fn();
      vi.mocked(useCharacters).mockReturnValue(
        mockQuery<SearchResult[]>({ 
          data: mockCharacters, 
          refetch: mockRefetch 
        })
      );

      renderWithRouter(<SearchView />);

      const refreshButton = screen.getByText('Refresh Data');
      await userEvent.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });
});