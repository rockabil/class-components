'use client';
import { useTranslations } from 'next-intl';
import { useSelectedItemsStore } from '../../store/selected-items-store';
import { exportSelectedItemsToCSV } from '../../utils/csv-export';
import type { SearchResult } from '../../types/types';
import './module.css';

interface FlyoutProps {
  allItems: SearchResult[];
}

export default function Flyout({ allItems }: FlyoutProps) {
  const t = useTranslations('Flyout');
  const { selectedIds, unselectAll } = useSelectedItemsStore();

  if (selectedIds.length === 0) return null;

  const handleDownload = () => {
    exportSelectedItemsToCSV(selectedIds, allItems);
  };

  return (
    <div className="flyout">
      <span>Selected: {selectedIds.length}</span>
      <div>
        <button onClick={unselectAll} className="flyout-toggle-button">{t('unselection')}</button>
        <button onClick={handleDownload} className="flyout-toggle-button">{t('download')}</button>
      </div>
    </div>
  );
};