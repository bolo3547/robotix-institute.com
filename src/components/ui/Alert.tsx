'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:translate-y-[-2px]',
  {
    variants: {
      variant: {
        success: 'border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-600',
        warning: 'border-amber-200 bg-amber-50 text-amber-800 [&>svg]:text-amber-600',
        error: 'border-red-200 bg-red-50 text-red-800 [&>svg]:text-red-600',
        info: 'border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600',
        // Kid-friendly variant with playful styling
        playful: 'border-blue-300 bg-blue-50 text-blue-900 [&>svg]:text-blue-600 shadow-md',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertVariants> {
  onDismiss?: () => void;
  icon?: React.ReactNode;
  title?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, onDismiss, icon, title, children, ...props }, ref) => {
    // Determine default icon based on variant
    let defaultIcon = <Info className="h-4 w-4" />;
    if (variant === 'success') defaultIcon = <CheckCircle2 className="h-4 w-4" />;
    if (variant === 'warning' || variant === 'playful') defaultIcon = <AlertTriangle className="h-4 w-4" />;
    if (variant === 'error') defaultIcon = <AlertCircle className="h-4 w-4" />;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon || defaultIcon}
        <div className="flex-1">
          {title && <div className="font-semibold">{title}</div>}
          {children && <div className={title ? 'mt-1' : ''}>{children}</div>}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute right-4 top-4 rounded hover:bg-black/10 transition-colors p-1"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref as any} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
export default Alert;
