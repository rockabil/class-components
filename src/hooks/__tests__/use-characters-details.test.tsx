import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DetailPanel } from '../../components/detail-panel/detail-panel';
import { useCharacterDetails } from '../../hooks/use-character-details';
import type { UseQueryResult } from '@tanstack/react-query';

vi.mock('../../hooks/use-character-details', () => ({
  useCharacterDetails: vi.fn(),
}));

interface CharacterDetails {
  name: string;
  gender: string;
  species: string;
  status: string;
  organizations: string[];
  description: string;
}

const mockDetails: CharacterDetails = {
  name: 'James T. Kirk',
  gender: 'Male',
  species: 'Human',
  status: 'Alive',
  organizations: ['Starfleet', 'USS Enterprise'],
  description: 'Captain of the USS Enterprise',
};

function createMockQueryResult<T>(overrides: Partial<UseQueryResult<T, Error>> = {}): UseQueryResult<T, Error> {
  const defaultMock = {
    data: undefined as T,
    isLoading: false,
    isFetching: false,
    error: null,
    refetch: vi.fn(),
    isError: false,
    isSuccess: false,
    isPending: false,
    status: 'pending' as const,
    fetchStatus: 'idle' as const,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    isFetched: false,
    isFetchedAfterMount: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    isInitialLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isPendingError: false,
    errorUpdateCount: 0,
    isPaused: false,
    isEnabled: true,
    promise: Promise.resolve(undefined) as Promise<T>,
  };
  return { ...defaultMock, ...overrides } as unknown as UseQueryResult<T, Error>;
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  
  return TestWrapper;
};

describe('DetailPanel', () => {
  const mockOnClose = vi.fn();
  const wrapper = createWrapper();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when characterId is null', () => {
    render(<DetailPanel characterId={null} onClose={mockOnClose} />, { wrapper });
    expect(screen.queryByText('Character Details')).not.toBeInTheDocument();
  });
  
  it('should show loader when loading', () => {
    const mockResult = createMockQueryResult<CharacterDetails>({
      data: undefined,
      isLoading: true,
    });
    vi.mocked(useCharacterDetails).mockReturnValue(mockResult);

    render(<DetailPanel characterId="1" onClose={mockOnClose} />, { wrapper });
    expect(screen.getByText('Character Details')).toBeInTheDocument();
  });

  it('should display character details when loaded', () => {
    const mockResult = createMockQueryResult<CharacterDetails>({
      data: mockDetails,
      isLoading: false,
      isSuccess: true,
    });
    vi.mocked(useCharacterDetails).mockReturnValue(mockResult);

    render(<DetailPanel characterId="1" onClose={mockOnClose} />, { wrapper });
    expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
    expect(screen.getByText(/Male/)).toBeInTheDocument();
    expect(screen.getByText(/Human/)).toBeInTheDocument();
  });

  it('should display error message when fetch fails', () => {
    const mockResult = createMockQueryResult<CharacterDetails>({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
      isError: true,
    });
    vi.mocked(useCharacterDetails).mockReturnValue(mockResult);

    render(<DetailPanel characterId="1" onClose={mockOnClose} />, { wrapper });
    expect(screen.getByText('Information Unavailable')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const mockResult = createMockQueryResult<CharacterDetails>({
      data: mockDetails,
      isLoading: false,
      isSuccess: true,
    });
    vi.mocked(useCharacterDetails).mockReturnValue(mockResult);

    render(<DetailPanel characterId="1" onClose={mockOnClose} />, { wrapper });
    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call refetch when refresh button is clicked', () => {
    const mockRefetch = vi.fn();
    const mockResult = createMockQueryResult<CharacterDetails>({
      data: mockDetails,
      isLoading: false,
      isSuccess: true,
      refetch: mockRefetch,
    });
    vi.mocked(useCharacterDetails).mockReturnValue(mockResult);

    render(<DetailPanel characterId="1" onClose={mockOnClose} />, { wrapper });
    fireEvent.click(screen.getByText('Refresh Details'));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});