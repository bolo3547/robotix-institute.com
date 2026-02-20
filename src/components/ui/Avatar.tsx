import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  /** Image source URL */
  src?: string | null;
  /** Fallback text (typically initials) */
  fallback?: string;
  /** Alt text */
  alt?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Additional class names */
  className?: string;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

/**
 * User avatar with image or initials fallback.
 *
 * @example
 * <Avatar src={user.image} fallback="JD" alt={user.name} />
 */
export function Avatar({ src, fallback, alt = '', size = 'md', className }: AvatarProps) {
  const initials =
    fallback ||
    alt
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'inline-block rounded-full object-cover ring-2 ring-white dark:ring-gray-800',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-300',
        sizeClasses[size],
        className
      )}
      aria-label={alt}
    >
      {initials}
    </span>
  );
}

export default Avatar;
