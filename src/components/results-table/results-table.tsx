import type { SearchResult } from "../../types/types";
import { ErrorMessage } from "../error-message/error-message";
import './module.css';
interface ResultsTableProps {
    results: SearchResult[];
    loading: boolean;
    error: string | null;
    hasSearched: boolean;
}

export const ResultsTable = ({ results, loading, error, hasSearched }: ResultsTableProps) => {
    {        
        if (loading) {
            return <div className="loading">Loading characters from Star Trek universe...</div>
        }

        if (error) {
            return <ErrorMessage message={error} />;
        }

        if (!hasSearched) {
            return <div className="info-message">Enter your query and click &quot;Find&quot;</div>
        }

        if (results.length === 0) {
            return <div className="info-message">No characters found matching your query</div>
        }

        return (
            <div className="results-table-container">
                <table className="results-table">
                <thead>
                    <tr>                        
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Species</th>
                        <th>Status</th>
                        <th>Organization</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((item) => (
                        <tr key={item.id}>
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