import { Button } from "./button";

export default function Pagination({ className = "", limit, offset, onPageChange, total }) {
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 0;
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? Math.floor(offset) : 0;
  const safeTotal = Number.isFinite(total) && total > 0 ? Math.floor(total) : 0;
  if (!safeLimit || safeTotal <= safeLimit || typeof onPageChange !== "function") return null;

  const requestedPage = Math.floor(safeOffset / safeLimit) + 1;
  const pageCount = Math.ceil(safeTotal / safeLimit);
  const currentPage = Math.min(requestedPage, pageCount);
  const previousPage = requestedPage > pageCount ? pageCount : requestedPage - 1;

  return (
    <nav className={`pagination ${className}`.trim()} aria-label="Results pages">
      <Button
        className="button button--secondary"
        type="button"
        disabled={requestedPage <= 1}
        onClick={() => onPageChange(previousPage)}
      >
        Previous
      </Button>
      <span aria-live="polite">
        Page {currentPage} of {pageCount}
      </span>
      <Button
        className="button button--secondary"
        type="button"
        disabled={requestedPage >= pageCount}
        onClick={() => onPageChange(requestedPage + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
