import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCharacterDetails } from '../../hooks/use-character-details';
import * as api from '../../api/api';
import type { StapiCharacter } from '../../types/types';

vi.mock('../../api/api', () => ({
  fetchCharacterDetails: vi.fn(),
}));

const createWrapper = (queryClient?: QueryClient) => {
  const client = queryClient || new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useCharacterDetails', () => {
  const mockFetch = vi.mocked(api.fetchCharacterDetails);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return character details', async () => {
    const mockApiResponse: StapiCharacter = {
      uid: '1',
      name: 'Kirk',
      gender: 'M',
      species: { uid: 'species-1', name: 'Human' },
      deceased: false,
      hologram: false,
      bio: 'Captain of the Enterprise',
      organizations: [],
    };
    mockFetch.mockResolvedValue(mockApiResponse);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCharacterDetails('1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      name: 'Kirk',
      gender: 'Male',
      species: 'Human',
      status: 'Alive',
      organizations: [],
      description: 'Captain of the Enterprise',
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should return error when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCharacterDetails('1'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Network error');
  });

  describe('caching behavior', () => {
    it('should reuse cached data without refetch', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 10000, retry: false } }
      });
      const wrapper = createWrapper(queryClient);

      const mockApiResponse: StapiCharacter = {
        uid: '1',
        name: 'Kirk',
        gender: 'M',
        species: { uid: 'species-1', name: 'Human' },
        deceased: false,
        hologram: false,
        bio: 'Captain',
        organizations: [],
      };
      mockFetch.mockResolvedValue(mockApiResponse);

      const { result: result1 } = renderHook(() => useCharacterDetails('1'), { wrapper });
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const { result: result2 } = renderHook(() => useCharacterDetails('1'), { wrapper });
      await waitFor(() => expect(result2.current.isSuccess).toBe(true));
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result2.current.data).toEqual(result1.current.data);
    });

    it('should refetch after cache invalidation', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 10000, retry: false } }
      });
      const wrapper = createWrapper(queryClient);

      const mockApiResponse: StapiCharacter = {
        uid: '1',
        name: 'Kirk',
        gender: 'M',
        species: { uid: 'species-1', name: 'Human' },
        deceased: false,
        hologram: false,
        bio: 'Captain',
        organizations: [],
      };
      mockFetch.mockResolvedValue(mockApiResponse);

      const { result: result1 } = renderHook(() => useCharacterDetails('1'), { wrapper });
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));
      expect(mockFetch).toHaveBeenCalledTimes(1);

      queryClient.invalidateQueries({ queryKey: ['character', '1'] });

      await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    });
  });
});