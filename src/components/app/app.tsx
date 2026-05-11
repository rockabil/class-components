// src/components/app/app.tsx
import { Component } from "react";
import { type SearchResult } from "../../types/types";
import { SearchForm } from "../search-form/search-form";
import { ResultsTable } from "../results-table/results-table";
import { Loader } from "../loader";
import { loadAllCharactersWithDetails } from "../../api";
import './module.css';

const STORAGE_KEY = 'lastSearchQuery';

interface AppState {
    allResults: SearchResult[];
    filteredResults: SearchResult[];
    loading: boolean;
    error: string | null;
    hasLoaded: boolean;
}

export class App extends Component<object, AppState> {
    state: AppState = {
        allResults: [],
        filteredResults: [],
        loading: false,
        error: null,
        hasLoaded: false,
    };

    async componentDidMount() {
        await this.loadAllData();

        const savedQuery = localStorage.getItem(STORAGE_KEY);
        if (savedQuery && savedQuery.trim()) {
            this.filterResults(savedQuery);
        }
    }

    loadAllData = async () => {
        this.setState({ loading: true, error: null });

        try {
            const data = await loadAllCharactersWithDetails();
            this.setState({
                allResults: data,
                filteredResults: data,
                loading: false,
                hasLoaded: true,
            });
        } catch (err) {
            this.setState({
                error: err instanceof Error ? err.message : 'Failed to load data',
                loading: false,
            });
        }
    };   

    filterResults = (searchQuery: string) => {
        const { allResults } = this.state;
        const trimmedQuery = searchQuery.trim();
        
        if (!trimmedQuery) {            
            this.setState({ filteredResults: allResults });
            localStorage.removeItem(STORAGE_KEY);
            return;
        }        
        
        const filtered = allResults.filter(item =>
            item.name.toLowerCase().includes(trimmedQuery.toLowerCase())
        );
        
        this.setState({ filteredResults: filtered });
        localStorage.setItem(STORAGE_KEY, trimmedQuery);
    };

    handleSearch = (searchQuery: string) => {
        this.filterResults(searchQuery);       
    };

    render() {
        const { filteredResults, loading, error, hasLoaded } = this.state;
        const initialQuery = localStorage.getItem(STORAGE_KEY) || "";

        return (
            <>
                {/* Показываем лоадер во время загрузки */}
                {loading && <Loader size={60} speed={0.8} thickness={3} />}
                
                <div className="app-container">
                    <section className="search-section">
                        <h2>Search</h2>
                        <SearchForm 
                            onSearch={this.handleSearch} 
                            loading={loading} 
                            initialQuery={initialQuery}
                        />
                    </section>
                    <section className="results-section">
                        <h2>Results ({filteredResults.length})</h2>
                        <ResultsTable 
                            results={filteredResults} 
                            loading={loading} 
                            error={error} 
                            hasSearched={hasLoaded}
                        />
                    </section>
                </div>
            </>
        );
    }
}