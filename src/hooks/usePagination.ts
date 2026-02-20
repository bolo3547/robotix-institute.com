'use client';

import { useMemo } from 'react';

interface UsePaginationOptions {
  /** Total number of items */
  totalItems: number;
  /** Items per page */
  pageSize: number;
  /** Current page (1-indexed) */
  currentPage: number;
  /** Number of sibling pages to show on each side of current page */
  siblingCount?: number;
}

interface UsePaginationResult {
  /** Total number of pages */
  totalPages: number;
  /** Whether there's a previous page */
  hasPrevious: boolean;
  /** Whether there's a next page */
  hasNext: boolean;
  /** Array of page numbers and ellipsis markers to render */
  pages: (number | '...')[];
  /** Start index of current page items (0-based) */
  startIndex: number;
  /** End index of current page items (exclusive) */
  endIndex: number;
}

/**
 * Calculate pagination metadata for a paginated list.
 *
 * @example
 * const { totalPages, pages, hasPrevious, hasNext } = usePagination({
 *   totalItems: 100,
 *   pageSize: 10,
 *   currentPage: 3,
 * });
 */
export function usePagination({
  totalItems,
  pageSize,
  currentPage,
  siblingCount = 1,
}: UsePaginationOptions): UsePaginationResult {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const pages = useMemo(() => {
    const range = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // Total page numbers to show (siblings + current + first + last + 2 ellipsis)
    const totalPageNumbers = siblingCount * 2 + 5;

    // If we can show all pages without ellipsis
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, '...' as const, totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, '...' as const, ...rightRange];
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, '...' as const, ...middleRange, '...' as const, totalPages];
  }, [totalItems, pageSize, currentPage, siblingCount, totalPages]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    totalPages,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
    pages,
    startIndex,
    endIndex,
  };
}
