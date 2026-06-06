import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchForm } from "../search-form/search-form";
import { ResultsTable } from "../results-table/results-table";
import Pagination from "../pagination/pagination";
import { DetailPanel } from "../detail-panel/detail-panel";
import { Loader } from "../loader";
import { TestErrorButton } from "../error-button";
import { useCharacters } from '../../hooks/use-characters';
import { Flyout } from '../flyout/flyout';
import { useQueryClient } from '@tanstack/react-query';
import './module.css';

const STORAGE_KEY = 'lastSearchQuery';
const ITEMS_PER_PAGE = 20;

export const SearchView = () => {
    const { data: allResults = [], isLoading, isFetching, error } = useCharacters();
    
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
        if (searchQuery) {
            localStorage.setItem(STORAGE_KEY, searchQuery);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [searchQuery]);

    const queryClient = useQueryClient();


    const handleRefreshData = () => {
        queryClient.invalidateQueries({ queryKey: ['characters'] });
    };

    const errorMessage = error instanceof Error ? error.message : null;
    
    const showLoader = isLoading || isFetching;

    return (
        <div className="search-view">
            {showLoader && <Loader size={60} speed={0.8} thickness={3} />}

            <button onClick={handleRefreshData} className="refresh-button">
                Refresh Data
            </button>
            
            <div className={`app-container ${selectedCharacterId ? 'with-details' : ''}`}>
                <div className="results-wrapper">
                    <div className="search-section">
                        <h2>Search</h2>
                        <SearchForm 
                            onSearch={handleSearch} 
                            loading={isLoading} 
                            initialQuery={searchQuery}
                        />
                    </div>
                    
                    <div className="results-section">
                        <h2>Results ({filteredResults.length})</h2>
                        <ResultsTable 
                            results={paginatedResults} 
                            loading={isLoading} 
                            error={errorMessage} 
                            hasSearched={!isLoading && allResults.length > 0}
                            onSelectCharacter={selectCharacter}
                            selectedCharacterId={selectedCharacterId}
                        />
                        
                        {!isLoading && !error && totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={goToPage}
                                disabled={isLoading}
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