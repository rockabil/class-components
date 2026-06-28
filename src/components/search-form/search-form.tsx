'use client';
import { useState } from 'react';
import './module.css';

interface SearchFormProps {
    onSearch: (query: string) => void;
    loading: boolean;
    initialQuery?: string;
}

export default function SearchForm({ onSearch, loading, initialQuery = '' }: SearchFormProps) {
    const [query, setQuery] = useState(initialQuery);
       
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            onSearch(trimmedQuery);
        }
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Enter request..."
                disabled={loading}
                className="search-input"
            />
            <button 
                type="submit" 
                disabled={loading || !query.trim()} 
                className="search-button"
            >
                {loading ? 'Searching...' : 'Find'}
            </button>
            <button 
                type="button" 
                onClick={handleClear}
                disabled={loading || !query}
                className="clear-button"
            >
                Clear
            </button>
        </form>
    );
};