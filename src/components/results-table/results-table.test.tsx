// src/components/results-table/results-table.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '../__tests__/test-utils';
import { ResultsTable } from './results-table';
import type { SearchResult } from '../../types/types';

const mockResults: SearchResult[] = [
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

describe('ResultsTable', () => {
  describe('Rendering Tests', () => {
    it('should show loading status', () => {
      render(
        <ResultsTable
          results={[]}
          loading={true}
          error={null}
          hasSearched={false}
        />
      );

      expect(screen.getByText(/Loading characters from Star Trek universe/i)).toBeInTheDocument();
    });

    it('should show an error message', () => {
      render(
        <ResultsTable
          results={[]}
          loading={false}
          error="API Error"
          hasSearched={true}
        />
      );

      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });

    it('should show a message if the search has not yet been performed', () => {
      render(
        <ResultsTable
          results={[]}
          loading={false}
          error={null}
          hasSearched={false}
        />
      );

      expect(screen.getByText(/Enter your query and click "Find"/i)).toBeInTheDocument();
    });

    it('should show "no results" when the array is empty', () => {
      render(
        <ResultsTable
          results={[]}
          loading={false}
          error={null}
          hasSearched={true}
        />
      );

      expect(screen.getByText(/No characters found matching your query/i)).toBeInTheDocument();
    });

    it('should render the table with the correct number of rows', () => {
      render(
        <ResultsTable
          results={mockResults}
          loading={false}
          error={null}
          hasSearched={true}
        />
      );

      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3);
    });

    it('should display character names', () => {
      render(
        <ResultsTable
          results={mockResults}
          loading={false}
          error={null}
          hasSearched={true}
        />
      );

      expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
      expect(screen.getByText('Spock')).toBeInTheDocument();
    });
  });

  describe('Data Display Tests', () => {
    it('should display gender correctly (Male)', () => {
      render(
        <ResultsTable
          results={[mockResults[0]]}
          loading={false}
          error={null}
          hasSearched={true}
        />
      );

      expect(screen.getByText('♂ Male')).toBeInTheDocument();
    });

    it('should display "—" if gender is not specified', () => {
      const resultWithoutGender = { ...mockResults[0], gender: undefined };
      render(
        <ResultsTable
          results={[resultWithoutGender]}
          loading={false}
          error={null}
          hasSearched={true}
        />
      );

      expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('should display the Alive status correctly', () => {
      render(
        <ResultsTable
          results={[mockResults[0]]}
          loading={false}
          error={null}
          hasSearched={true}
        />
      );

      expect(screen.getByText('✓ Alive')).toBeInTheDocument();
    });

    it('should correctly display the Deceased status', () => {
      const deceasedResult = { ...mockResults[0], deceased: true };
      render(
        <ResultsTable
          results={[deceasedResult]}
          loading={false}
          error={null}
          hasSearched={true}
        />
      );

      expect(screen.getByText('X Deceased')).toBeInTheDocument();
    });

    it('must add (Hologram) for holograms', () => {
      const hologramResult = { ...mockResults[0], deceased: false, hologram: true };
      render(
        <ResultsTable
          results={[hologramResult]}
          loading={false}
          error={null}
          hasSearched={true}
        />
      );

      expect(screen.getByText('✓ Alive (Hologram)')).toBeInTheDocument();
    });

    it('must display organizations separated by commas', () => {
      render(
        <ResultsTable
          results={[mockResults[0]]}
          loading={false}
          error={null}
          hasSearched={true}
        />
      );

      expect(screen.getByText('Starfleet, USS Enterprise')).toBeInTheDocument();
    });

    it('should display "-" if there are no organizations', () => {
      const resultWithoutOrgs = { ...mockResults[0], organizations: undefined };
      render(
        <ResultsTable
          results={[resultWithoutOrgs]}
          loading={false}
          error={null}
          hasSearched={true}
        />
      );

      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('must handle undefined in species', () => {
      const resultWithoutSpecies = { ...mockResults[0], species: undefined };
      render(
        <ResultsTable
          results={[resultWithoutSpecies]}
          loading={false}
          error={null}
          hasSearched={true}
        />
      );

      expect(screen.getByText('James T. Kirk')).toBeInTheDocument();
    });
  });
});