
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton rounded-md bg-gray-200', className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ className, lines = 3 }: SkeletonProps & { lines?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full',
            className
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 space-y-4',
        className
      )}
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <Skeleton className="h-40 w-full rounded-lg" />
      
      {/* Title */}
      <Skeleton className="h-6 w-3/4" />
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      
      {/* Button */}
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

export function SkeletonAvatar({ className, size = 'md' }: SkeletonProps & { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <Skeleton
      className={cn('rounded-full', sizes[size], className)}
    />
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" aria-hidden="true">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="px-6 py-4 border-b border-gray-100 last:border-0 flex gap-4"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonProgram() {
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-6"
      aria-hidden="true"
    >
      {/* Badge row */}
      <div className="flex justify-between mb-4">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-5 w-16" />
      </div>
      
      {/* Title */}
      <Skeleton className="h-7 w-2/3 mb-2" />
      
      {/* Subtitle */}
      <Skeleton className="h-4 w-1/3 mb-4" />
      
      {/* Price */}
      <Skeleton className="h-10 w-32 mb-6" />
      
      {/* Button */}
      <Skeleton className="h-10 w-full mb-6" />
      
      {/* Features list */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
