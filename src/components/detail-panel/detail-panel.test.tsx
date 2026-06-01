import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
  
  it('should show loader when loading', () => {
    const mockReturn: Partial<UseQueryResult<CharacterDetails, Error>> = {
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    };
    vi.mocked(useCharacterDetails).mockReturnValue(mockReturn as UseQueryResult<CharacterDetails, Error>);

    render(<DetailPanel characterId="1" onClose={mockOnClose} />, { wrapper });
    expect(screen.getByText('Character Details')).toBeInTheDocument();
  });

  it('should display error message when fetch fails', () => {
    const mockReturn: Partial<UseQueryResult<CharacterDetails, Error>> = {
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
      refetch: vi.fn(),
    };
    vi.mocked(useCharacterDetails).mockReturnValue(mockReturn as UseQueryResult<CharacterDetails, Error>);

    render(<DetailPanel characterId="1" onClose={mockOnClose} />, { wrapper });
    expect(screen.getByText('Information Unavailable')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const mockReturn: Partial<UseQueryResult<CharacterDetails, Error>> = {
      data: mockDetails,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    };
    vi.mocked(useCharacterDetails).mockReturnValue(mockReturn as UseQueryResult<CharacterDetails, Error>);

    render(<DetailPanel characterId="1" onClose={mockOnClose} />, { wrapper });
    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call refetch when refresh button is clicked', () => {
    const mockRefetch = vi.fn();
    const mockReturn: Partial<UseQueryResult<CharacterDetails, Error>> = {
      data: mockDetails,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    };
    vi.mocked(useCharacterDetails).mockReturnValue(mockReturn as UseQueryResult<CharacterDetails, Error>);

    render(<DetailPanel characterId="1" onClose={mockOnClose} />, { wrapper });
    fireEvent.click(screen.getByText('Refresh Details'));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});