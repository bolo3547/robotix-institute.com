'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ─── Table Root ───────────────────────────────────────────────

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className={cn('w-full text-sm text-left', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

// ─── Table Head ───────────────────────────────────────────────

export function TableHead({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700', className)} {...props}>
      {children}
    </thead>
  );
}

// ─── Table Body ───────────────────────────────────────────────

export function TableBody({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)} {...props}>
      {children}
    </tbody>
  );
}

// ─── Table Row ────────────────────────────────────────────────

export function TableRow({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors', className)} {...props}>
      {children}
    </tr>
  );
}

// ─── Table Header Cell ────────────────────────────────────────

export function TableHeaderCell({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

// ─── Table Cell ───────────────────────────────────────────────

export function TableCell({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-3 text-gray-700 dark:text-gray-300', className)} {...props}>
      {children}
    </td>
  );
}

export default Table;
