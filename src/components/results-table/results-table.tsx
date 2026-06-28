'use client';
import { useTranslations } from "next-intl";
import type { SearchResult } from "../../types/types";
import ErrorMessage from "../error-message/error-message";
import { useSelectedItemsStore } from "../../store/selected-items-store";
import './module.css';
interface ResultsTableProps {
    results: SearchResult[];
    loading: boolean;
    error: string | null;
    hasSearched: boolean;
    onSelectCharacter?: (id: string) => void;
    selectedCharacterId?: string | null;
}

export default function ResultsTable({ results, loading, error, hasSearched, onSelectCharacter, selectedCharacterId }: ResultsTableProps) {
        const t = useTranslations('ResultsTable');
        const { selectedIds, toggleSelect } = useSelectedItemsStore();
    {        
        if (loading) {
            return <div className="loading">{t('loading')}</div>
        }

        if (error) {
            return <ErrorMessage message={error} />;
        }

        if (!hasSearched) {
            return <div className="info-message">{t('searching')}</div>
        }

        if (results.length === 0) {
            return <div className="info-message">{t('answer')}</div>
        }

        return (
            <div className="results-table-container">
                <table className="results-table">
                <thead>
                    <tr>
                        <th className="checkbox"></th>                        
                        <th>{t('name')}</th>
                        <th>{t('gender')}</th>
                        <th>{t('species')}</th>
                        <th>{t('status')}</th>
                        <th>{t('organization')}</th>
                        <th>{t('description')}</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((item) => (
                        <tr key={item.id} onClick={() => onSelectCharacter?.(item.id)}
                            className={`results-row ${selectedCharacterId === item.id ? 'selected' : ''}`}>
                            <td onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" checked={selectedIds.includes(item.id)}
                                onChange={() => toggleSelect(item.id)}
                                />
                            </td>                            
                            <td>{item.name}</td>
                            <td>{item.gender === 'M' ? '♂ Male' : item.gender === 'F' ? '♀ Female' : item.gender || '—'}</td>
                            <td>
                                {item.deceased ? 'X Deceased' : '✓ Alive'}
                                {item.hologram && ' (Hologram)'}
                            </td>
                            <td>{item.organizations?.slice(0, 2).join(', ') || '-'}</td>
                            <td>{item.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        )
    }
}