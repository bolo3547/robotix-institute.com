import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class names */
  className?: string;
  /** Screen reader label */
  label?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

/**
 * Loading spinner indicator.
 *
 * @example
 * {isLoading && <Spinner />}
 * <Spinner size="lg" label="Loading data..." />
 */
export function Spinner({ size = 'md', className, label = 'Loading...' }: SpinnerProps) {
  return (
    <span className={cn('inline-flex items-center', className)} role="status">
      <Loader2 className={cn('animate-spin text-brand-600', sizeClasses[size])} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default Spinner;
