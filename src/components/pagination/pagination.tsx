import './pagination.css';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      {}
      <button
        className="pagination-button"
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
      >
        Previous
      </button>

      {}
      <div className="pagination-pages">
        {pages.map((page) => (
          <button
            key={page}
            className={
              page === currentPage
                ? 'pagination-button pagination-button-active'
                : 'pagination-button'
            }
            type="button"
            onClick={() => onPageChange(page)}
            disabled={disabled || page === currentPage}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {}
      <button
        className="pagination-button"
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
}