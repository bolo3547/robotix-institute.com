import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind CSS class names with clsx and twMerge
 * Handles class name conflicts and conditional classes
 * @param inputs - Class names, objects, or arrays to combine
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
