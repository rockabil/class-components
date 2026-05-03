import { Component } from "react";
import { type SearchResult } from "../types/types";
import { SearchForm } from "./search-form";

interface AppState {
    query: string;
    results: SearchResult[];
    loading: boolean;
    error: string | null;
    hasSearched: boolean;
}

export class App extends Component<{}, AppState> {
    state: AppState = {
        query: '',
        results: [],
        loading: false,
        error: null,
        hasSearched: false,    
    };

    handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      this.setState({
        results: [],
        error: null,
        hasSearched: false,
        query: searchQuery,
      });
      return;
    }

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
    return (
        <div className="app-container">
        <section className="search-section">
            <h2>Search</h2>
        <SearchForm onSearch={this.handleSearch} loading={loading} />
        </section>
        <section className="results-section">
            <h2>Results</h2>
            <ResultsTable results={results} loading={loading} error={error} hasSearched={hasSearched} />
        </section>
    </div>
    );
}
}