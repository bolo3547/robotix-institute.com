'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        // Status badges
        active: 'bg-green-100 text-green-800 border border-green-300',
        inactive: 'bg-gray-100 text-gray-800 border border-gray-300',
        pending: 'bg-amber-100 text-amber-800 border border-amber-300',
        completed: 'bg-green-100 text-green-800 border border-green-300',
        
        // Role badges - Kid-friendly
        parent: 'bg-blue-100 text-blue-800 border border-blue-300',
        child: 'bg-purple-100 text-purple-800 border border-purple-300',
        
        // Role badges - Professional
        instructor: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
        admin: 'bg-slate-200 text-slate-900 border border-slate-400',
        
        // Level badges
        beginner: 'bg-cyan-100 text-cyan-800 border border-cyan-300',
        intermediate: 'bg-amber-100 text-amber-800 border border-amber-300',
        advanced: 'bg-red-100 text-red-800 border border-red-300',
        
        // Semantic badges
        success: 'bg-green-100 text-green-800 border border-green-300',
        warning: 'bg-amber-100 text-amber-800 border border-amber-300',
        error: 'bg-red-100 text-red-800 border border-red-300',
        info: 'bg-blue-100 text-blue-800 border border-blue-300',
        
        // Default
        default: 'bg-gray-100 text-gray-800 border border-gray-300',
      },
      size: {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, icon, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{props.children}</span>
    </div>
  )
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
export default Badge;
