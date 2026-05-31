import { useSelectedItemsStore } from '../../store/selected-items-store';
import { exportSelectedItemsToCSV } from '../../utils/csv-export';
import type { SearchResult } from '../../types/types';
import './module.css';

interface FlyoutProps {
  allItems: SearchResult[];
}

export const Flyout = ({ allItems }: FlyoutProps) => {
  const { selectedIds, unselectAll } = useSelectedItemsStore();

  if (selectedIds.length === 0) return null;

  const handleDownload = () => {
    exportSelectedItemsToCSV(selectedIds, allItems);
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