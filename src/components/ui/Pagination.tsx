'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when page changes */
  onPageChange: (page: number) => void;
  /** Number of sibling pages to show */
  siblingCount?: number;
  /** Additional class */
  className?: string;
}

function getPageNumbers(current: number, total: number, siblings: number): (number | '...')[] {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const totalNumbers = siblings * 2 + 5;
  if (totalNumbers >= total) return range(1, total);

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);

  const showLeftDots = left > 2;
  const showRightDots = right < total - 1;

  if (!showLeftDots && showRightDots) {
    return [...range(1, 3 + 2 * siblings), '...', total];
  }
  if (showLeftDots && !showRightDots) {
    return [1, '...', ...range(total - (2 + 2 * siblings), total)];
  }
  return [1, '...', ...range(left, right), '...', total];
}

/**
 * Pagination component for paged data.
 *
 * @example
 * <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages, siblingCount);

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)} aria-label="Pagination">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex items-center rounded-lg px-2 py-2 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 py-1 text-gray-400">
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-brand-600 text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            )}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="inline-flex items-center rounded-lg px-2 py-2 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

export default Pagination;
