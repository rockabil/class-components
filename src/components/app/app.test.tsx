import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../_tests_/test-utils';
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
      
      expect(mockLoadAll).toHaveBeenCalledTimes(1);
      
      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
      });
    });

    it('should show the Loader when is loading', () => {
      mockLoadAll.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockCharacters), 100))
      );
      
      render(<App />);
      
      expect(document.querySelector('.overlay')).toBeInTheDocument();
    });

    it('have to show an error message whe loading fails', async () => {
      mockLoadAll.mockRejectedValueOnce(new Error('Network Error'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText(/Error:/i)).toBeInTheDocument();
        expect(screen.getByText('Network Error')).toBeInTheDocument();
      });
    });

    it('should display a number of results in the title', async () => {
      mockLoadAll.mockResolvedValueOnce(mockCharacters);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Results (3)')).toBeInTheDocument();
      });
    });
  });

  describe('Search Term Persistence (localStorage)', () => {
    it('should load saved search querry from localStorage', async () => {
      localStorage.setItem('lastSearchQuery', 'Kirk');
      mockLoadAll.mockResolvedValueOnce(mockCharacters);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Kirk')).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
        expect(screen.queryByText('Spock')).not.toBeInTheDocument();
      });
    });

    it('should save search querry in the localStorage when is searching', async () => {
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
      
      expect(localStorage.getItem('lastSearchQuery')).toBe('Picard');
    });

    it('should delete querry from the localStorage when searching empty via the button Clear', async () => {
      localStorage.setItem('lastSearchQuery', 'Kirk');
      const user = userEvent.setup();
      mockLoadAll.mockResolvedValueOnce(mockCharacters);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Kirk')).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: /clear/i }));
      
      expect(localStorage.getItem('lastSearchQuery')).toBeNull();
    });
  });

  describe('Search Functionality', () => {
    it('should filter the results of search querry', async () => {
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
      
      expect(screen.getByText('Spock')).toBeInTheDocument();
      expect(screen.queryByText('James T. Kirk')).not.toBeInTheDocument();
      expect(screen.getByText('Results (1)')).toBeInTheDocument();
    });

    it('have to show "No characters found" if there are no results', async () => {
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
      
      expect(screen.getByText(/No characters found matching your query/i)).toBeInTheDocument();
      expect(screen.getByText('Results (0)')).toBeInTheDocument();
    });

    it('should reset the filter when the search query is empty Clear', async () => {
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
      
      expect(screen.getByText('Spock')).toBeInTheDocument();
      
      await user.click(screen.getByRole('button', { name: /clear/i }));
      
      await waitFor(() => {
        expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
        expect(screen.getByText('Results (3)')).toBeInTheDocument();
      });
    });
  });

  describe('Loader Behavior', () => {
    it('should show the Loader when loading and hide after completion', async () => {
      let resolvePromise!: (value: SearchResult[]) => void;
      const promise = new Promise<SearchResult[]>((resolve) => {
        resolvePromise = resolve;
      });
      mockLoadAll.mockReturnValue(promise);
      
      render(<App />);
      
      expect(document.querySelector('.overlay')).toBeInTheDocument();
      
      resolvePromise(mockCharacters);
      
      await waitFor(() => {
        expect(document.querySelector('.overlay')).not.toBeInTheDocument();
      });
    });

    it('should hide Loader on error', async () => {
      mockLoadAll.mockRejectedValueOnce(new Error('Error'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(document.querySelector('.overlay')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('must handle empty data from the API', async () => {
      mockLoadAll.mockResolvedValueOnce([]);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Results (0)')).toBeInTheDocument();
        expect(screen.getByText(/No characters found/i)).toBeInTheDocument();
      });
    });

    it('should filter correctly based on case', async () => {
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
      
      expect(screen.getByText('Spock')).toBeInTheDocument();
    });
  });
});