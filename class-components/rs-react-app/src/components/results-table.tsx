import { Component } from "react";
import type { SearchResult } from "../types/types";
import { ErrorMessage } from "./error-message";

interface ResultsTableProps {
    results: SearchResult[];
    loading: boolean; 
    error: string | null;
    hasSearched: boolean;
}

export class ResultsTable extends Component<ResultsTableProps> {
    render() {
        const { results, loading, error, hasSearched } = this.props;

        if (loading) {
            return <div className="loading">Loading...</div>
        }

        if (error) {
            return <ErrorMessage message={error} />;
        }

        if (!hasSearched) {
            return <div className="info-message">Enter your query and click &quot;Find&quot;</div>            
        }

        if (results.length === 0) {
            return <div className="info-message">Nothing found</div>
        }

        return (
            <table className="results-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }
}