import { describe, it, expect, vi, afterEach } from 'vitest';
import { exportSelectedItemsToCSV } from './csv-export';
import type { SearchResult } from '../types/types';

const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();

beforeAll(() => {
  vi.stubGlobal('URL', {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

const mockItems: SearchResult[] = [
  {
    id: '1',
    name: 'Jean-Luc Picard',
    gender: 'M',
    species: 'Human',
    deceased: false,
    hologram: false,
    organizations: ['Starfleet', 'USS Enterprise'],
    description: 'Captain of the USS Enterprise',
  },
  {
    id: '2',
    name: 'Kathryn Janeway',
    gender: 'F',
    species: 'Human',
    deceased: false,
    hologram: false,
    organizations: ['Starfleet', 'USS Voyager'],
    description: 'Captain of the USS Voyager',
  },
];

describe('csv-export', () => {
  it('should not export when no items selected', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    exportSelectedItemsToCSV([], mockItems);
    
    expect(consoleSpy).toHaveBeenCalledWith('No items selected for export');
    expect(mockCreateObjectURL).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should export selected items to CSV', () => {
    const mockUrl = 'blob:test-url';
    mockCreateObjectURL.mockReturnValue(mockUrl);
    
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');
    
    exportSelectedItemsToCSV(['1'], mockItems);
    
    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalledTimes(1);
    expect(removeChildSpy).toHaveBeenCalledTimes(1);
    
    const anchor = createElementSpy.mock.results[0]?.value as HTMLAnchorElement;
    expect(anchor.download).toBe('1_items.csv');
    
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('should use custom filename when provided', () => {
    const mockUrl = 'blob:test-url';
    mockCreateObjectURL.mockReturnValue(mockUrl);
    
    const createElementSpy = vi.spyOn(document, 'createElement');
    
    exportSelectedItemsToCSV(['1'], mockItems, { filename: 'custom-export.csv' });
    
    const anchor = createElementSpy.mock.results[0]?.value as HTMLAnchorElement;
    expect(anchor.download).toBe('custom-export.csv');
    
    createElementSpy.mockRestore();
  });

  it('should use custom headers when provided', () => {
    const mockUrl = 'blob:test-url';
    mockCreateObjectURL.mockReturnValue(mockUrl);
    
    const customHeaders = ['Character', 'Status'];
    exportSelectedItemsToCSV(['1'], mockItems, { headers: customHeaders });
    
    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    const blob = mockCreateObjectURL.mock.calls[0][0] as Blob;
    
    expect(blob.type).toBe('text/csv;charset=utf-8;');
  });

  it('should format gender correctly', () => {
    const mockUrl = 'blob:test-url';
    mockCreateObjectURL.mockReturnValue(mockUrl);
    
    exportSelectedItemsToCSV(['1', '2'], mockItems);
    
    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
  });
});