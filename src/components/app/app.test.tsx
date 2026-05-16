import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { App } from './app';
import * as api from '../../api';
import type { SearchResult } from '../../types/types';

vi.mock('../../api');
const mockLoadAll = vi.mocked(api.loadAllCharactersWithDetails);

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
  {
    id: '3',
    name: 'Jean-Luc Picard',
    description: 'Captain of USS Enterprise-D',
    gender: 'M',
    deceased: false,
    hologram: false,
    species: 'Human',
    organizations: ['Starfleet'],
  },
];

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Initial Data Load', () => {
    it('should load data when component is mounted', async () => {
      mockLoadAll.mockResolvedValueOnce(mockCharacters);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
        expect(screen.getByText('Spock')).toBeInTheDocument();
        expect(screen.getByText('Jean-Luc Picard')).toBeInTheDocument();
      });
    });

    it('should show the Loader when is loading', () => {
      mockLoadAll.mockImplementation(
        () => new Promise<SearchResult[]>(() => {})
      );

      render(<App />);

      expect(screen.getByText(/Loading characters from Star Trek universe/i)).toBeInTheDocument();
    });

    it('should display error message when API request fails', async () => {
      mockLoadAll.mockRejectedValueOnce(new Error('Network Error'));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Error:/i)).toBeInTheDocument();
        expect(screen.getByText('Network Error')).toBeInTheDocument();
      });
    });

    it('should hide loading indicator after data loads', async () => {
      mockLoadAll.mockResolvedValueOnce(mockCharacters);

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading characters from Star Trek universe/i)).not.toBeInTheDocument();
      });
    });

    it('should hide loading indicator when API request fails', async () => {
      mockLoadAll.mockRejectedValueOnce(new Error('Error'));

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText(/Loading characters from Star Trek universe/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Search Term Persistence (localStorage)', () => {
    it('should load saved search query from localStorage in input field', async () => {
      localStorage.setItem('lastSearchQuery', 'Kirk');
      mockLoadAll.mockResolvedValueOnce(mockCharacters);

      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Kirk')).toBeInTheDocument();
      });   
    });

    it('should show empty input when localStorage has no saved term', async () => {
      mockLoadAll.mockResolvedValueOnce(mockCharacters);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue('');
      });      
    });

    it('should save search term to localStorage after user searches', async () => {
      const user = userEvent.setup();
      mockLoadAll.mockResolvedValueOnce(mockCharacters);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Picard');
      await user.click(screen.getByRole('button', { name: /find/i }));

      await waitFor(() => {
        expect(screen.getByText('Jean-Luc Picard')).toBeInTheDocument();
      });

      expect(localStorage.getItem('lastSearchQuery')).toBe('Picard');      
    });

    it('should delete query from localStorage when clearing search via Clear button', async () => {
      localStorage.setItem('lastSearchQuery', 'Kirk');
      const user = userEvent.setup();
      mockLoadAll.mockResolvedValueOnce(mockCharacters);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Kirk')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /clear/i }));

      await waitFor(() => {
        expect(localStorage.getItem('lastSearchQuery')).toBeNull();
      })      
    });

    it('should remove localStorage entry when clearing search', async () => {
      // Feature 7: удаление из localStorage
      localStorage.setItem('lastSearchQuery', 'Kirk');
      const user = userEvent.setup();
      mockLoadAll.mockResolvedValueOnce(mockCharacters);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Kirk')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /clear/i }));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue('');
      });

      expect(localStorage.getItem('lastSearchQuery')).toBeNull();
    });
  });

  describe('Search Functionality', () => {
    it('should filter the results of search query', async () => {
      const user = userEvent.setup();
      mockLoadAll.mockResolvedValueOnce(mockCharacters);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Spock');
      await user.click(screen.getByRole('button', { name: /find/i }));

      await waitFor(() => {
        expect(screen.getByText('Spock')).toBeInTheDocument();
        expect(screen.queryByText('James T. Kirk')).not.toBeInTheDocument();        
      });
    });

    it('have to show "No characters found" when search returns no results', async () => {
      const user = userEvent.setup();
      mockLoadAll.mockResolvedValueOnce(mockCharacters);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'NonexistentCharacter');
      await user.click(screen.getByRole('button', { name: /find/i }));

      await waitFor(() => {
        expect(screen.getByText(/No characters found matching your query/i)).toBeInTheDocument();        
      });
    });

    it('should reset the filter and  show all results when clearing search', async () => {
      const user = userEvent.setup();
      mockLoadAll.mockResolvedValueOnce(mockCharacters);

      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
      });
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Spock');
      await user.click(screen.getByRole('button', { name: /find/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Spock')).toBeInTheDocument();
        expect(screen.queryByText('James T. Kirk')).not.toBeInTheDocument();        
      });
      
      await user.click(screen.getByRole('button', { name: /clear/i }));
      
      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
        expect(screen.getByText('Spock')).toBeInTheDocument();
        expect(screen.getByText('Jean-Luc Picard')).toBeInTheDocument();        
      });
    });

    it('should perform case-insensitive search', async () => {
      const user = userEvent.setup();
      mockLoadAll.mockResolvedValueOnce(mockCharacters);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'spock');
      await user.click(screen.getByRole('button', { name: /find/i }));

      await waitFor(() => {
        expect(screen.getByText('Spock')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data from API', async () => {
      mockLoadAll.mockResolvedValueOnce([]);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/No characters found/i)).toBeInTheDocument();
      });
    });

    it('should work correctly when search is performed after clearing', async () => {
      const user = userEvent.setup();
      mockLoadAll.mockResolvedValueOnce(mockCharacters);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Spock');
      await user.click(screen.getByRole('button', { name: /find/i }));

      await waitFor(() => {
        expect(screen.getByText('Spock')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /clear/i }));

      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
      });

      await user.type(input, 'Picard');
      await user.click(screen.getByRole('button', { name: /find/i }));

      await waitFor(() => {
        expect(screen.getByText('Jean-Luc Picard')).toBeInTheDocument();
        expect(screen.queryByText('Spock')).not.toBeInTheDocument();
      });
    });
  });
});