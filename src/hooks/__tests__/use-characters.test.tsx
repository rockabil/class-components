import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCharacters } from '../use-characters';
import * as api from '../../api/api';
 
vi.mock('../../api/api', () => ({
  loadAllCharactersWithDetails: vi.fn(),
}));

const mockCharacters = [
  {
    id: '1',
    name: 'James T. Kirk',
    description: 'Captain of USS Enterprise',
    gender: 'M',
    deceased: false,
    hologram: false,
    species: 'Human',
    organizations: ['Starfleet'],
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

describe('useCharacters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    vi.mocked(api.loadAllCharactersWithDetails).mockImplementation(
      () => new Promise(() => {}) // Никогда не резолвится
    );

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('should return data after successful fetch', async () => {
    vi.mocked(api.loadAllCharactersWithDetails).mockResolvedValue(mockCharacters);

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCharacters);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return error when fetch fails', async () => {
    const error = new Error('Network Error');
    vi.mocked(api.loadAllCharactersWithDetails).mockRejectedValue(error);

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should cache data and not refetch on second render', async () => {
    vi.mocked(api.loadAllCharactersWithDetails).mockResolvedValue(mockCharacters);

    const { result, rerender } = renderHook(() => useCharacters(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.loadAllCharactersWithDetails).toHaveBeenCalledTimes(1);
    
    rerender();

    expect(api.loadAllCharactersWithDetails).toHaveBeenCalledTimes(1);
  });

  it('should refetch when refetch function is called', async () => {
    vi.mocked(api.loadAllCharactersWithDetails).mockResolvedValue(mockCharacters);

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.loadAllCharactersWithDetails).toHaveBeenCalledTimes(1);
    
    await result.current.refetch();

    expect(api.loadAllCharactersWithDetails).toHaveBeenCalledTimes(2);
  });
});