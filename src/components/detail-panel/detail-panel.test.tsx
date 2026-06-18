import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DetailPanel } from '../detail-panel/detail-panel';
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

const createWrapper = (queryClient: QueryClient) => {
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

describe('DetailPanel', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loader when loading', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = createWrapper(queryClient);
    const mockReturn: Partial<UseQueryResult<CharacterDetails, Error>> = {
      data: undefined,
      isLoading: true,
      error: null,
    };
    vi.mocked(useCharacterDetails).mockReturnValue(mockReturn as UseQueryResult<CharacterDetails, Error>);

    render(<DetailPanel characterId="1" onClose={mockOnClose} />, { wrapper });
    expect(screen.getByText('Character Details')).toBeInTheDocument();
  });

  it('should display error message when fetch fails', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = createWrapper(queryClient);
    const mockReturn: Partial<UseQueryResult<CharacterDetails, Error>> = {
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    };
    vi.mocked(useCharacterDetails).mockReturnValue(mockReturn as UseQueryResult<CharacterDetails, Error>);

    render(<DetailPanel characterId="1" onClose={mockOnClose} />, { wrapper });
    expect(screen.getByText('Information Unavailable')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = createWrapper(queryClient);
    const mockReturn: Partial<UseQueryResult<CharacterDetails, Error>> = {
      data: mockDetails,
      isLoading: false,
      error: null,
    };
    vi.mocked(useCharacterDetails).mockReturnValue(mockReturn as UseQueryResult<CharacterDetails, Error>);

    render(<DetailPanel characterId="1" onClose={mockOnClose} />, { wrapper });
    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call invalidateQueries when refresh details button is clicked', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const wrapper = createWrapper(queryClient);

    const mockReturn: Partial<UseQueryResult<CharacterDetails, Error>> = {
      data: mockDetails,
      isLoading: false,
      error: null,
    };
    vi.mocked(useCharacterDetails).mockReturnValue(mockReturn as UseQueryResult<CharacterDetails, Error>);

    render(<DetailPanel characterId="1" onClose={vi.fn()} />, { wrapper });

    const refreshButton = screen.getByText('Refresh Details');
    await userEvent.click(refreshButton);

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['character', '1'] });
  });
});