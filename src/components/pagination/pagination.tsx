import './pagination.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export const Pagination = ({ currentPage, totalPages, onPageChange, disabled = false }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={disabled || currentPage === 1}
                className="pagination-button"
                aria-label="Previous page"
            >
                ← Previous
            </button>
            
            <div className="pagination-pages">
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`dots-${index}`} className="pagination-dots">...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            disabled={disabled}
                            className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={disabled || currentPage === totalPages}
                className="pagination-button"
                aria-label="Next page"
            >
                Next →
            </button>
        </nav>
    );
};