import { cn } from '@/lib/cn';
import React from 'react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(({ icon, title, description, action, className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)} {...props}>
    {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
    {action && <div>{action}</div>}
  </div>
));

EmptyState.displayName = 'EmptyState';
