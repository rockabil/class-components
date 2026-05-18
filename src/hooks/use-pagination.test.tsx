import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { usePagination } from './index';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
);

describe('usePagination', () => {
    beforeEach(() => {
        window.history.pushState({}, '', '/');
    });

    it('should initialize with page 1', () => {
        const { result } = renderHook(
            () => usePagination({ totalItems: 50, itemsPerPage: 10 }),
            { wrapper }
        );

        expect(result.current.currentPage).toBe(1);
        expect(result.current.totalPages).toBe(5);
    });
    
    it('should get items for current page', () => {
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const { result } = renderHook(
            () => usePagination({ totalItems: items.length, itemsPerPage: 10 }),
            { wrapper }
        );

        const pageItems = result.current.getCurrentPageItems(items);
        expect(pageItems).toHaveLength(10);
        expect(pageItems[0]).toBe(1);
        expect(pageItems[9]).toBe(10);
    });

    it('should handle next and previous pages', async () => {
        const { result } = renderHook(
            () => usePagination({ totalItems: 50, itemsPerPage: 10 }),
            { wrapper }
        );

        act(() => {
            result.current.nextPage();
        });

        await waitFor(() => {
            expect(result.current.currentPage).toBe(2);
        });

        act(() => {
            result.current.prevPage();
        });

        await waitFor(() => {
            expect(result.current.currentPage).toBe(1);
        });
    });

    it('should not go beyond page limits', async () => {
        const { result } = renderHook(
            () => usePagination({ totalItems: 50, itemsPerPage: 10 }),
            { wrapper }
        );

        act(() => {
            result.current.goToPage(0);
        });
        
        await waitFor(() => {
            expect(result.current.currentPage).toBe(1);
        });

        act(() => {
            result.current.goToPage(10);
        });

        await waitFor(() => {
            expect(result.current.currentPage).toBe(5);
        });
    });

    it('should handle when totalItems changes', () => {
        const { result, rerender } = renderHook(
            ({ totalItems }) => usePagination({ totalItems, itemsPerPage: 10 }),
            {
                initialProps: { totalItems: 50 },
                wrapper
            }
        );

        expect(result.current.totalPages).toBe(5);
        expect(result.current.currentPage).toBe(1);
        
        rerender({ totalItems: 25 });
        
        expect(result.current.totalPages).toBe(3);        
        expect(result.current.currentPage).toBe(1);
    });
});