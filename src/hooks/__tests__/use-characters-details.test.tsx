import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCharacterDetails } from '../use-character-details';
import * as api from '../../api/api';

vi.mock('../../api/api', () => ({
  fetchCharacterDetails: vi.fn(),
}));

const mockCharacterDetails = {
  name: 'James T. Kirk',
  gender: 'Male',
  species: 'Human',
  status: 'Alive',
  organizations: ['Starfleet', 'USS Enterprise'],
  description: 'Captain of the USS Enterprise',
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
   function TestWrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
   }
   TestWrapper.displayName = 'TestWrapper';

   return TestWrapper;
};

describe('useCharacterDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not fetch when characterId is null', () => {
    renderHook(() => useCharacterDetails(null), {
      wrapper: createWrapper(),
    });

    expect(api.fetchCharacterDetails).not.toHaveBeenCalled();
  });

  it('should return loading state when fetching', () => {
    vi.mocked(api.fetchCharacterDetails).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useCharacterDetails('1'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should return data after successful fetch', async () => {
    vi.mocked(api.fetchCharacterDetails).mockResolvedValue(mockCharacterDetails);

    const { result } = renderHook(() => useCharacterDetails('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCharacterDetails);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return error when fetch fails', async () => {
    const error = new Error('Failed to load details');
    vi.mocked(api.fetchCharacterDetails).mockRejectedValue(error);

    const { result } = renderHook(() => useCharacterDetails('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('should not refetch for same characterId', async () => {
    vi.mocked(api.fetchCharacterDetails).mockResolvedValue(mockCharacterDetails);

    const { result, rerender } = renderHook(
      ({ id }) => useCharacterDetails(id),
      {
        initialProps: { id: '1' },
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.fetchCharacterDetails).toHaveBeenCalledTimes(1)

    
    rerender({ id: '1' });

    expect(api.fetchCharacterDetails).toHaveBeenCalledTimes(1);
  });

  it('should fetch new data when characterId changes', async () => {
    vi.mocked(api.fetchCharacterDetails).mockResolvedValue(mockCharacterDetails);

    const { result, rerender } = renderHook(
      ({ id }) => useCharacterDetails(id),
      {
        initialProps: { id: '1' },
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.fetchCharacterDetails).toHaveBeenCalledTimes(1);
    expect(api.fetchCharacterDetails).toHaveBeenCalledWith('1')

    
    rerender({ id: '2' });

    await waitFor(() => {
      expect(api.fetchCharacterDetails).toHaveBeenCalledTimes(2);
    });
    expect(api.fetchCharacterDetails).toHaveBeenCalledWith('2');
  });

  it('should refetch when refetch function is called', async () => {
    vi.mocked(api.fetchCharacterDetails).mockResolvedValue(mockCharacterDetails);

    const { result } = renderHook(() => useCharacterDetails('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.fetchCharacterDetails).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    expect(api.fetchCharacterDetails).toHaveBeenCalledTimes(2);
  });
});