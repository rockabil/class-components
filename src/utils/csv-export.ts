import type { SearchResult } from '../types/types';

interface ExportOptions {
  filename?: string;
  headers?: string[];
}

const DEFAULT_HEADERS = ['Name', 'Gender', 'Species', 'Status', 'Organization', 'Description'];

const formatGender = (gender?: string): string => {
  if (gender === 'M') return 'Male';
  if (gender === 'F') return 'Female';
  return 'Unknown';
};

const formatSpecies = (species?: string): string => species || '—';

const formatStatus = (deceased?: boolean): string => deceased ? 'Deceased' : 'Alive';

const formatOrganizations = (organizations?: string[]): string => 
  organizations?.slice(0, 2).join(', ') || '—';

const formatDescription = (description?: string): string => 
  (description || '—').replace(/,/g, ';');

const transformItemToRow = (item: SearchResult): string[] => [
  item.name,
  formatGender(item.gender),
  formatSpecies(item.species),
  formatStatus(item.deceased),
  formatOrganizations(item.organizations),
  formatDescription(item.description),
];

const generateCSVContent = (items: SearchResult[], headers: string[]): string => {
  const rows = items.map(transformItemToRow);
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
};

const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportSelectedItemsToCSV = (
  selectedIds: string[],
  allItems: SearchResult[],
  options: ExportOptions = {}
): void => {
  if (selectedIds.length === 0) {
    console.warn('No items selected for export');
    return;
  }

  const { filename = `${selectedIds.length}_items.csv`, headers = DEFAULT_HEADERS } = options;
  const selectedItems = allItems.filter(item => selectedIds.includes(item.id));
  const csvContent = generateCSVContent(selectedItems, headers);
  
  downloadCSV(csvContent, filename);
};