import { Button } from "./button";

export function paginationPages(currentPage, pageCount) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 4) return [1, 2, 3, 4, 5, "end-gap", pageCount];
  if (currentPage >= pageCount - 3) {
    return [
      1,
      "start-gap",
      ...Array.from({ length: 5 }, (_, index) => pageCount - 4 + index),
    ];
  }

  return [
    1,
    "start-gap",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-gap",
    pageCount,
  ];
}

export default function Pagination({ className = "", limit, offset, onPageChange, total }) {
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 0;
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? Math.floor(offset) : 0;
  const safeTotal = Number.isFinite(total) && total > 0 ? Math.floor(total) : 0;
  if (!safeLimit || safeTotal <= safeLimit || typeof onPageChange !== "function") return null;

  const requestedPage = Math.floor(safeOffset / safeLimit) + 1;
  const pageCount = Math.ceil(safeTotal / safeLimit);
  const currentPage = Math.min(requestedPage, pageCount);
  const previousPage = requestedPage > pageCount ? pageCount : requestedPage - 1;
  const pages = paginationPages(currentPage, pageCount);

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
      <div className="pagination__pages">
        {pages.map((page) =>
          typeof page === "number" ? (
            <Button
              key={page}
              type="button"
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              className="pagination__page"
              aria-label={
                page === currentPage ? `Page ${page}, current page` : `Go to page ${page}`
              }
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ) : (
            <span className="pagination__ellipsis" aria-hidden="true" key={page}>
              …
            </span>
          )
        )}
      </div>
      <Button
        className="button button--secondary"
        type="button"
        disabled={requestedPage >= pageCount}
        onClick={() => onPageChange(requestedPage + 1)}
      >
        Next
      </Button>
      <span className="sr-only" aria-live="polite">
        Page {currentPage} of {pageCount}
      </span>
    </nav>
  );
}
