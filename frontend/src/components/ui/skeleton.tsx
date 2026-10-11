import { cn } from '@/lib/cn';
import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('skeleton rounded-lg bg-muted', className)} {...props} />
));

Skeleton.displayName = 'Skeleton';
