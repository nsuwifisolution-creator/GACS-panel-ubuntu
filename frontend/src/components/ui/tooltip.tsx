import { cn } from '@/lib/cn';
import React from 'react';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps & React.HTMLAttributes<HTMLDivElement>>(({ content, children, side = 'top', className, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const sideStyles = {
    top: '-top-full -translate-y-2 left-1/2 -translate-x-1/2',
    bottom: '-bottom-full translate-y-2 left-1/2 -translate-x-1/2',
    left: '-left-full -translate-x-2 top-1/2 -translate-y-1/2',
    right: '-right-full translate-x-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded whitespace-nowrap',
            'dark:bg-slate-700',
            sideStyles[side],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
});

Tooltip.displayName = 'Tooltip';
