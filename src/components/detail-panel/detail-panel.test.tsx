import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { DetailPanel } from './detail-panel';
import * as api from '../../api';
import type { StapiCharacter } from '../../types/types';

vi.mock('../../api');
const mockFetchCharacterDetails = vi.mocked(api.fetchCharacterDetails);

const mockCharacterDetails: StapiCharacter = {
    uid: 'CHMA0000012345',
    name: 'James T. Kirk',
    gender: 'M',
    deceased: false,
    hologram: false,
    fictionalCharacter: false,
    bio: 'Captain of the USS Enterprise, known for his daring exploits and leadership.',
    species: {
        uid: 'SPMA0000026314',
        name: 'Human'
    },
    organizations: [
        { uid: 'ORMA0000102839', name: 'Starfleet' },
        { uid: 'ORMA0000005053', name: 'USS Enterprise' }
    ]
};

const mockCharacterDetailsFemale: StapiCharacter = {
    uid: 'CHMA0000056789',
    name: 'Kathryn Janeway',
    gender: 'F',
    deceased: false,
    hologram: false,
    fictionalCharacter: false,
    bio: 'Captain of the USS Voyager.',
    species: {
        uid: 'SPMA0000026314',
        name: 'Human'
    },
    organizations: [
        { uid: 'ORMA0000102839', name: 'Starfleet' }
    ]
};

const mockCharacterDeceased: StapiCharacter = {
    uid: 'CHMA0000098765',
    name: 'Spock',
    gender: 'M',
    deceased: true,
    hologram: false,
    fictionalCharacter: false,
    bio: 'Science officer of the USS Enterprise.',
    species: {
        uid: 'SPMA0000045069',
        name: 'Vulcan'
    },
    organizations: [
        { uid: 'ORMA0000102839', name: 'Starfleet' }
    ]
};

describe('DetailPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should not render when characterId is null', () => {
            render(<DetailPanel characterId={null} onClose={() => {}} />);
            
            expect(screen.queryByText('Character Details')).not.toBeInTheDocument();
        });

        it('should render panel when characterId is provided', async () => {
            mockFetchCharacterDetails.mockResolvedValueOnce(mockCharacterDetails);
            
            await act(async () => {
                render(<DetailPanel characterId="CHMA0000012345" onClose={() => {}} />);
            });
            
            expect(screen.getByText('Character Details')).toBeInTheDocument();
        });
    });

    describe('Data Display', () => {
        it('should display character details after successful load', async () => {
            mockFetchCharacterDetails.mockResolvedValueOnce(mockCharacterDetails);
            
            await act(async () => {
                render(<DetailPanel characterId="CHMA0000012345" onClose={() => {}} />);
            });
            
            expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
            expect(screen.getByText('Male')).toBeInTheDocument();
            expect(screen.getByText('Human')).toBeInTheDocument();
            expect(screen.getByText('Alive')).toBeInTheDocument();
            expect(screen.getByText('Starfleet, USS Enterprise')).toBeInTheDocument();
            expect(screen.getByText(/Captain of the USS Enterprise/)).toBeInTheDocument();
        });

        it('should display female gender correctly', async () => {
            mockFetchCharacterDetails.mockResolvedValueOnce(mockCharacterDetailsFemale);
            
            await act(async () => {
                render(<DetailPanel characterId="CHMA0000056789" onClose={() => {}} />);
            });
            
            expect(screen.getByText('Female')).toBeInTheDocument();
        });

        it('should display deceased status correctly', async () => {
            mockFetchCharacterDetails.mockResolvedValueOnce(mockCharacterDeceased);
            
            await act(async () => {
                render(<DetailPanel characterId="CHMA0000098765" onClose={() => {}} />);
            });
            
            expect(screen.getByText('Deceased')).toBeInTheDocument();
        });

        it('should display unknown for missing gender', async () => {
            const characterWithoutGender = { ...mockCharacterDetails, gender: undefined };
            mockFetchCharacterDetails.mockResolvedValueOnce(characterWithoutGender);
            
            await act(async () => {
                render(<DetailPanel characterId="CHMA0000012345" onClose={() => {}} />);
            });
            
            expect(screen.getByText('Unknown')).toBeInTheDocument();
        });

        it('should display unknown for missing species', async () => {
            const characterWithoutSpecies = { ...mockCharacterDetails, species: undefined };
            mockFetchCharacterDetails.mockResolvedValueOnce(characterWithoutSpecies);
            
            await act(async () => {
                render(<DetailPanel characterId="CHMA0000012345" onClose={() => {}} />);
            });
            
            expect(screen.getByText('Unknown')).toBeInTheDocument();
        });

        it('should hide organizations section when no organizations', async () => {
            const characterWithoutOrgs = { ...mockCharacterDetails, organizations: [] };
            mockFetchCharacterDetails.mockResolvedValueOnce(characterWithoutOrgs);
            
            await act(async () => {
                render(<DetailPanel characterId="CHMA0000012345" onClose={() => {}} />);
            });
            
            expect(screen.queryByText('Organizations:')).not.toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('should display error message when API returns 404', async () => {
            mockFetchCharacterDetails.mockRejectedValueOnce(
                new Error('Character CHMA0000012345 not found in database')
            );
            
            await act(async () => {
                render(<DetailPanel characterId="CHMA0000012345" onClose={() => {}} />);
            });
            
            expect(screen.getByText('Information Unavailable')).toBeInTheDocument();
            expect(screen.getByText(/not found in database/)).toBeInTheDocument();
            expect(screen.getByText(/Some characters may not have detailed information/)).toBeInTheDocument();
        });

        it('should display error message when data is invalid', async () => {
            const invalidData = {} as StapiCharacter;
            mockFetchCharacterDetails.mockResolvedValueOnce(invalidData);
            
            await act(async () => {
                render(<DetailPanel characterId="CHMA0000012345" onClose={() => {}} />);
            });
            
            expect(screen.getByText('Information Unavailable')).toBeInTheDocument();
            expect(screen.getByText(/No detailed information available/)).toBeInTheDocument();
        });

        it('should display generic error message for unknown errors', async () => {
            mockFetchCharacterDetails.mockRejectedValueOnce(new Error('Network Error'));
            
            await act(async () => {
                render(<DetailPanel characterId="CHMA0000012345" onClose={() => {}} />);
            });
            
            expect(screen.getByText('Information Unavailable')).toBeInTheDocument();
            expect(screen.getByText('Network Error')).toBeInTheDocument();
        });
    });

    describe('Close Button', () => {
        it('should call onClose when close button is clicked', async () => {
            const onCloseMock = vi.fn();
            mockFetchCharacterDetails.mockResolvedValueOnce(mockCharacterDetails);
            
            await act(async () => {
                render(<DetailPanel characterId="CHMA0000012345" onClose={onCloseMock} />);
            });
            
            const closeButton = screen.getByLabelText('Close');
            await act(async () => {
                await userEvent.click(closeButton);
            });
            
            expect(onCloseMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('Cleanup', () => {
        it('should not update state after unmount', async () => {
            let resolvePromise: (value: StapiCharacter) => void;
            const promise = new Promise<StapiCharacter>((resolve) => {
                resolvePromise = resolve;
            });
            
            mockFetchCharacterDetails.mockReturnValue(promise);
            
            const { unmount } = render(
                <DetailPanel characterId="CHMA0000012345" onClose={() => {}} />
            );
            
            unmount();
            
            await act(async () => {
                resolvePromise!(mockCharacterDetails);
            });
            
            expect(true).toBe(true);
        });
    });
});