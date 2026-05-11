// src/api.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  searchCharacters, 
  fetchCharacterDetails, 
  generateDescription, 
  loadAllCharactersWithDetails 
} from './api';
import type { StapiCharacter } from './types/types';

// Мок глобального fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Functions', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('searchCharacters', () => {
    it('должен выполнить POST-запрос с правильными параметрами', async () => {
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

    it('должен выбросить ошибку при ответе не ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(searchCharacters('Kirk')).rejects.toThrow('Server error: 500');
    });

    it('должен вернуть массив персонажей', async () => {
      const mockCharacters = [{ uid: '1', name: 'Kirk' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ characters: mockCharacters }),
      });

      const result = await searchCharacters('Kirk');
      expect(result).toEqual(mockCharacters);
    });

    it('должен вернуть пустой массив, если characters отсутствует', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await searchCharacters('Kirk');
      expect(result).toEqual([]);
    });
  });

  describe('fetchCharacterDetails', () => {
    it('должен выполнить GET-запрос к правильному URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ character: { uid: '1', name: 'Kirk' } }),
      });

      await fetchCharacterDetails('CHARA00001');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://stapi.co/api/v1/rest/character/CHARA00001'
      );
    });

    it('должен выбросить ошибку при неудачном запросе', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(fetchCharacterDetails('123')).rejects.toThrow(
        'Failed to fetch details for 123'
      );
    });
  });

  describe('generateDescription', () => {
    it('должен сгенерировать описание с полом', () => {
      const character = { gender: 'M' } as StapiCharacter;
      expect(generateDescription(character)).toContain('Gender: Male');
    });

    it('должен добавить "Deceased" для умерших', () => {
      const character = { deceased: true } as StapiCharacter;
      expect(generateDescription(character)).toContain('Deceased');
    });

    it('должен добавить "Hologram" для голограмм', () => {
      const character = { hologram: true } as StapiCharacter;
      expect(generateDescription(character)).toContain('Hologram');
    });

    it('должен обрезать bio до 100 символов', () => {
      const longBio = 'a'.repeat(200);
      const character = { bio: longBio } as StapiCharacter;
      const result = generateDescription(character);
      expect(result.length).toBeLessThan(150);
      expect(result).toContain('...');
    });

    it('должен вернуть сообщение по умолчанию, если нет данных', () => {
      const character = {} as StapiCharacter;
      expect(generateDescription(character)).toBe('No additional information available');
    });
  });

  describe('loadAllCharactersWithDetails', () => {
    it('должен загрузить всех персонажей с деталями', async () => {
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

    it('должен выбросить ошибку, если персонажи не найдены', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ characters: [] }),
      });

      await expect(loadAllCharactersWithDetails()).rejects.toThrow('No characters found');
    });

    it('должен обработать ошибку при загрузке деталей и добавить fallback', async () => {
      const mockCharacters = [{ uid: '1', name: 'Kirk' }];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ characters: mockCharacters }),
      });

      mockFetch.mockResolvedValueOnce({ ok: false });

      const results = await loadAllCharactersWithDetails();
      
      expect(results[0].description).toBe('Information not available');
    });
  });
});