import { useSelectedItemsStore } from '../../store/selected-items-store';
import type { SearchResult } from '../../types/types';
import './module.css';

interface FlyoutProps {
  allItems: SearchResult[];
}

export const Flyout = ({ allItems }: FlyoutProps) => {
  const { selectedIds, unselectAll } = useSelectedItemsStore();

  if (selectedIds.length === 0) return null;

  const handleDownload = () => {
    const selectedItems = allItems.filter(item => selectedIds.includes(item.id));
    const headers = ['Name', 'Gender', 'Species', 'Status', 'Organization', 'Description'];
    
     const rows = selectedItems.map(item => [
      item.name,
      item.gender === 'M' ? 'Male' : item.gender === 'F' ? 'Female' : 'Unknown',
      item.species || '—',
      item.deceased ? 'Deceased' : 'Alive',
      item.organizations?.slice(0, 2).join(', ') || '—',
      (item.description || '—').replace(/,/g, ';')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedIds.length}_items.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flyout">
      <span>Selected: {selectedIds.length}</span>
      <div>
        <button onClick={unselectAll} className="flyout-toggle-button">Unselect all</button>
        <button onClick={handleDownload} className="flyout-toggle-button">Download</button>
      </div>
    </div>
  );
};