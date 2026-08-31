import { Button } from "./button";

export default function Pagination({ limit, offset, onPageChange, total }) {
  if (!total || total <= limit) return null;

  const currentPage = Math.floor(offset / limit) + 1;
  const pageCount = Math.ceil(total / limit);

  return (
    <nav className="pagination" aria-label="Results pages">
      <Button
        className="button button--secondary"
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <span aria-live="polite">
        Page {currentPage} of {pageCount}
      </span>
      <Button
        className="button button--secondary"
        type="button"
        disabled={currentPage >= pageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
