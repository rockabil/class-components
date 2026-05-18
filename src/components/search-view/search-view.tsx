import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type SearchResult } from "../../types/types";
import { SearchForm } from "../search-form/search-form";
import { ResultsTable } from "../results-table/results-table";
import { Pagination } from "../pagination/pagination";
import { DetailPanel } from "../detail-panel/detail-panel";
import { Loader } from "../loader";
import { TestErrorButton } from "../error-button";
import { loadAllCharactersWithDetails } from "../../api";
import { usePagination } from '../../hooks';
import './module.css';

const STORAGE_KEY = 'lastSearchQuery';
const ITEMS_PER_PAGE = 10;

export const SearchView = () => {
    const [allResults, setAllResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(() => {
        return localStorage.getItem(STORAGE_KEY) || '';
    });
    
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCharacterId = searchParams.get('details');
    
    const filteredResults = useMemo(() => {
        if (allResults.length === 0) return [];
        
        const trimmedQuery = searchQuery.trim();
        
        if (!trimmedQuery) {
            return allResults;
        }
        
        return allResults.filter(item =>
            item.name.toLowerCase().includes(trimmedQuery.toLowerCase())
        );
    }, [allResults, searchQuery]);

    const {
        currentPage,
        totalPages,
        goToPage,
        resetPage,
        getCurrentPageItems
    } = usePagination({
        totalItems: filteredResults.length,
        itemsPerPage: ITEMS_PER_PAGE
    });
    
    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!isMounted) return;
            
            setLoading(true);
            setError(null);

            try {
                const data = await loadAllCharactersWithDetails();
                if (isMounted) {
                    setAllResults(data);                    
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to load data');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        
        return () => {
            isMounted = false;
        };
    }, []);    
      
    useEffect(() => {
        resetPage();
    }, [searchQuery, resetPage]);
   
    useEffect(() => {
        if (searchQuery) {
            localStorage.setItem(STORAGE_KEY, searchQuery);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [searchQuery]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query.trim());
    }, []);
    
    const handleSelectCharacter = useCallback((id: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('details', id);
        setSearchParams(newParams, { replace: true });
    }, [searchParams, setSearchParams]);
    
    const handleCloseDetails = useCallback(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('details');
        setSearchParams(newParams, { replace: true });
    }, [searchParams, setSearchParams]);

    const paginatedResults = getCurrentPageItems(filteredResults);    

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
                            onSelectCharacter={handleSelectCharacter}
                            selectedCharacterId={selectedCharacterId}
                        />
                        
                        {!loading && !error && (
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
                    onClose={handleCloseDetails}
                />
            </div>
        </div>
    );    
};