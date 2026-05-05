import { Component } from "react";
import { type SearchResult } from "../../types/types";
import { SearchForm } from "../search-form/search-form";
import { ResultsTable } from "../results-table/results-table";
import { searchAPI } from "../../api";
import './module.css';

const STORAGE_KEY = 'lastSearchQuery';
interface AppState {
    query: string;
    results: SearchResult[];
    loading: boolean;
    error: string | null;
    hasSearched: boolean;
}

export class App extends Component<object, AppState> {
    state: AppState = {
        query: '',
        results: [],
        loading: false,
        error: null,
        hasSearched: false,
    };

    componentDidMount() {
        const savedQuery = localStorage.getItem(STORAGE_KEY);
        if (savedQuery && savedQuery.trim()) {
            this.handleSearch(savedQuery);
        }
    }

    private saveQueryToStorage(query: string) {
        if (query.trim()) {
            localStorage.setItem(STORAGE_KEY, query);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            this.setState({
                results: [],
                error: null,
                hasSearched: false,
                query: searchQuery,
            });
            this.saveQueryToStorage('');
            return;
        }

        this.saveQueryToStorage(searchQuery);

        this.setState({
            loading: true,
            error: null,
            results: [],
            hasSearched: true,
            query: searchQuery,
        });

        try {
            const data = await searchAPI(searchQuery);
            this.setState({
                results: data,
                loading: false,
                error: data.length === 0 ? 'Nothing to find' : null,
            });
        } catch (err) {
            this.setState({
                error: err instanceof Error ? err.message : 'Unknown error',
                results: [],
                loading: false,
            });
        }
    };

    render() {
        const { results, loading, error, hasSearched } = this.state;
        const initialQuery = localStorage.getItem(STORAGE_KEY) || undefined;

        return (
            <div className="app-container">
                <section className="search-section">
                    <h2>Search</h2>
                    <SearchForm onSearch={this.handleSearch} loading={loading} initialQuery={initialQuery} />
                </section>
                <section className="results-section">
                    <h2>Results</h2>
                    <ResultsTable results={results} loading={loading} error={error} hasSearched={hasSearched} />
                </section>
            </div>
        );
    }
}