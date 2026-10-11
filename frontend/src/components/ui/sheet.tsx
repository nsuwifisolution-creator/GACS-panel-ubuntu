import { cn } from '@/lib/cn';
import React, { useState } from 'react';

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Sheet = ({ children }: SheetProps) => {
  return <>{children}</>;
};

export interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(({ ...props }, ref) => (
  <button ref={ref} {...props} />
));

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(({ className, side = 'right', ...props }, ref) => {
  const sideStyles = {
    top: 'top-0 left-0 right-0',
    right: 'right-0 top-0 bottom-0 w-3/4 md:w-1/2 lg:w-2/5',
    bottom: 'bottom-0 left-0 right-0',
    left: 'left-0 top-0 bottom-0 w-3/4 md:w-1/2',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'fixed z-50 border border-border bg-card shadow-lg animate-slide-in',
        sideStyles[side],
        className
      )}
      {...props}
    />
  );
});

SheetContent.displayName = 'SheetContent';
SheetTrigger.displayName = 'SheetTrigger';
