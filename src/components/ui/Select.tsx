'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Label shown above the select */
  label?: string;
  /** Options list */
  options: SelectOption[];
  /** Placeholder option text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Styled native <select> element.
 *
 * @example
 * <Select
 *   label="Program"
 *   options={[{ label: 'Robotics', value: 'robotics' }]}
 *   value={selected}
 *   onChange={(e) => setSelected(e.target.value)}
 * />
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, error, size = 'md', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full appearance-none rounded-lg border bg-white pr-10 transition-colors',
              'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'dark:bg-gray-800 dark:text-gray-200',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 dark:border-gray-600',
              sizeClasses[size],
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
