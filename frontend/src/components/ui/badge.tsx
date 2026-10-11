import { cn } from '@/lib/cn';
import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

const variants = {
  default: 'bg-primary/10 text-primary border border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
  outline: 'border border-input text-foreground',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border border-green-300 dark:border-green-700',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 border border-amber-300 dark:border-amber-700',
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors', variants[variant], className)}
    {...props}
  />
));

Badge.displayName = 'Badge';
