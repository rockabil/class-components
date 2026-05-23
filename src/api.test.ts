// src/api.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  searchCharacters, 
  fetchCharacterDetails, 
  generateDescription, 
  loadAllCharactersWithDetails 
} from './api';
import type { StapiCharacter } from './types/types';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('API Functions', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('searchCharacters', () => {
    it('should make a POST request with correct parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ characters: [] }),
      });

      await searchCharacters('Kirk', 0, 50);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://stapi.co/api/v1/rest/character/search',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: expect.any(String),
        }
      );
    });

    it('should throw an error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(searchCharacters('Kirk')).rejects.toThrow('Server error: 500');
    });

    it('should return an array of characters', async () => {
      const mockCharacters = [{ uid: '1', name: 'Kirk' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ characters: mockCharacters }),
      });

      const result = await searchCharacters('Kirk');
      expect(result).toEqual(mockCharacters);
    });

    it('should return an empty array when characters are missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await searchCharacters('Kirk');
      expect(result).toEqual([]);
    });
  });

  describe('fetchCharacterDetails', () => {
    it('should make a GET request to the correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ character: { uid: '1', name: 'Kirk' } }),
      });

      await fetchCharacterDetails('CHARA00001');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://stapi.co/api/v1/rest/character/CHARA00001'
      );
    });

    it('should throw an error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(fetchCharacterDetails('123')).rejects.toThrow(
        'Failed to fetch details for 123'
      );
    });
  });

  describe('generateDescription', () => {
    it('should generate description with gender', () => {
      const character = { gender: 'M' } as StapiCharacter;
      expect(generateDescription(character)).toContain('Gender: Male');
    });

    it('should add "Deceased" for deceased characters', () => {
      const character = { deceased: true } as StapiCharacter;
      expect(generateDescription(character)).toContain('Deceased');
    });

    it('should add "Hologram" for holograms', () => {
      const character = { hologram: true } as StapiCharacter;
      expect(generateDescription(character)).toContain('Hologram');
    });

    it('should truncate bio to 100 characters', () => {
      const longBio = 'a'.repeat(200);
      const character = { bio: longBio } as StapiCharacter;
      const result = generateDescription(character);
      expect(result.length).toBeLessThan(150);
      expect(result).toContain('...');
    });

    it('should return default message when no data available', () => {
      const character = {} as StapiCharacter;
      expect(generateDescription(character)).toBe('No additional information available');
    });
  });

  describe('loadAllCharactersWithDetails', () => {
    it('should load all characters with details', async () => {
      const mockCharacters = [
        { uid: '1', name: 'Kirk' },
        { uid: '2', name: 'Spock' },
      ];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ characters: mockCharacters }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          character: { uid: '1', name: 'Kirk', gender: 'M', bio: 'Captain' } 
        }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          character: { uid: '2', name: 'Spock', gender: 'M', bio: 'Science Officer' } 
        }),
      });

      const results = await loadAllCharactersWithDetails();
      
      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('Kirk');
      expect(results[1].name).toBe('Spock');
    });

    it('should throw an error when no characters found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ characters: [] }),
      });

      await expect(loadAllCharactersWithDetails()).rejects.toThrow('No characters found');
    });

    it('should handle error when loading details and add fallback', async () => {
      const mockCharacters = [{ uid: '1', name: 'Kirk' }];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ characters: mockCharacters }),
      });

      mockFetch.mockResolvedValueOnce({ ok: false });

      const results = await loadAllCharactersWithDetails();
      
      expect(results[0].description).toBe('Detailed information not available');
    });
  });
});