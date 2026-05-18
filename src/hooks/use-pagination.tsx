import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UsePaginationProps {
    totalItems: number;
    itemsPerPage: number;
}

export const usePagination = ({ totalItems, itemsPerPage }: UsePaginationProps) => {
    const [searchParams, setSearchParams] = useSearchParams();    
   
    const initialPage = (() => {
        const pageFromUrl = searchParams.get('page');
        if (pageFromUrl) {
            const pageNumber = Number(pageFromUrl);
            if (!isNaN(pageNumber) && pageNumber > 0) {
                return pageNumber;
            }
        }
        return 1;
    })();
    
    const [currentPage, setCurrentPage] = useState(initialPage);
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));    
   
    const updateUrl = useCallback((page: number) => {
        const newParams = new URLSearchParams(searchParams);
        if (page === 1) {
            newParams.delete('page');
        } else {
            newParams.set('page', page.toString());
        }
        setSearchParams(newParams, { replace: true });
    }, [searchParams, setSearchParams]);
    
    const goToPage = useCallback((page: number) => {
        const validPage = Math.max(1, Math.min(page, totalPages));
        if (validPage === currentPage) return;
        
        setCurrentPage(validPage);
        updateUrl(validPage);
    }, [currentPage, totalPages, updateUrl]);
    
    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            updateUrl(newPage);
        }
    }, [currentPage, totalPages, updateUrl]);
    
    const prevPage = useCallback(() => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            updateUrl(newPage);
        }
    }, [currentPage, updateUrl]);
    
    const resetPage = useCallback(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
            updateUrl(1);
        }
    }, [currentPage, updateUrl]);
    
    const getCurrentPageItems = useCallback(<T,>(items: T[]): T[] => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    }, [currentPage, itemsPerPage]);
    
    return {
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        resetPage,
        getCurrentPageItems,
    };
};