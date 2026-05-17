// src/hooks/usePagination.ts
import { useState } from 'react';
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
    
    const updateUrl = (page: number) => {
        if (page === 1) {
            searchParams.delete('page');
        } else {
            searchParams.set('page', page.toString());
        }
        setSearchParams(searchParams);
    };
    
    const goToPage = (page: number) => {
        const validPage = Math.max(1, Math.min(page, totalPages));
        if (validPage === currentPage) return;

        setCurrentPage(validPage);
        updateUrl(validPage);
    };
    
    const nextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            updateUrl(newPage);
        }
    };
    
    const prevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            updateUrl(newPage);
        }
    };
    
    const resetPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
            updateUrl(1);
        }
    };
        
    const getCurrentPageItems = <T,>(items: T[]): T[] => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    };
    
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