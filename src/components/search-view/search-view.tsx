import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type SearchResult } from "../../types/types";
import { SearchForm } from "../search-form/search-form";
import { ResultsTable } from "../results-table/results-table";
import Pagination from "../pagination/pagination";
import { DetailPanel } from "../detail-panel/detail-panel";
import { Loader } from "../loader";
import { TestErrorButton } from "../error-button";
import { loadAllCharactersWithDetails } from "../../api";
import { Flyout } from '../flyout/flyout';
import './module.css';

const STORAGE_KEY = 'lastSearchQuery';
const ITEMS_PER_PAGE = 20;

export const SearchView = () => {
    const [allResults, setAllResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(() => {
        return localStorage.getItem(STORAGE_KEY) || '';
    });
    
    const [searchParams, setSearchParams] = useSearchParams();
        
    const currentPage = Number(searchParams.get('page')) || 1;
    const selectedCharacterId = searchParams.get('details');    
    
    const filteredResults = useMemo(() => {
        if (allResults.length === 0) return [];
        
        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) return allResults;
        
        return allResults.filter(item =>
            item.name.toLowerCase().includes(trimmedQuery.toLowerCase())
        );
    }, [allResults, searchQuery]);    
    
    const totalPages = Math.max(1, Math.ceil(filteredResults.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedResults = filteredResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);    
    
    const goToPage = useCallback((page: number) => {
        const newParams = new URLSearchParams(searchParams);
        if (page === 1) {
            newParams.delete('page');
        } else {
            newParams.set('page', page.toString());
        }
        setSearchParams(newParams, { replace: true });
    }, [searchParams, setSearchParams]);    
    
    const selectCharacter = useCallback((id: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('details', id);
        setSearchParams(newParams, { replace: true });
    }, [searchParams, setSearchParams]);    
    
    const closeDetails = useCallback(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('details');
        setSearchParams(newParams, { replace: true });
    }, [searchParams, setSearchParams]);    
    
    const handleSearch = useCallback((query: string) => {
        const trimmed = query.trim();
        setSearchQuery(trimmed);        
       
        if (currentPage !== 1) {
            goToPage(1);
        }
    }, [currentPage, goToPage]);
    
    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!isMounted) return;
            setLoading(true);
            setError(null);
            
            try {
                const data = await loadAllCharactersWithDetails();
                if (isMounted) setAllResults(data);
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to load data');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        
        fetchData();
        return () => { isMounted = false; };
    }, []);    
    
    useEffect(() => {
        if (searchQuery) {
            localStorage.setItem(STORAGE_KEY, searchQuery);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [searchQuery]);
    
    return (
        <div className="search-view">
            {loading && <Loader size={60} speed={0.8} thickness={3} />}
            
            <div className={`app-container ${selectedCharacterId ? 'with-details' : ''}`}>
                <div className="results-wrapper">
                    <div className="search-section">
                        <h2>Search</h2>
                        <SearchForm 
                            onSearch={handleSearch} 
                            loading={loading} 
                            initialQuery={searchQuery}
                        />
                    </div>
                    
                    <div className="results-section">
                        <h2>Results ({filteredResults.length})</h2>
                        <ResultsTable 
                            results={paginatedResults} 
                            loading={loading} 
                            error={error} 
                            hasSearched={!loading && allResults.length > 0}
                            onSelectCharacter={selectCharacter}
                            selectedCharacterId={selectedCharacterId}
                        />
                        
                        {!loading && !error && totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={goToPage}
                                disabled={loading}
                            />
                        )}
                        
                        <TestErrorButton />
                    </div>
                </div>
                
                <DetailPanel 
                    characterId={selectedCharacterId}
                    onClose={closeDetails}
                />               
            </div>
            <Flyout allItems={allResults} />
        </div>
        
    );
};