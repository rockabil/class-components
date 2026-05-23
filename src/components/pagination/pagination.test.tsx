import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../components/__tests__/test-utils';
import Pagination  from './pagination';

describe('Pagination', () => {
    it('should not render when totalPages <= 1', () => {
        render(<Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />);
        expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('should render pagination controls when totalPages > 1', () => {
        render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);        
        
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should call onPageChange when clicking next', () => {
        const onPageChange = vi.fn();
        render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
        
        fireEvent.click(screen.getByText('Next'));
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange when clicking previous', () => {
        const onPageChange = vi.fn();
        render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
        
        fireEvent.click(screen.getByText('Previous'));
        expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('should disable previous button on first page', () => {
        render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
        
        expect(screen.getByText('Previous')).toBeDisabled();
        expect(screen.getByText('Next')).not.toBeDisabled();
    });

    it('should disable next button on last page', () => {
        render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
        
        expect(screen.getByText('Previous')).not.toBeDisabled();
        expect(screen.getByText('Next')).toBeDisabled();
    });
});